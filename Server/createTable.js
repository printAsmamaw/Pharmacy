const mysql = require('mysql');
const db = require('./config/db');


  const createWardTableQuery = `
  CREATE TABLE IF NOT EXISTS wards(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ward_name VARCHAR(255) NOT NULL,
    slot_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

const createDoctorTableQuery = `
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ward_id INT NOT NULL,
    ward_name VARCHAR(255) NOT NULL,
    slot_number INT NOT NULL, 
    fname VARCHAR(255) NOT NULL,
    sname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(20) NOT NULL,
    specialization VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(id)
);
`;

const createEmployeesTableQuery = `
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    education_level VARCHAR(255),
    address VARCHAR(255),
    department VARCHAR(255),
    surety VARCHAR(255),
    surety_number VARCHAR(20),
    document LONGBLOB,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL UNIQUE, 
    role VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    slot_number VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',
    issue VARCHAR(255) DEFAULT 'picklist', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createCustomersTableQuery = `
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    tel VARCHAR(255) NOT NULL,
    ttn VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createStoreDescriptionTableQuery = `
CREATE TABLE IF NOT EXISTS store_description (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account VARCHAR(255) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    request_type VARCHAR(255) NOT NULL,
    store VARCHAR(255) NOT NULL,
    generated_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createStoreWithdrawTableQuery = `
CREATE TABLE IF NOT EXISTS store_withdraw (
    id INT AUTO_INCREMENT PRIMARY KEY,                     
    store_description_id INT NOT NULL,                     
    item VARCHAR(255) NOT NULL,                           
    unit VARCHAR(255) NOT NULL,                            
    batch_number VARCHAR(255) NOT NULL,                  
    code VARCHAR(255) NOT NULL,                           
    price DECIMAL(10, 2) NOT NULL,                       
    balanced_quantity INT NOT NULL,                        
    requested_quantity INT NOT NULL,                       
    status VARCHAR(50) DEFAULT 'inactive',               
    issue VARCHAR(255) DEFAULT 'picklist',                           
    FOREIGN KEY (store_description_id) REFERENCES store_description(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP         
);
`;

const createPatientsTableQuery = `
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mrn VARCHAR(255) NOT NULL,                -- Medical Record Number
    date_reg DATE NOT NULL,                   -- Date of Registration
    name VARCHAR(255) NOT NULL,               -- Name
    fname VARCHAR(255) NOT NULL,              -- Father's Name
    gfname VARCHAR(255) NOT NULL,             -- Grandfather's Name
    sex ENUM('male', 'female') NOT NULL,      -- Gender
    date_birth DATE NOT NULL,                 -- Date of Birth
    age INT NOT NULL,                         -- Age
    region VARCHAR(255) NOT NULL,             -- Region
    woreda VARCHAR(255) NOT NULL,             -- Woreda
    address VARCHAR(255) NOT NULL,               -- Gott
    kebele VARCHAR(255) NOT NULL,             -- Kebele
    house_number VARCHAR(255) NOT NULL,       -- House Number
    phone VARCHAR(20) NOT NULL,               -- Phone Number
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createCounseledItemsTableQuery = `
CREATE TABLE IF NOT EXISTS counseled_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,                  -- Foreign key referencing patients table
    item VARCHAR(255) NOT NULL,              -- Item name
    unit VARCHAR(50) NOT NULL,               -- Unit of the item (e.g., mg, pcs)
    quantity INT NOT NULL,                   -- Quantity of the item
    description TEXT,                        -- Additional details about the item
    unit_price DECIMAL(10, 2) NOT NULL,      -- Price per unit
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED, -- Total price (calculated field)
    status VARCHAR(50) DEFAULT 'inactive',   -- Default status
    issue VARCHAR(255) DEFAULT 'picklist',   -- Default issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
`;

const createPatientWardTableQuery = `
CREATE TABLE IF NOT EXISTS patient_ward (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    ward_id INT NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'inactive',  
    issue VARCHAR(50) DEFAULT 'picklist', 
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(id)
);
`;

const createPaymentForCardTableQuery = `
CREATE TABLE IF NOT EXISTS payment_for_card (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    payment_type VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
`;

const createPerformaTableQuery = `
CREATE TABLE IF NOT EXISTS performas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    tel VARCHAR(255) NOT NULL,
    ttn VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createSettingTableQuery = `
CREATE TABLE IF NOT EXISTS settings (
id INT AUTO_INCREMENT PRIMARY KEY,
phoneNumber VARCHAR(255) NOT NULL,
tinNumber VARCHAR(255) NOT NULL,
licenseNumber VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
titleAmharic VARCHAR(255) NOT NULL,
titleEnglish VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createSellerTableQuery = `
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    ttno VARCHAR(255) NOT NULL,
    invoiceNumber VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;
const createItemNameTableQuery = `
CREATE TABLE IF NOT EXISTS itemNames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(255) NOT NULL,
    preparation VARCHAR(255) NOT NULL,
    dose VARCHAR(255) NOT NULL,
    route VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createCategoriesTableQuery = `
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createStocksTableQuery = `
CREATE TABLE IF NOT EXISTS medicine_stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    manifacturer VARCHAR(255) NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    batchNo VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sell DECIMAL(10, 2) NOT NULL,
    expiry DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
`;

const createMedicineShelfTableQuery = `
CREATE TABLE IF NOT EXISTS medicine_shelf (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_stock_id INT NOT NULL,
    user_id INT NOT NULL,
    store_description_id INT NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    batchNo VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    expiry DATE NOT NULL,
    status VARCHAR(255) DEFAULT 'unapprove',
    issue VARCHAR(255) DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_stock_id) REFERENCES medicine_stocks(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_description_id) REFERENCES store_description(id)
);
`;

const createEvaluationTableQuery = `
CREATE TABLE IF NOT EXISTS evaluation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    prescriber_id INT NOT NULL,
    medicine_id INT NOT NULL,
    item VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (prescriber_id) REFERENCES doctors(id),
    FOREIGN KEY (medicine_id) REFERENCES medicine_shelf(id)
);
`;

const createPatientOrdersTableQuery = `
CREATE TABLE IF NOT EXISTS patient_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medicine_id INT NOT NULL,
    prescriber_id INT NOT NULL,
    item VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',
    issue VARCHAR(50) DEFAULT 'picklist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (prescriber_id) REFERENCES doctors(id),
    FOREIGN KEY (medicine_id) REFERENCES medicine_shelf(id)
);
`;

const createPatientPaymentsTableQuery = `
CREATE TABLE IF NOT EXISTS patient_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medicine_stock_id INT NOT NULL,
    evaluation_id INT NOT NULL,
    prescriber_id INT NOT NULL,
    item VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    description TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    issue VARCHAR(50) DEFAULT 'picklist',
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (medicine_stock_id) REFERENCES medicine_shelf(id),
    FOREIGN KEY (evaluation_id) REFERENCES evaluation(id),
    FOREIGN KEY (prescriber_id) REFERENCES doctors(id)
);
`;

const createTemporaryTableQuery = `
CREATE TABLE IF NOT EXISTS temporary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medicine_stock_id INT NOT NULL,
    evaluation_id INT NOT NULL,
    prescriber_id INT NOT NULL,
    item VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    description TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    issue VARCHAR(50) DEFAULT 'picklist',
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (medicine_stock_id) REFERENCES medicine_shelf(id),
    FOREIGN KEY (evaluation_id) REFERENCES evaluation(id),
    FOREIGN KEY (prescriber_id) REFERENCES doctors(id)
);
`;

const createDrugforPerformaTableQuery = `
CREATE TABLE IF NOT EXISTS performaDrug (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    drugId INT NOT NULL,
    categorieId INT NOT NULL,
    categorie VARCHAR(255) NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    batchNo VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id),
    FOREIGN KEY (drugId) REFERENCES medicine_shelf(id),
    FOREIGN KEY (categorieId) REFERENCES categories(id)
);
`;

const createOrdersTableQuery = `
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    drugId INT NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    batchNo VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',      -- Status
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id),
    FOREIGN KEY (drugId) REFERENCES medicine_shelf(id)
);
`;

const createApprovalTableQuery = `
CREATE TABLE IF NOT EXISTS approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    drugId INT NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    batchNo VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255) NOT NULL,
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id),
    FOREIGN KEY (drugId) REFERENCES medicine_shelf(id)
);
`;

const createPaymentsTableQuery = `
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    drugId INT NOT NULL,
    userId INT NOT NULL,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    item_measure VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    batchNo VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'unpaid',
    paymentMethod VARCHAR(255) NOT NULL,
    outofstock VARCHAR(255) NOT NULL DEFAULT 'no',
    issue VARCHAR(255) DEFAULT 'picklist',    -- Issue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id),
    FOREIGN KEY (drugId) REFERENCES medicine_shelf(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);
`;

db.query(createWardTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Doctors table created or already exists');
  });
       db.query(createUsersTableQuery, (err, result) => {
         if (err) {
          console.error('Error creating doctors table:', err);
           return;
        }

db.query(createEmployeesTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Employees table created or already exists');
  });
       db.query(createUsersTableQuery, (err, result) => {
         if (err) {
          console.error('Error creating users table:', err);
           return;
        }
        db.query(createCustomersTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating customers table:', err);
                return;
            }
            console.log('Customers table created successfully:', result);

        console.log('Users table created successfully:', result);
        db.query(createStoreDescriptionTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating users table:', err);
                return;
            }
            console.log('Users table created successfully:', result);
            
            db.query(createStoreWithdrawTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    return;
                }
                console.log('Users table created successfully:', result);   
        db.query(createPatientsTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating Seller table:', err);
            return;
        }
        console.log('Seller table created successfully:', result);
        
        db.query(createCounseledItemsTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating Seller table:', err);
                return;
            }
            console.log('Seller table created successfully:', result);
        db.query(createDoctorTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating Seller table:', err);
                return;
            }
            console.log('Seller table created successfully:', result);
            
            db.query(createPatientWardTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating patient ward table:', err);
                    return;
                }
                console.log('Patient ward table created successfully:', result);
        db.query(createPaymentForCardTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating patient ward table:', err);
                return;
            }
            console.log('Patient ward table created successfully:', result);
db.query(createPerformaTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Seller table:', err);
        return;
    }
    console.log('Seller table created successfully:', result);


db.query(createSettingTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Seller table:', err);
        return;
    }
    console.log('Seller table created successfully:', result);

// Create tables in the correct order
db.query(createSellerTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Seller table:', err);
        return;
    }
    console.log('Seller table created successfully:', result);
    db.query(createItemNameTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Categories table created or already exists');
      });
    
    db.query(createCategoriesTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Categories table created or already exists');
      });
    
      db.query(createStocksTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating stocks table:', err);
            return;
        }
        console.log('Stocks table created successfully:', result);
        db.query(createMedicineShelfTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating users table:', err);
                return;
            }
            console.log('Users table created successfully:', result);
        db.query(createEvaluationTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating stocks table:', err);
                return;
            }
            console.log('Stocks table created successfully:', result);
            
            db.query(createPatientOrdersTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating stocks table:', err);
                    return;
                }
                console.log('Stocks table created successfully:', result);        
          
          db.query(createPatientPaymentsTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating patient payment table table:', err);
                return;
            }
            console.log('patient payment table created successfully:', result);
            
            db.query(createTemporaryTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating patient payment table table:', err);
                    return;
                }
                console.log('patient payment table created successfully:', result);
        db.query(createDrugforPerformaTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating Seller table:', err);
                return;
            }
            console.log('Seller table created successfully:', result);

                db.query(createOrdersTableQuery, (err, result) => {
                    if (err) {
                        console.error('Error creating orders table:', err);
                        return;
                    }
                    console.log('Orders table created successfully:', result);

                    db.query(createApprovalTableQuery, (err, result) => {
                        if (err) {
                            console.error('Error creating approvals table:', err);
                            return;
                        }
                        console.log('Approvals table created successfully:', result);

                        db.query(createPaymentsTableQuery, (err, result) => {
                            if (err) {
                                console.error('Error creating payments table:', err);
                                return;
                            }
                            console.log('Payments table created successfully:', result);
                                  
                            db.end(); // Close the connection
                        });
                    });
                });
                });
                });
            });
        });
    });
});
});
});
});
});
});
});
});
});
});
});
});
});
});
});