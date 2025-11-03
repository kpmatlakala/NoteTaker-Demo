// Base API URL
const API_BASE = 'http://localhost:3000/api';
let boards = [];
let currentBoard = null;
let cards = [];

// === Initialization ===
async function init() {
  await loadBoards();
  renderBoards();
  setupTheme();
}

// === Fetch Boards ===
async function loadBoards() {
  try {
    const res = await fetch(`${API_BASE}/boards`);
    const data = await res.json();
    if (data.success) boards = data.data;
  } catch (err) {
    console.error('❌ Failed to load boards:', err);
  }
}

// === Render Boards List ===
function renderBoards() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  if (!boards.length) {
    board.innerHTML = `<p>No boards found. Click below to create one.</p>
                       <button onclick="createBoard()">➕ Create Board</button>`;
    return;
  }

  boards.forEach(b => {
    const div = document.createElement('div');
    div.className = 'board-card';
    div.innerHTML = `
      <div class="board-info">
        <h2>${escapeHtml(b.Title)}</h2>
        <small>Created ${new Date(b.CreatedAt).toLocaleString()}</small>
      </div>
      <div class="board-actions">
        <button onclick="openBoard(${b.BoardId}, '${b.Title}')">Open</button>
        <button class="secondary danger" onclick="deleteBoard(${b.BoardId})">Delete</button>
      </div>
    `;
    board.appendChild(div);
  });
}

// === Create New Board ===
async function createBoard() {
  const name = prompt('Enter board name:');
  if (!name) return;

  const res = await fetch(`${API_BASE}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: name })
  });
  const data = await res.json();
  if (data.success) {
    await loadBoards();
    renderBoards();
  } else {
    alert('❌ Failed to create board');
  }
}

// === Delete Board ===
async function deleteBoard(id) {
  if (!confirm('Delete this board?')) return;
  const res = await fetch(`${API_BASE}/boards/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.success) {
    await loadBoards();
    renderBoards();
  } else {
    alert('❌ Could not delete board');
  }
}

// === Open Board (and load cards) ===
async function openBoard(boardId, title) {
  currentBoard = { id: boardId, title };
  document.querySelector('.board-title').textContent = title;
  await loadCards(boardId);
  renderKanban();
}

// === Fetch Cards for Board ===
async function loadCards(boardId) {
  try {
    const res = await fetch(`${API_BASE}/cards/board/${boardId}`);
    const data = await res.json();
    if (data.success) {
      cards = data.data;
    } else {
      cards = [];
    }
  } catch (err) {
    console.error('❌ Failed to load cards:', err);
    cards = [];
  }
}

// === Render Kanban Columns ===
function renderKanban() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const columns = ['Backlog', 'In Progress', 'Done'];

  columns.forEach(col => {
    const colDiv = document.createElement('div');
    colDiv.className = 'column';

    const filteredCards = cards.filter(c => (c.Status || 'Backlog') === col);

    colDiv.innerHTML = `
      <div class="column-header">
        <div class="column-title">${col}
          <span class="column-count">${filteredCards.length}</span>
        </div>
      </div>
      <div class="cards-container" data-column="${col}"></div>
      <button class="add-card-btn" onclick="openAddCard('${col}')">+ Add card</button>
    `;

    const container = colDiv.querySelector('.cards-container');
    filteredCards.forEach(card => container.appendChild(createCardElement(card, col)));

    setupDropZone(container, col);
    board.appendChild(colDiv);
  });
}

// === Card Element ===
function createCardElement(card, column) {
  const div = document.createElement('div');
  div.className = 'card';
  div.draggable = true;
  div.dataset.cardId = card.CardId;

  div.innerHTML = `
    <div class="card-header">
      <div class="card-title">${escapeHtml(card.Title)}</div>
      <div class="card-actions">
        <button class="icon-btn" onclick="deleteCard(${card.CardId})">🗑️</button>
      </div>
    </div>
    ${card.Description ? `<div class="card-description">${escapeHtml(card.Description)}</div>` : ''}
    <div class="card-footer">
      <span class="priority-badge priority-${card.Priority?.toLowerCase()}">${card.Priority || 'medium'}</span>
    </div>
  `;

  div.addEventListener('dragstart', () => {
    draggedCard = { id: card.CardId, from: column };
    div.classList.add('dragging');
  });
  div.addEventListener('dragend', () => div.classList.remove('dragging'));

  return div;
}

// === Drop Handling ===
function setupDropZone(container, column) {
  container.addEventListener('dragover', e => e.preventDefault());
  container.addEventListener('drop', async e => {
    e.preventDefault();
    if (draggedCard && draggedCard.from !== column) {
      await updateCardStatus(draggedCard.id, column);
    }
  });
}

// === Add / Delete / Move Cards ===
async function addCard(column) {
  const title = prompt('Card title:');
  if (!title) return;
  const description = prompt('Description (optional):');
  const priority = prompt('Priority (Low/Medium/High):', 'Medium');

  const res = await fetch(`${API_BASE}/cards/board/${currentBoard.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority, status: column })
  });

  const data = await res.json();
  if (data.success) await openBoard(currentBoard.id, currentBoard.title);
}

async function deleteCard(cardId) {
  if (!confirm('Delete this card?')) return;
  await fetch(`${API_BASE}/cards/${cardId}`, { method: 'DELETE' });
  await openBoard(currentBoard.id, currentBoard.title);
}

async function updateCardStatus(cardId, newStatus) {
  await fetch(`${API_BASE}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  await openBoard(currentBoard.id, currentBoard.title);
}

// === Utilities ===
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

let draggedCard = null;

// === Theme ===
function setupTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon();
}

function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  const next = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme');
  document.querySelector('.theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

init();
