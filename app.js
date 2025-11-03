// Base API URL
const API_BASE = "http://localhost:3000/api";
let boards = [];
let currentBoard = null;
let columns = [];
let cards = [];
let draggedCard = null;

// === Initialization ===
async function init() {
  await loadBoards();
  renderBoards();
  setupTheme();
  setupBoardHeader();
  renderHeader();
}

document.addEventListener("DOMContentLoaded", () => {
  // Open board modal
  document.getElementById("boardHeaderBtn").addEventListener("click", () => {
    document.getElementById("boardModal").style.display = "block";
  });

  // Submit board form
  document.getElementById("boardForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("boardTitleInput").value.trim();
    const includeColumns = document.getElementById("defaultColumns").checked;
    if (!title) return alert("Title is required");

    try {
      const res = await fetch(`${API_BASE}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, createDefaultColumns: includeColumns }),
      });
      const data = await res.json();
      if (data.success) {
        await loadBoards();
        renderBoards();
        closeBoardModal();
      } else {
        alert("❌ Failed to create board: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Error creating board:", err);
      alert("❌ Error creating board, see console");
    }
  });

  // === Submit Card Form ===
  document.getElementById("cardForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const modal = document.getElementById("cardModal");
    const columnId = parseInt(modal.dataset.columnId);
    const title = document.getElementById("cardTitleInput").value.trim();
    const description = document.getElementById("cardDescInput").value.trim();
    const priority = document.getElementById("cardPriorityInput").value;

    if (!title) return alert("Title is required");

    const res = await fetch(
      `${API_BASE}/cards/board/${currentBoard.id}/column/${columnId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      }
    );

    const data = await res.json();
    if (data.success) {
      await openBoard(currentBoard.id, currentBoard.title);
      renderBreadcrumbs();
      closeModal();
    } else {
      alert("❌ Failed to add card");
    }
  });

  // === Submit Add Column Form ===
  document
    .getElementById("columnForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("columnTitleInput").value.trim();
      if (!title) return alert("Column title is required");

      try {
        const res = await fetch(`${API_BASE}/columns/${currentBoard.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, position: columns.length + 1 }),
        });

        const data = await res.json();
        console.log(data);

        if (data) {
          columns.push(data); // ✅ Add new column locally
          renderKanban();
          closeColumnModal();
        } else {
          alert("❌ Failed to create column");
        }
      } catch (err) {
        console.error("❌ Error adding column:", err);
        alert("❌ Error creating column, see console");
      }
    });

  init();
});

function renderBreadcrumbs() {
  const bc = document.getElementById("breadcrumbs");
  if (!bc) return;
  bc.innerHTML = "";

  // Only render breadcrumbs if a board is open
  if (!currentBoard) return;

  // 1️⃣ "Boards" clickable link
  const boardsLink = document.createElement("span");
  boardsLink.className = "breadcrumb-link";
  boardsLink.textContent = "Boards";
  boardsLink.style.cursor = "pointer";
  boardsLink.onclick = async () => {
    currentBoard = null;
    await loadBoards();
    renderBoards();
    renderHeader();
    renderBreadcrumbs(); // clear breadcrumbs
  };

  // 2️⃣ Separator
  const separator = document.createElement("span");
  separator.textContent = " > ";

  // 3️⃣ Current board name
  const boardName = document.createElement("span");
  boardName.textContent = currentBoard.title;

  bc.appendChild(boardsLink);
  bc.appendChild(separator);
  bc.appendChild(boardName);
}


// === Setup Add Board Button ===
function setupBoardHeader() {
  const headerBtn = document.getElementById("boardHeaderBtn");
  headerBtn.addEventListener("click", () => {
    if (currentBoard) openAddColumnModal();
    else document.getElementById("boardModal").style.display = "block";
  });
}

function renderHeader() {
  const headerBtn = document.getElementById("boardHeaderBtn");
  const boardTitleEl = document.querySelector(".board-title");
  
  // Clear previous content
  boardTitleEl.innerHTML = "";

  if (currentBoard) {
    // Header button becomes "Add Column"
    headerBtn.textContent = "Add Column";

    // Create back arrow / breadcrumb
    const backLink = document.createElement("span");
    backLink.textContent = "Boards";
    backLink.className = "breadcrumb-link";
    backLink.style.cursor = "pointer";
    backLink.onclick = async () => {
      currentBoard = null;
      await loadBoards();
      renderBoards();
      renderHeader();
      renderBreadcrumbs(); // optional: clear breadcrumbs
    };

    const separator = document.createElement("span");
    separator.textContent = " > ";

    const boardName = document.createElement("span");
    boardName.textContent = currentBoard.title;

    boardTitleEl.appendChild(backLink);
    boardTitleEl.appendChild(separator);
    boardTitleEl.appendChild(boardName);
  } else {
    // No board open: header shows "My Boards"
    headerBtn.textContent = "Add Board";
    boardTitleEl.textContent = "My Boards";
  }
}


// === Fetch Boards ===
async function loadBoards() {
  try {
    const res = await fetch(`${API_BASE}/boards`);
    const data = await res.json();
    if (data.success) boards = data.data;
  } catch (err) {
    console.error("❌ Failed to load boards:", err);
  }
}

// === Render Boards List ===
function renderBoards() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  if (!boards.length) {
    board.innerHTML = `<p>No boards found. Click below to create one.</p>                       `;
    return;
  }

  boards.forEach((b) => {
    const div = document.createElement("div");
    div.className = "board-card";
    div.innerHTML = `
      <div class="board-info">
        <h2>${escapeHtml(b.Title)}</h2>
        <small>Created ${new Date(b.CreatedAt).toLocaleString()}</small>
      </div>
      <div class="board-actions">
        <button onclick="openBoard(${b.BoardId}, '${b.Title}')">Open</button>
        <button class="secondary danger" onclick="deleteBoard(${
          b.BoardId
        })">Delete</button>
      </div>
    `;
    board.appendChild(div);
  });
}

// Close board modal
function closeBoardModal() {
  document.getElementById("boardModal").style.display = "none";
  document.getElementById("boardForm").reset();
}

// === Delete Board ===
async function deleteBoard(id) {
  if (!confirm("Delete this board?")) return;
  const res = await fetch(`${API_BASE}/boards/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (data.success) {
    await loadBoards();
    renderBoards();
  } else {
    alert("❌ Could not delete board");
  }
}

// === Open Board (columns + cards) ===
async function openBoard(boardId, title) {
  currentBoard = { id: boardId, title };
  renderHeader(); //document.querySelector(".board-title").textContent = title;

  const [colsRes, cardsRes] = await Promise.all([
    fetch(`${API_BASE}/columns/board/${boardId}`),
    fetch(`${API_BASE}/cards/board/${boardId}`),
  ]);

  const colsData = await colsRes.json();
  const cardsData = await cardsRes.json();
  //   console.log(colsData, cardsData);
  columns = colsData ? colsData : [];
  cards = cardsData.success ? cardsData.data : [];

  renderKanban();
  renderBreadcrumbs();
}

// === Render Kanban Columns ===
function renderKanban() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";

  columns.forEach((col) => {
    const colDiv = document.createElement("div");
    colDiv.className = "column";

    const filteredCards = cards.filter((c) => c.ColumnId === col.ColumnId);

    colDiv.innerHTML = `
      <div class="column-header">
        <div class="column-title">${col.Title}
          <span class="column-count">${filteredCards.length}</span>
        </div>
      </div>
      <div class="cards-container" data-column-id="${col.ColumnId}"></div>
      <button class="add-card-btn" onclick="openAddCardModal(${col.ColumnId})">+ Add card</button>
    `;

    const container = colDiv.querySelector(".cards-container");
    filteredCards.forEach((card) =>
      container.appendChild(createCardElement(card, col.ColumnId))
    );

    setupDropZone(container, col.ColumnId);
    boardEl.appendChild(colDiv);
  });
}

// === Card Element ===
function createCardElement(card, columnId) {
  const div = document.createElement("div");
  div.className = "card";
  div.draggable = true;
  div.dataset.cardId = card.CardId;

  div.innerHTML = `
    <div class="card-header">
      <div class="card-title">${escapeHtml(card.Title)}</div>
      <div class="card-actions">
        <button class="icon-btn" onclick="deleteCard(${
          card.CardId
        })">🗑️</button>
      </div>
    </div>
    ${
      card.Description
        ? `<div class="card-description">${escapeHtml(card.Description)}</div>`
        : ""
    }
    <div class="card-footer">
      <span class="priority-badge priority-${
        card.Priority?.toLowerCase() || "medium"
      }">${card.Priority || "Medium"}</span>
    </div>
  `;

  div.addEventListener("dragstart", () => {
    draggedCard = { id: card.CardId, from: columnId };
    div.classList.add("dragging");
  });
  div.addEventListener("dragend", () => div.classList.remove("dragging"));

  return div;
}

// === Drag & Drop Columns ===
function setupDropZone(container, columnId) {
  container.addEventListener("dragover", (e) => e.preventDefault());
  container.addEventListener("drop", async (e) => {
    e.preventDefault();
    if (draggedCard && draggedCard.from !== columnId) {
      await updateCardColumn(draggedCard.id, columnId);
    }
  });
}

// === Open Add Card Modal ===
function openAddCardModal(columnId) {
  const modal = document.getElementById("cardModal");
  modal.style.display = "block";
  modal.dataset.columnId = columnId;

  // Reset form
  document.getElementById("cardForm").reset();
  document.getElementById("modalTitle").textContent = "Add New Card";
}

// === Close Modal ===
function closeModal() {
  document.getElementById("cardModal").style.display = "none";
  delete document.getElementById("cardModal").dataset.columnId;
}

// === Delete Card ===
async function deleteCard(cardId) {
  if (!confirm("Delete this card?")) return;
  const res = await fetch(`${API_BASE}/cards/${cardId}`, { method: "DELETE" });
  const data = await res.json();
  if (data.success) await openBoard(currentBoard.id, currentBoard.title);
}

// === Update Card Column ===
async function updateCardColumn(cardId, columnId) {
  await fetch(`${API_BASE}/cards/${cardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId }),
  });
  await openBoard(currentBoard.id, currentBoard.title);
}

// === Open Add Column Modal ===
function openAddColumnModal() {
  const modal = document.getElementById("columnModal");
  modal.style.display = "block";
  document.getElementById("columnForm").reset();
  document.getElementById("columnModalTitle").textContent = "Add New Column";
}

// === Close Column Modal ===
function closeColumnModal() {
  document.getElementById("columnModal").style.display = "none";
}

// === Utilities ===
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// === Theme ===
function setupTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon();
}

function toggleTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  const next = theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute("data-theme");
  document.querySelector(".theme-toggle").textContent =
    theme === "dark" ? "☀️" : "🌙";
}
