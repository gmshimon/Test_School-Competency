import { NextFunction, Request, Response } from 'express'
import Otp from './otp.model'
import { IUser } from '../User/user.interface'
import User from '../User/user.model'
import sendOTPEmail from '../../Utilis/sendOTP'

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    const userData: IUser | null = await User.findOne({ email: data.email })
    if (userData?.verified) {
      const deleteOtp = await Otp.deleteOne({ userEmail: data.email })
      return res.status(200).json({
        status: 'Failed',
        message: 'User already  verified'
      })
    }
    const otpdata = await Otp.findOne({ userEmail: data.email })

    //verify the expired date of otp
    const currentDate = new Date()
    const otpExpired = currentDate > new Date(otpdata?.expiresAt)

    if (otpExpired) {
      // Handle the case where the OTP is expired
      const deleteOtp = await Otp.deleteOne({ userEmail: data.email })
      return res.status(400).json({ message: 'OTP has expired.' })
    } else {
      // Handle the case where the OTP is valid and the user is not verified
      if (parseInt(data.otp, 10) === parseInt(otpdata?.otp, 10)) {
        //update the user verified
        const updateUser = await User.updateOne(
          { _id: userData?._id },
          {
            $set: {
              verified: true
            }
          }
        )
        const deleteOtp = await Otp.deleteOne({ userEmail: data.email })
        return res
          .status(200)
          .json({ status: 'success', message: 'User Verified' })
      } else {
        const deleteOtp = await Otp.deleteOne({ userEmail: data.email })
        res
          .status(200)
          .json({ status: 'failed', message: 'Wrong OTP, Request new otp' })
      }
    }
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error
    })
  }
}


const regenerateOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    const deleteOtp = await Otp.deleteOne({ userEmail: data.email })
    if (deleteOtp.deletedCount === 1) {
      const generateOTP = Math.floor(1000 + Math.random() * 9000)
      sendOTPEmail(data.email )
      return res.status(200).json({
        status: 'success',
        message: 'New OTP generated'
      })
    }
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error
    })
  }
}
export default { verifyOTP, regenerateOTP }