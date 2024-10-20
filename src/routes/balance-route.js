import express from 'express';
import { balance, topup } from '../controllers/balance-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';

const balanceRouter = express.Router();

balanceRouter.get("/balance", authenticate, balance)
balanceRouter.post("/topup", authenticate, topup)

export { balanceRouter };