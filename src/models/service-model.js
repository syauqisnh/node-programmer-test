import connection from "../config/database.js";

const createServiceTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS services (
        service_code VARCHAR(100) NOT NULL UNIQUE,
        service_name VARCHAR(100) NOT NULL,
        service_icon VARCHAR(255),
        service_tariff INT
    );
    `;    

    await connection.execute(createTableQuery);
}

export { createServiceTable };
