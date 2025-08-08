import express from 'express'
import otpController from './otp.controller'

const router = express.Router()
router.post('/verify-otp', otpController.verifyOTP)
router.post('/regenerate-otp', otpController.regenerateOTP)
export default router
