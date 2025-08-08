import { NextFunction, Request, Response } from 'express'
import User from './user.model'
import path from 'path'
import fs from 'fs'
import sendOTPEmail from '../../Utilis/sendOTP'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import generateToken from '../../Middleware/Token/generateToken'

const deleteImage = file => {
  const filePath = path.join(__dirname, '../../../images/users', file)
  fs.unlink(filePath, unlinkError => {
    if (unlinkError) {
      console.error('Failed to delete the uploaded file:', unlinkError)
    } else {
      console.log('Uploaded file deleted successfully.')
    }
  })
}

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body
    const image =
      req.protocol +
      '://' +
      req.get('host') +
      '/images/users/' +
      req?.file.filename
    userData.photo = image
    const result = await User.create(userData)

    sendOTPEmail(result.email)

    res.status(200).json({
      status: 'success',
      message: 'Successfully registered',
      data: result.email
    })
  } catch (error) {
    if (req.file) {
      deleteImage(req.file.filename)
    }
    res.status(400).json({
      status: 'Failed',
      message: error
    })
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, pass } = req.body

    if (!email || !pass) {
      return res.status(403).json({
        status: 'Fail',
        message: 'Please provide credentials'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        status: 'Fail',
        message: 'No user with this email'
      })
    }
    if (!user?.verified) {
      return res.status(403).json({
        status: 'Fail',
        message: 'User Not verified'
      })
    }
    const isPasswordValid = bcrypt.compareSync(pass, user.password)
    if (!isPasswordValid) {
      return res.status(403).json({
        status: 'Fail',
        message: 'Wrong Credentials'
      })
    }
    const { accessToken, refreshToken } = await generateToken(user)
    const { password, ...others } = user.toObject()
    res.status(200).json({
      status: 'Success',
      message: 'Login successful',
      data: others,
      accessToken: accessToken,
      refreshToken: refreshToken
    })
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: 'Failed to login',
      error: error.message
    })
  }
}

const regenerateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' })
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findOne({email:decodedToken.email});
    const { accessToken } = await generateToken(
      user
    )

    res.status(200).json({
      status:"success",
      accessToken: accessToken,
    })
  } catch (error) {
    res.status(403).json({
      status: 'Fail',
      message: 'Invalid refresh token'
    })
  }
}

export default { registerUser, loginUser,regenerateAccessToken }