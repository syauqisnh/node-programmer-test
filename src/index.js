import express from 'express';
import path from 'path';
import connection from './config/database.js';
import dotenv from 'dotenv';
import { createUsersTable } from './models/user-model.js';
import { createBannerTable } from './models/banner-model.js';
import { createServiceTable } from './models/service-model.js';
import { createBalanceTable } from './models/balance-model.js';
import { createTransactionTable } from './models/transaction-model.js';
import { userRouter } from './routes/user-route.js';
import { serviceRouter } from './routes/service-route.js';
import { balanceRouter } from './routes/balance-route.js';
import { bannerRouter } from './routes/banner-route.js';
import { transactionRouter } from './routes/transaction-router.js';

const app = express();
dotenv.config();

const port = process.env.PORT

app.use(express.json());
app.use(userRouter)
app.use(serviceRouter)
app.use(balanceRouter)
app.use(bannerRouter)
app.use(transactionRouter)
app.use('/uploads/images', express.static(path.join(process.cwd(), 'uploads/images')));

const initializeDatabase = async () => {
    try {
      await connection.connect();
      console.log('Connected to the database.');

      await createUsersTable();
      await createBannerTable();
      await createServiceTable();
      await createBalanceTable();
      await createTransactionTable();
    } catch (error) {
      console.error('Database connection error:', error);
    }
};

const startServer = async () => {
    await initializeDatabase();
    app.listen(port, () => {
        console.log(`API Running In Port: ${port}`);
    });
};

startServer();