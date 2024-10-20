import express from 'express';
import { authenticate } from '../middlewares/auth-middleware.js';
import { history, transaction } from '../controllers/transaction-controller.js'

const transactionRouter = express.Router();

transactionRouter.post("/transaction", authenticate, transaction);
transactionRouter.get("/transaction/history", authenticate, history);

export {
    transactionRouter
}