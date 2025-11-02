// Base API URL (relative to current host)
const API_BASE = '/api/boards';

let currentBoard = null;

// === Initialization ===
async function init() {
    await loadBoard();
    renderBoard();
    setupTheme();
}

// === Fetch Board from API ===
async function loadBoard() {
    try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
            currentBoard = data.data[0]; // Just grab the first board for now
        } else {
            // Create default board if none exists
            const create = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'My Board' })
            });
            const newData = await create.json();
            currentBoard = newData.data;
        }
    } catch (err) {
        console.error('API unavailable, falling back to localStorage:', err);
        loadFromStorage();
    }
}

// === Render Board ===
function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    currentBoard.columns.forEach(col => {
        const colDiv = document.createElement('div');
        colDiv.className = 'column';
        colDiv.innerHTML = `
            <div class="column-header">
                <div class="column-title">${col.title}
                    <span class="column-count">${col.cards.length}</span>
                </div>
            </div>
            <div class="cards-container" data-column="${col.id}"></div>
            <button class="add-card-btn" onclick="openAddCard('${col.id}')">+ Add card</button>
        `;

        const container = colDiv.querySelector('.cards-container');
        col.cards.forEach(card => container.appendChild(createCardElement(card, col.id)));

        setupDropZone(container, col.id);
        board.appendChild(colDiv);
    });
}

// === Card Element ===
function createCardElement(card, columnId) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.draggable = true;
    cardDiv.dataset.cardId = card.id;

    cardDiv.innerHTML = `
        <div class="card-header">
            <div class="card-title">${escapeHtml(card.title)}</div>
            <div class="card-actions">
                <button class="icon-btn" onclick="openEditCard('${columnId}', '${card.id}')" title="Edit">✏️</button>
                <button class="icon-btn" onclick="deleteCard('${columnId}', '${card.id}')" title="Delete">🗑️</button>
            </div>
        </div>
        ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
        <div class="card-footer">
            <span class="priority-badge priority-${card.priority}">${card.priority}</span>
        </div>
    `;

    cardDiv.addEventListener('dragstart', () => {
        draggedCard = { card, columnId };
        cardDiv.classList.add('dragging');
    });
    cardDiv.addEventListener('dragend', () => cardDiv.classList.remove('dragging'));
    return cardDiv;
}

// === Drop Handling ===
function setupDropZone(container, columnId) {
    container.addEventListener('dragover', e => e.preventDefault());
    container.addEventListener('drop', async e => {
        e.preventDefault();
        if (draggedCard && draggedCard.columnId !== columnId) {
            await moveCard(draggedCard.card.id, columnId);
        }
    });
}

// === CRUD Actions ===
async function addCard(columnId, title, description, priority) {
    const res = await fetch(`${API_BASE}/${currentBoard.id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, columnId })
    });
    const data = await res.json();
    if (data.success) await refreshBoard();
}

async function moveCard(cardId, newColumnId) {
    await fetch(`${API_BASE}/${currentBoard.id}/cards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId: newColumnId })
    });
    await refreshBoard();
}

async function deleteCard(columnId, cardId) {
    if (!confirm('Delete this card?')) return;
    await fetch(`${API_BASE}/${currentBoard.id}/cards/${cardId}`, { method: 'DELETE' });
    await refreshBoard();
}

async function refreshBoard() {
    const res = await fetch(`${API_BASE}/${currentBoard.id}`);
    const data = await res.json();
    if (data.success) {
        currentBoard = data.data;
        renderBoard();
    }
}

// === Modal Form Logic ===
let draggedCard = null;
let editingCard = null;
let editingColumn = null;

function openAddCard(columnId) {
    editingCard = null;
    editingColumn = columnId;
    document.getElementById('modalTitle').textContent = 'Add New Card';
    document.getElementById('cardForm').reset();
    document.getElementById('cardModal').classList.add('active');
}

function openEditCard(columnId, cardId) {
    const col = currentBoard.columns.find(c => c.id === columnId);
    const card = col.cards.find(c => c.id === cardId);
    editingCard = cardId;
    editingColumn = columnId;

    document.getElementById('modalTitle').textContent = 'Edit Card';
    document.getElementById('cardTitleInput').value = card.title;
    document.getElementById('cardDescInput').value = card.description;
    document.getElementById('cardPriorityInput').value = card.priority;
    document.getElementById('cardModal').classList.add('active');
}

document.getElementById('cardForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('cardTitleInput').value;
    const description = document.getElementById('cardDescInput').value;
    const priority = document.getElementById('cardPriorityInput').value;

    if (editingCard) {
        await fetch(`${API_BASE}/${currentBoard.id}/cards/${editingCard}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority })
        });
    } else {
        await addCard(editingColumn, title, description, priority);
    }
    closeModal();
    await refreshBoard();
});

function closeModal() {
    document.getElementById('cardModal').classList.remove('active');
}

// === Utilities ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

document.getElementById('cardModal').addEventListener('click', e => {
    if (e.target.id === 'cardModal') closeModal();
});

init();
