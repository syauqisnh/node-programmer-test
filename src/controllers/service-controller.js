import connection from "../config/database.js";

const service = async (req, res) => {
    try {
        const [query] = await connection.execute("SELECT * FROM services")

        if (query.length === 0) {
            return res.status(404).json({
                status: 102,
                message: "Data service tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: query
        })
    } catch (error) {
        console.error("Error mengambil data service:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

export {
    service
}
