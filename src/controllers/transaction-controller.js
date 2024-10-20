import connection from "../config/database.js";
import { generateInvoiceNumber } from "../helpers/invoice-helper.js";
import { transactionSchema } from "../validations/transaction-validation.js"

const history = async (req, res) => {
    try {
        const userEmail = req.user.id;
        const limit = parseInt(req.query.limit) || 0;
        const offset = parseInt(req.query.offset) || 0;

        const query = `
            SELECT 
                t.invoice_number, 
                t.transaction_type, 
                CASE 
                    WHEN t.transaction_type = 'TOPUP' THEN 'Top Up balance' 
                    ELSE s.service_name 
                END AS description,
                t.total_amount, 
                t.created_on 
            FROM transactions t
            LEFT JOIN services s ON t.service_code = s.service_code
            WHERE t.user_email = ? 
            ORDER BY t.created_on DESC 
            LIMIT ? OFFSET ?  -- Gunakan LIMIT dan OFFSET
        `;

        const params = [userEmail, limit, offset];

        const [records] = await connection.execute(query, params);

        return res.status(200).json({
            status: 0,
            message: "Get History Berhasil",
            data: {
                offset,
                limit,
                records
            }
        });
    } catch (error) {
        console.error("Error menambahkan histori user:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const transaction = async (req, res) => {
    try {
        const userEmail = req.user.id;
        const { error } = transactionSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 102,
                message: error.details[0].message,
                data: null
            });
        }

        const { service_code } = req.body;

        const [service] = await connection.execute(
            "SELECT service_name, service_tariff AS total_amount FROM services WHERE service_code = ?",
            [service_code]
        );

        if (service.length === 0) {
            return res.status(404).json({
                status: 102,
                message: "Service tidak ditemukan",
                data: null
            });
        }

        const { service_name, total_amount } = service[0];

        const [balanceQuery] = await connection.execute(
            "SELECT balance FROM balances WHERE user_email = ?",
            [userEmail]
        );

        if (balanceQuery.length === 0) {
            return res.status(400).json({
                status: 105,
                message: "Saldo tidak ditemukan",
                data: null
            });
        }

        const currentBalance = balanceQuery[0].balance;

        if (currentBalance < total_amount) {
            return res.status(400).json({
                status: 106,
                message: "Saldo tidak mencukupi",
                data: null
            });
        }

        const invoice_number = generateInvoiceNumber();

        await connection.execute(
            `INSERT INTO transactions (invoice_number, user_email, service_code, service_name, transaction_type, total_amount, created_on) 
            VALUES (?, ?, ?, ?, 'PAYMENT', ?, NOW())`,
            [invoice_number, userEmail, service_code, service_name, total_amount]
        );

        const newBalance = currentBalance - total_amount;
        await connection.execute(
            "UPDATE balances SET balance = ? WHERE user_email = ?",
            [newBalance, userEmail]
        );

        return res.status(200).json({
            status: 0,
            message: "Transaksi berhasil",
            data: {
                invoice_number,
                service_code,
                service_name,
                transaction_type: "PAYMENT",
                total_amount,
                created_on: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Transaksi Gagal:', error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

export { history, transaction };

