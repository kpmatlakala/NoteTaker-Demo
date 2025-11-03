USE NoteTakerDB;
GO

-- 🧹 Optional: Drop old tables (in order to avoid foreign key conflicts)
IF OBJECT_ID('dbo.Cards', 'U') IS NOT NULL DROP TABLE dbo.Cards;
IF OBJECT_ID('dbo.Columns', 'U') IS NOT NULL DROP TABLE dbo.Columns;
IF OBJECT_ID('dbo.Boards', 'U') IS NOT NULL DROP TABLE dbo.Boards;
GO


-- 🧱 1. Create Boards table
CREATE TABLE dbo.Boards (
    BoardId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO


-- 🪣 2. Create Columns table (each belongs to a board)
CREATE TABLE dbo.Columns (
    ColumnId INT IDENTITY(1,1) PRIMARY KEY,
    BoardId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Position INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Columns_Boards FOREIGN KEY (BoardId)
        REFERENCES dbo.Boards(BoardId)
        ON DELETE CASCADE
);
GO


-- 🗂️ 3. Create Cards table (each belongs to both board + column)
CREATE TABLE dbo.Cards (
    CardId INT IDENTITY(1,1) PRIMARY KEY,
    BoardId INT NOT NULL,
    ColumnId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Priority NVARCHAR(50) DEFAULT 'Medium',
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Cards_Boards FOREIGN KEY (BoardId)
        REFERENCES dbo.Boards(BoardId)
        ON DELETE CASCADE,
    CONSTRAINT FK_Cards_Columns FOREIGN KEY (ColumnId)
        REFERENCES dbo.Columns(ColumnId)
        ON DELETE CASCADE
);
GO


-- 🧩 4. Insert Demo Data
INSERT INTO dbo.Boards (Title) VALUES ('Demo Board');
GO

-- Create Columns for the Demo Board
INSERT INTO dbo.Columns (BoardId, Title, Position)
VALUES 
(1, 'Backlog', 1),
(1, 'In Progress', 2),
(1, 'Done', 3);
GO

-- Insert Demo Cards
INSERT INTO dbo.Cards (BoardId, ColumnId, Title, Description, Priority)
VALUES 
(1, 1, 'Set up project repo', 'Initialize GitHub repository', 'High'),
(1, 1, 'Design database schema', 'Plan the SQL structure for boards, columns, cards', 'Medium'),
(1, 2, 'Implement API routes', 'Add Express controllers and models', 'High'),
(1, 3, 'Create frontend layout', 'Build Kanban-style board with HTML/CSS', 'Low');
GO


-- ✅ 5. Verify data
SELECT * FROM dbo.Boards;
SELECT * FROM dbo.Columns;
SELECT * FROM dbo.Cards;
GO
