import express from 'express';
import { service } from '../controllers/service-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';

const serviceRouter = express.Router();

serviceRouter.get("/service", authenticate, service)

export { serviceRouter };
