// app.js

const { pool, testConnection } = require('./config/database');

// =====================================================================
// REQUIREMENT 1: Create the required tables 
// =====================================================================
async function requirement1_createTables() {
    console.log('\n=== REQUIREMENT 1: Creating Tables ===');
    const connection = await pool.getConnection();

    try {
        // Drop existing tables if they exist
        await connection.query('DROP TABLE IF EXISTS Sales');
        await connection.query('DROP TABLE IF EXISTS Products');
        await connection.query('DROP TABLE IF EXISTS Suppliers');

        // Create Suppliers Table
        await connection.query(`
            CREATE TABLE Suppliers (
                SupplierID INT AUTO_INCREMENT PRIMARY KEY,
                SupplierName VARCHAR(255) NOT NULL,
                ContactNumber VARCHAR(20) NOT NULL
            )
        `);
        console.log('✓ Suppliers table created');

        // Create Products Table
        await connection.query(`
            CREATE TABLE Products (
                ProductID INT AUTO_INCREMENT PRIMARY KEY,
                ProductName VARCHAR(255),
                Price DECIMAL(10, 2) NOT NULL,
                StockQuantity INT NOT NULL DEFAULT 0,
                SupplierID INT,
                FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            )
        `);
        console.log('✓ Products table created');

        // Create Sales Table
        await connection.query(`
            CREATE TABLE Sales (
                SaleID INT AUTO_INCREMENT PRIMARY KEY,
                ProductID INT NOT NULL,
                QuantitySold INT NOT NULL,
                SaleDate DATE NOT NULL,
                FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            )
        `);
        console.log('✓ Sales table created');
        console.log('✓ All tables created successfully!');

    } catch (error) {
        console.error('✗ Error creating tables:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 2: Add a column "Category" to the Products table 
// =====================================================================
async function requirement2_addCategory() {
    console.log('\n=== REQUIREMENT 2: Adding Category Column ===');
    const connection = await pool.getConnection();

    try {
        await connection.query(`
            ALTER TABLE Products
            ADD COLUMN Category VARCHAR(100)
        `);
        console.log('✓ Category column added to Products table');
    } catch (error) {
        console.error('✗ Error adding Category column:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 3: Remove the "Category" column from Products 
// =====================================================================
async function requirement3_removeCategory() {
    console.log('\n=== REQUIREMENT 3: Removing Category Column ===');
    const connection = await pool.getConnection();

    try {
        await connection.query(`
            ALTER TABLE Products
            DROP COLUMN Category
        `);
        console.log('✓ Category column removed from Products table');
    } catch (error) {
        console.error('✗ Error removing Category column:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 4: Change "ContactNumber" to VARCHAR(15) 
// =====================================================================
async function requirement4_modifyContactNumber() {
    console.log('\n=== REQUIREMENT 4: Modifying ContactNumber Data Type ===');
    const connection = await pool.getConnection();

    try {
        await connection.query(`
            ALTER TABLE Suppliers
            MODIFY COLUMN ContactNumber VARCHAR(15) NOT NULL
        `);
        console.log('✓ ContactNumber column modified to VARCHAR(15)');
    } catch (error) {
        console.error('✗ Error modifying ContactNumber:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 5: Add NOT NULL constraint to ProductName 
// =====================================================================
async function requirement5_addNotNull() {
    console.log('\n=== REQUIREMENT 5: Adding NOT NULL Constraint ===');
    const connection = await pool.getConnection();

    try {
        await connection.query(`
            ALTER TABLE Products
            MODIFY COLUMN ProductName VARCHAR(255) NOT NULL
        `);
        console.log('✓ NOT NULL constraint added to ProductName');
    } catch (error) {
        console.error('✗ Error adding NOT NULL constraint:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 6: Perform Basic Inserts 
// =====================================================================
async function requirement6_basicInserts() {
    console.log('\n=== REQUIREMENT 6: Performing Basic Inserts ===');
    const connection = await pool.getConnection();

    try {
        // 6a. Add supplier 'FreshFoods'
        const [supplierResult] = await connection.query(`
            INSERT INTO Suppliers (SupplierName, ContactNumber) 
            VALUES ('FreshFoods', '01001234567')
        `);
        const supplierID = supplierResult.insertId;
        console.log(`✓ Supplier 'FreshFoods' added (ID: ${supplierID})`);

        // 6b. Insert three products
        // i. Milk
        const [milkResult] = await connection.query(`
            INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) 
            VALUES ('Milk', 15.00, 50, ?)
        `, [supplierID]);
        const milkID = milkResult.insertId;
        console.log(`✓ Product 'Milk' added (ID: ${milkID})`);

        // ii. Bread
        await connection.query(`
            INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) 
            VALUES ('Bread', 10.00, 30, ?)
        `, [supplierID]);
        console.log('✓ Product \'Bread\' added');

        // iii. Eggs
        await connection.query(`
            INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) 
            VALUES ('Eggs', 20.00, 40, ?)
        `, [supplierID]);
        console.log('✓ Product \'Eggs\' added');

        // 6c. Add sale of 2 units of Milk
        await connection.query(`
            INSERT INTO Sales (ProductID, QuantitySold, SaleDate) 
            VALUES (?, 2, '2025-05-20')
        `, [milkID]);
        console.log('✓ Sale of 2 units of Milk added (Date: 2025-05-20)');

    } catch (error) {
        console.error('✗ Error performing inserts:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 7: Update the price of 'Bread' to 25.00 
// =====================================================================
async function requirement7_updateBreadPrice() {
    console.log('\n=== REQUIREMENT 7: Updating Bread Price ===');
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.query(`
            UPDATE Products
            SET Price = 25.00
            WHERE ProductName = 'Bread'
        `);
        console.log(`✓ Bread price updated to 25.00 (${result.affectedRows} row(s) affected)`);
    } catch (error) {
        console.error('✗ Error updating Bread price:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 8: Delete the product 'Eggs' 
// =====================================================================
async function requirement8_deleteEggs() {
    console.log('\n=== REQUIREMENT 8: Deleting Eggs Product ===');
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.query(`
            DELETE FROM Products
            WHERE ProductName = 'Eggs'
        `);
        console.log(`✓ Product 'Eggs' deleted (${result.affectedRows} row(s) affected)`);
    } catch (error) {
        console.error('✗ Error deleting Eggs:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 9: Retrieve total quantity sold for each product 
// =====================================================================
async function requirement9_totalQuantitySold() {
    console.log('\n=== REQUIREMENT 9: Total Quantity Sold Per Product ===');
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(`
            SELECT 
                p.ProductID,
                p.ProductName,
                COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
            FROM Products p
            LEFT JOIN Sales s ON p.ProductID = s.ProductID
            GROUP BY p.ProductID, p.ProductName
            ORDER BY TotalQuantitySold DESC
        `);

        console.log('✓ Total Quantity Sold:');
        console.table(rows);
        return rows;
    } catch (error) {
        console.error('✗ Error retrieving total quantity sold:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 10: Get the product with highest stock 
// =====================================================================
async function requirement10_highestStock() {
    console.log('\n=== REQUIREMENT 10: Product with Highest Stock ===');
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(`
            SELECT 
                ProductID,
                ProductName,
                Price,
                StockQuantity,
                SupplierID
            FROM Products
            WHERE StockQuantity = (SELECT MAX(StockQuantity) FROM Products)
        `);

        console.log('✓ Product(s) with Highest Stock:');
        console.table(rows);
        return rows;
    } catch (error) {
        console.error('✗ Error finding highest stock:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 11: Find suppliers with names starting with 'F' 
// =====================================================================
async function requirement11_suppliersStartingWithF() {
    console.log('\n=== REQUIREMENT 11: Suppliers Starting with \'F\' ===');
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(`
            SELECT 
                SupplierID,
                SupplierName,
                ContactNumber
            FROM Suppliers
            WHERE SupplierName LIKE 'F%'
        `);

        console.log('✓ Suppliers starting with \'F\':');
        console.table(rows);
        return rows;
    } catch (error) {
        console.error('✗ Error finding suppliers:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 12: Show all products never sold 
// =====================================================================
async function requirement12_productsNeverSold() {
    console.log('\n=== REQUIREMENT 12: Products Never Sold ===');
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(`
            SELECT 
                p.ProductID,
                p.ProductName,
                p.Price,
                p.StockQuantity
            FROM Products p
            LEFT JOIN Sales s ON p.ProductID = s.ProductID
            WHERE s.SaleID IS NULL
        `);

        console.log('✓ Products never sold:');
        console.table(rows);
        return rows;
    } catch (error) {
        console.error('✗ Error finding unsold products:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 13: Get all sales with product name and date 
// =====================================================================
async function requirement13_salesWithDetails() {
    console.log('\n=== REQUIREMENT 13: Sales with Product Details ===');
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(`
            SELECT 
                s.SaleID,
                p.ProductName,
                s.QuantitySold,
                s.SaleDate,
                (s.QuantitySold * p.Price) AS TotalAmount
            FROM Sales s
            INNER JOIN Products p ON s.ProductID = p.ProductID
            ORDER BY s.SaleDate DESC
        `);

        console.log('✓ Sales with product details:');
        console.table(rows);
        return rows;
    } catch (error) {
        console.error('✗ Error retrieving sales:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 14: Create user with SELECT, INSERT, UPDATE permissions   
// =====================================================================
async function requirement14_createUser() {
    console.log('\n=== REQUIREMENT 14: Creating User \'store_manager\' ===');
    const connection = await pool.getConnection();

    try {
        // Drop user if exists
        try {
            await connection.query("DROP USER 'store_manager'@'localhost'");
        } catch (e) {
            // User doesn't exist, continue
        }

        // Create user
        await connection.query(`
            CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'secure_password123'
        `);
        console.log('✓ User \'store_manager\' created');

        // Grant permissions
        await connection.query("GRANT SELECT, INSERT, UPDATE ON retail_store.Suppliers TO 'store_manager'@'localhost'");
        await connection.query("GRANT SELECT, INSERT, UPDATE ON retail_store.Products TO 'store_manager'@'localhost'");
        await connection.query("GRANT SELECT, INSERT, UPDATE ON retail_store.Sales TO 'store_manager'@'localhost'");
        await connection.query("FLUSH PRIVILEGES");

        console.log('✓ Granted SELECT, INSERT, UPDATE permissions on all tables');
    } catch (error) {
        console.error('✗ Error creating user:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 15: Revoke UPDATE permission 
// =====================================================================
async function requirement15_revokeUpdate() {
    console.log('\n=== REQUIREMENT 15: Revoking UPDATE Permission ===');
    const connection = await pool.getConnection();

    try {
        await connection.query("REVOKE UPDATE ON retail_store.Suppliers FROM 'store_manager'@'localhost'");
        await connection.query("REVOKE UPDATE ON retail_store.Products FROM 'store_manager'@'localhost'");
        await connection.query("REVOKE UPDATE ON retail_store.Sales FROM 'store_manager'@'localhost'");
        await connection.query("FLUSH PRIVILEGES");

        console.log('✓ UPDATE permission revoked from all tables');
    } catch (error) {
        console.error('✗ Error revoking UPDATE permission:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// REQUIREMENT 16: Grant DELETE on Sales table 
// =====================================================================
async function requirement16_grantDelete() {
    console.log('\n=== REQUIREMENT 16: Granting DELETE on Sales ===');
    const connection = await pool.getConnection();

    try {
        await connection.query("GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost'");
        await connection.query("FLUSH PRIVILEGES");

        console.log('✓ DELETE permission granted on Sales table');

        // Show final grants
        const [grants] = await connection.query("SHOW GRANTS FOR 'store_manager'@'localhost'");
        console.log('\n✓ Final permissions for \'store_manager\':');
        grants.forEach(grant => console.log('  -', Object.values(grant)[0]));

    } catch (error) {
        console.error('✗ Error granting DELETE permission:', error.message);
    } finally {
        connection.release();
    }
}

// =====================================================================
// MAIN EXECUTION FUNCTION
// =====================================================================
async function runAllRequirements() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║      STORE DATABASE - ALL REQUIREMENTS EXECUTION     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    try {
        // Test database connection
        const connected = await testConnection();
        if (!connected) {
            console.error('\n✗ Cannot proceed without database connection');
            process.exit(1);
        }

        // Execute all requirements in sequence
        await requirement1_createTables();
        await requirement2_addCategory();
        await requirement3_removeCategory();
        await requirement4_modifyContactNumber();
        await requirement5_addNotNull();
        await requirement6_basicInserts();
        await requirement7_updateBreadPrice();
        await requirement8_deleteEggs();
        await requirement9_totalQuantitySold();
        await requirement10_highestStock();
        await requirement11_suppliersStartingWithF();
        await requirement12_productsNeverSold();
        await requirement13_salesWithDetails();
        await requirement14_createUser();
        await requirement15_revokeUpdate();
        await requirement16_grantDelete();

        console.log('\n╔══════════════════════════════════════════════════════════╗');
        console.log('║          ✓ ALL REQUIREMENTS COMPLETED SUCCESSFULLY!        ║');
        console.log('║                                                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

    } catch (error) {
        console.error('\n✗ Fatal error:', error.message);
    } finally {
        // Close the pool
        await pool.end();
        console.log('Database connection pool closed.');
    }
}


runAllRequirements();