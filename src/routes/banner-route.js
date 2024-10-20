import express from 'express';
import { banner } from '../controllers/banner-controller.js'

const bannerRouter = express.Router();

bannerRouter.get("/banner", banner);

export { bannerRouter }