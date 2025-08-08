import express from 'express';
import authController  from './user.controller'
import uploader from '../../Middleware/FileUpload/upload';

const router = express.Router();

router.post('/create-user',uploader.single('image'),authController.registerUser)
router.post('/login',authController.loginUser)
export default router