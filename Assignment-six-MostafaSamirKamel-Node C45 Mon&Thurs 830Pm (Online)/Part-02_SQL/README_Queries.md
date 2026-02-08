# Part 3.2 - SQL Operations and Queries

```sql
-- =====================================================================
-- REQUIREMENT 1: Create the required tables
-- =====================================================================

-- Create Suppliers Table
CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName VARCHAR(255) NOT NULL,
    ContactNumber VARCHAR(20) NOT NULL
);

-- Create Products Table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255),
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

-- =====================================================================
-- REQUIREMENT 2: Add a column "Category" to the Products table
-- =====================================================================

ALTER TABLE Products
ADD COLUMN Category VARCHAR(100);

-- =====================================================================
-- REQUIREMENT 3: Remove the "Category" column from Products
-- =====================================================================

ALTER TABLE Products
DROP COLUMN Category;

-- =====================================================================
-- REQUIREMENT 4: Change "ContactNumber" column in Suppliers to VARCHAR(15)
-- =====================================================================

ALTER TABLE Suppliers
MODIFY COLUMN ContactNumber VARCHAR(15) NOT NULL;

-- =====================================================================
-- REQUIREMENT 5: Add a NOT NULL constraint to ProductName
-- =====================================================================

ALTER TABLE Products
MODIFY COLUMN ProductName VARCHAR(255) NOT NULL;

-- =====================================================================
-- REQUIREMENT 6: Perform Basic Inserts
-- =====================================================================

-- 6a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'
INSERT INTO Suppliers (SupplierName, ContactNumber)
VALUES ('FreshFoods', '01001234567');

-- 6b. Insert three products provided by 'FreshFoods'
-- First, get the SupplierID for FreshFoods (assuming it's 1 if this is the first supplier)
-- i. Milk with a price of 15.00 and stock quantity of 50
INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES ('Milk', 15.00, 50, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'));

-- ii. Bread with a price of 10.00 and stock quantity of 30
INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES ('Bread', 10.00, 30, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'));

-- iii. Eggs with a price of 20.00 and stock quantity of 40
INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES ('Eggs', 20.00, 40, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'));

-- 6c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'
INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
VALUES ((SELECT ProductID FROM Products WHERE ProductName = 'Milk'), 2, '2025-05-20');

-- =====================================================================
-- REQUIREMENT 7: Update the price of 'Bread' to 25.00
-- =====================================================================

UPDATE Products
SET Price = 25.00
WHERE ProductName = 'Bread';

-- =====================================================================
-- REQUIREMENT 8: Delete the product 'Eggs'
-- =====================================================================

DELETE FROM Products
WHERE ProductName = 'Eggs';

-- =====================================================================
-- REQUIREMENT 9: Retrieve the total quantity sold for each product
-- =====================================================================

SELECT
    p.ProductID,
    p.ProductName,
    COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
FROM Products p
LEFT JOIN Sales s ON p.ProductID = s.ProductID
GROUP BY p.ProductID, p.ProductName
ORDER BY TotalQuantitySold DESC;

-- =====================================================================
-- REQUIREMENT 10: Get the product with the highest stock
-- =====================================================================

SELECT
    ProductID,
    ProductName,
    Price,
    StockQuantity,
    SupplierID
FROM Products
WHERE StockQuantity = (SELECT MAX(StockQuantity) FROM Products);

-- Alternative approach using ORDER BY and LIMIT
-- SELECT ProductID, ProductName, Price, StockQuantity, SupplierID
-- FROM Products
-- ORDER BY StockQuantity DESC
-- LIMIT 1;

-- =====================================================================
-- REQUIREMENT 11: Find suppliers with names starting with 'F'
-- =====================================================================

SELECT
    SupplierID,
    SupplierName,
    ContactNumber
FROM Suppliers
WHERE SupplierName LIKE 'F%';

-- =====================================================================
-- REQUIREMENT 12: Show all products that have never been sold
-- =====================================================================

SELECT
    p.ProductID,
    p.ProductName,
    p.Price,
    p.StockQuantity
FROM Products p
LEFT JOIN Sales s ON p.ProductID = s.ProductID
WHERE s.SaleID IS NULL;

-- Alternative approach using NOT EXISTS
-- SELECT ProductID, ProductName, Price, StockQuantity
-- FROM Products p
-- WHERE NOT EXISTS (
--     SELECT 1 FROM Sales s WHERE s.ProductID = p.ProductID
-- );

-- =====================================================================
-- REQUIREMENT 13: Get all sales along with product name and sale date
-- =====================================================================

SELECT
    s.SaleID,
    p.ProductName,
    s.QuantitySold,
    s.SaleDate,
    (s.QuantitySold * p.Price) AS TotalAmount
FROM Sales s
INNER JOIN Products p ON s.ProductID = p.ProductID
ORDER BY s.SaleDate DESC;

-- =====================================================================
-- REQUIREMENT 14: Create user "store_manager" with SELECT, INSERT, UPDATE permissions
-- =====================================================================

-- Create the user (password should be changed in production)
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'secure_password123';

-- Grant SELECT, INSERT, and UPDATE permissions on all tables
GRANT SELECT, INSERT, UPDATE ON Suppliers TO 'store_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Products TO 'store_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Sales TO 'store_manager'@'localhost';

-- Apply the privileges
FLUSH PRIVILEGES;

-- =====================================================================
-- REQUIREMENT 15: Revoke UPDATE permission from "store_manager"
-- =====================================================================

REVOKE UPDATE ON Suppliers FROM 'store_manager'@'localhost';
REVOKE UPDATE ON Products FROM 'store_manager'@'localhost';
REVOKE UPDATE ON Sales FROM 'store_manager'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- =====================================================================
-- REQUIREMENT 16: Grant DELETE permission to "store_manager" only on Sales table
-- =====================================================================

GRANT DELETE ON Sales TO 'store_manager'@'localhost';

-- Apply the privileges
FLUSH PRIVILEGES;
```
