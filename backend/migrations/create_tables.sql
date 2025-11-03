USE NoteTakerDB;
GO

-- Drop tables if they already exist (optional, clean start)
IF OBJECT_ID('dbo.Cards', 'U') IS NOT NULL
    DROP TABLE dbo.Cards;
IF OBJECT_ID('dbo.Boards', 'U') IS NOT NULL
    DROP TABLE dbo.Boards;
GO

-- Create Boards table
CREATE TABLE dbo.Boards (
    BoardId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Create Cards table with foreign key to Boards
CREATE TABLE dbo.Cards (
    CardId INT IDENTITY(1,1) PRIMARY KEY,
    BoardId INT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Cards_Boards FOREIGN KEY (BoardId)
        REFERENCES dbo.Boards(BoardId)
        ON DELETE CASCADE
);
GO