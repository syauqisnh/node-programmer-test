import connection from "../config/database.js";

const createBalanceTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS balances (
            user_email VARCHAR(100) NOT NULL,
            balance INT DEFAULT 0,
            FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
            PRIMARY KEY (user_email)
        )
    `;

    await connection.execute(createTableQuery);
};

export { createBalanceTable };
