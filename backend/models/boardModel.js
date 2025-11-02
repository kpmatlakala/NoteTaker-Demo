// In-memory data store
// Replace with database queries when scaling
let boards = [
  {
    id: 'board-1',
    name: 'My First Board',
    createdAt: new Date().toISOString(),
    columns: [
      { id: 'todo', title: 'To Do', cards: [] },
      { id: 'progress', title: 'In Progress', cards: [] },
      { id: 'done', title: 'Done', cards: [] }
    ]
  }
];

// Helper function to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// BOARD OPERATIONS

exports.getAllBoards = () => {
  return boards;
};

exports.getBoardById = (boardId) => {
  return boards.find(board => board.id === boardId);
};

exports.createBoard = ({ name, columns }) => {
  const newBoard = {
    id: generateId(),
    name: name || 'Untitled Board',
    createdAt: new Date().toISOString(),
    columns: columns || [
      { id: 'todo', title: 'To Do', cards: [] },
      { id: 'progress', title: 'In Progress', cards: [] },
      { id: 'done', title: 'Done', cards: [] }
    ]
  };
  
  boards.push(newBoard);
  return newBoard;
};

exports.updateBoard = (boardId, updates) => {
  const boardIndex = boards.findIndex(board => board.id === boardId);
  
  if (boardIndex === -1) return null;
  
  boards[boardIndex] = {
    ...boards[boardIndex],
    ...updates,
    id: boardId, // Prevent ID from being overwritten
    updatedAt: new Date().toISOString()
  };
  
  return boards[boardIndex];
};

exports.deleteBoard = (boardId) => {
  const boardIndex = boards.findIndex(board => board.id === boardId);
  
  if (boardIndex === -1) return false;
  
  boards.splice(boardIndex, 1);
  return true;
};

// CARD OPERATIONS

exports.getCardById = (boardId, cardId) => {
  const board = this.getBoardById(boardId);
  if (!board) return null;

  for (const column of board.columns) {
    const card = column.cards.find(c => c.id === cardId);
    if (card) return { ...card, columnId: column.id };
  }
  
  return null;
};

exports.createCard = (boardId, cardData) => {
  const board = this.getBoardById(boardId);
  if (!board) return null;

  const column = board.columns.find(col => col.id === cardData.columnId);
  if (!column) return null;

  const newCard = {
    id: generateId(),
    title: cardData.title,
    description: cardData.description || '',
    priority: cardData.priority || 'medium',
    createdAt: new Date().toISOString()
  };

  column.cards.push(newCard);
  return { ...newCard, columnId: column.id };
};

exports.updateCard = (boardId, cardId, updates) => {
  const board = this.getBoardById(boardId);
  if (!board) return null;

  // Find current column and card
  let sourceColumn = null;
  let cardIndex = -1;

  for (const column of board.columns) {
    cardIndex = column.cards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      sourceColumn = column;
      break;
    }
  }

  if (!sourceColumn) return null;

  const card = sourceColumn.cards[cardIndex];

  // If moving to a different column
  if (updates.columnId && updates.columnId !== sourceColumn.id) {
    const targetColumn = board.columns.find(col => col.id === updates.columnId);
    if (!targetColumn) return null;

    // Remove from source column
    sourceColumn.cards.splice(cardIndex, 1);
    
    // Add to target column
    const updatedCard = {
      ...card,
      ...updates,
      id: cardId, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    delete updatedCard.columnId; // Remove columnId from card object
    
    targetColumn.cards.push(updatedCard);
    return { ...updatedCard, columnId: targetColumn.id };
  }

  // Update card in place
  sourceColumn.cards[cardIndex] = {
    ...card,
    ...updates,
    id: cardId, // Preserve ID
    updatedAt: new Date().toISOString()
  };
  delete sourceColumn.cards[cardIndex].columnId; // Remove if present

  return { ...sourceColumn.cards[cardIndex], columnId: sourceColumn.id };
};

exports.deleteCard = (boardId, cardId) => {
  const board = this.getBoardById(boardId);
  if (!board) return false;

  for (const column of board.columns) {
    const cardIndex = column.cards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      column.cards.splice(cardIndex, 1);
      return true;
    }
  }

  return false;
};

// Export/Import helpers
exports.exportBoard = (boardId) => {
  return this.getBoardById(boardId);
};

exports.importBoard = (boardData) => {
  const newBoard = {
    ...boardData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  boards.push(newBoard);
  return newBoard;
};
