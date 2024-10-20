import express from 'express';
import { registrasi, login, profile, update, profileImg } from '../controllers/user-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';
import { uploadImgMiddleware } from '../middlewares/upload-middleware.js';

const userRouter = express.Router();

userRouter.post("/registration", registrasi);
userRouter.post("/login", login);
userRouter.get("/profile", authenticate, profile);
userRouter.put("/profile/update", authenticate, update);
userRouter.put("/profile/image", authenticate, uploadImgMiddleware, profileImg);

export { userRouter };