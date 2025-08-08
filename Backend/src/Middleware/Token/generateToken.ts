import jwt from 'jsonwebtoken'
import { IUser } from '../../Modules/User/user.interface'

interface IPayload {
  id: string | undefined
  email: string
  role: string
}

const generateToken = (userInfo: IUser) => {
  try {
    const payload = {
      id: userInfo._id,
      email: userInfo.email,
      role: userInfo.role
    }
    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      expiresIn: '5h'
    })
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    )
    return { accessToken, refreshToken }
  } catch (error) {
    return Promise.reject(error)
  }
}

export default generateToken
