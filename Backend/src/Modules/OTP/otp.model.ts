import { Model, model, Schema } from 'mongoose'
interface IOtp {
  userEmail: string
  otp: string
  expiresAt: Date
}

type OTPModel = Model<IOtp, object>

const otpSchema = new Schema<IOtp>(
  {
    userEmail: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      expires: 600 // Document expires after 600 seconds (10 minutes)
    }
  },
  {
    timestamps: true
  }
)

const Otp = model<IOtp, OTPModel>('OTP', otpSchema)

export default Otp
