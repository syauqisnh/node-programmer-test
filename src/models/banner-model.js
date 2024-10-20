import connection from "../config/database.js";

const createBannerTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banners (
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(255),
    description VARCHAR(100)
    )
    `;

    await connection.execute(createTableQuery);
}

export { createBannerTable }