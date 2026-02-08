# Part 3.1 - SQL Schema and Initial Data

```sql
-- Create Suppliers Table
CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName VARCHAR(255) NOT NULL,
    ContactNumber VARCHAR(20) NOT NULL
);

-- Create Products Table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Create Sales Table
CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    QuantitySold INT NOT NULL,
    SaleDate DATE NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX idx_products_supplier ON Products(SupplierID);
CREATE INDEX idx_sales_product ON Sales(ProductID);
CREATE INDEX idx_sales_date ON Sales(SaleDate);


-- Insert sample suppliers
INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES
('ABC Wholesale', '555-0101'),
('XYZ Distributors', '555-0102'),
('Global Supplies Inc.', '555-0103');

-- Insert sample products
INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES
('Wireless Mouse', 24.99, 50, 1),
('USB Cable', 9.99, 100, 1),
('Notebook', 5.49, 200, 2),
('Pen Set', 12.99, 75, 2),
('Desk Lamp', 34.99, 30, 3);

-- Insert sample sales
INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES
(1, 2, '2024-02-01'),
(3, 5, '2024-02-02'),
(2, 3, '2024-02-03'),
(1, 1, '2024-02-05'),
(4, 4, '2024-02-06');
```
