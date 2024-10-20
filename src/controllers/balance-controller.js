import connection from "../config/database.js";
import { generateInvoiceNumber } from "../helpers/invoice-helper.js";
import {  topupSchema } from "../validations/balance-validation.js";

const balance = async (req, res) => {
    try {
        const userEmail = req.user.id;

        console.log("User Email:", userEmail);

        const [balanceQuery] = await connection.execute("SELECT balance FROM balances WHERE user_email = ?", [userEmail]);

        let balance = 0;

        if (balanceQuery.length > 0) {
            balance = balanceQuery[0].balance;
        }

        return res.status(200).json({
            status: 0,
            message: "Get Balance Berhasil",
            data: {
                balance: balance
            }
        });
    } catch (error) {
        console.error("Error mengambil saldo user:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const topup = async (req, res) => {
    try {
        const userEmail = req.user.id;
        const { error } = topupSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 102,
                message: error.details[0].message,
                data: null
            });
        }

        const { top_up_amount } = req.body;
        const [balanceQuery] = await connection.execute("SELECT balance FROM balances WHERE user_email = ?", [userEmail]);
        let newBalance;

        if (balanceQuery.length > 0) {
            const currentBalance = balanceQuery[0].balance;
            newBalance = currentBalance + top_up_amount;
            await connection.execute("UPDATE balances SET balance = ? WHERE user_email = ?", [newBalance, userEmail]);
        } else {
            newBalance = top_up_amount;
            await connection.execute("INSERT INTO balances (user_email, balance) VALUES (?, ?)", [userEmail, newBalance]);
        }
        const invoiceNumber = generateInvoiceNumber();

        await connection.execute("INSERT INTO transactions (invoice_number, user_email, total_amount, transaction_type, created_on) VALUES (?, ?, ?, 'TOPUP', NOW())", [invoiceNumber, userEmail, top_up_amount]);

        return res.status(200).json({
            status: 0,
            message: "Top Up Balance berhasil",
            data: {
                balance: newBalance
            }
        });
    } catch (error) {
        console.error("Error menambahkan saldo user:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

export { balance, topup };
