import connection from "../config/database.js";

const createTransactionTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
        invoice_number VARCHAR(255) NOT NULL UNIQUE,
        user_email VARCHAR(255) NOT NULL,
        service_code VARCHAR(100),                     
        service_name VARCHAR(255),
        transaction_type VARCHAR(50) NOT NULL,
        total_amount INT NOT NULL,
        created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
        FOREIGN KEY (service_code) REFERENCES services(service_code) ON DELETE SET NULL
    );
    `;

    await connection.execute(createTableQuery);
};

export { createTransactionTable };
