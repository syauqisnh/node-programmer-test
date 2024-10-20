import express from 'express';
import { registrasi, login, profile, update, profileImg } from '../controllers/user-controller.js';
import { banner } from '../controllers/banner-controller.js'
import { service } from '../controllers/service-controller.js';
import { balance, topup } from '../controllers/balance-controller.js';
import { history, transaction } from '../controllers/transaction-controller.js'
import { authenticate } from '../middlewares/auth-middleware.js';
import { uploadImgMiddleware } from '../middlewares/upload-middleware.js';

const router = express.Router();

router.post("/registration", registrasi);
router.post("/login", login);
router.get("/profile", authenticate, profile);
router.put("/profile/update", authenticate, update);
router.put("/profile/image", authenticate, uploadImgMiddleware, profileImg);

router.get("/banner", banner)

router.get("/service", authenticate, service)

router.get("/balance", authenticate, balance)
router.post("/topup", authenticate, topup)

router.post("/transaction", authenticate, transaction)
router.get("/transaction/history", authenticate, history)

export { router };