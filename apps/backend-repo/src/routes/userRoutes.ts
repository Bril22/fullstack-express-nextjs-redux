import express from 'express';
import { updateUserData, fetchUserData } from '../controller/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.patch('/update-user-data', authMiddleware, updateUserData);
router.get('/fetch-user-data', authMiddleware, fetchUserData);

export default router;