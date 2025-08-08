import { Model, model, Schema } from 'mongoose'
import { IUser } from './user.interface'
import validator from 'validator'
import bcrypt from 'bcrypt'

type UserModel = Model<IUser, object>

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please Provide the name']
    },
    email: {
      type: String,
      require: [true, 'Please provide the email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      lowercase: true,
      unique: [true, 'Account with this email exists']
    },
    password: {
      type: String,
      required: [true, 'Please provide the password'],
      validator: value => {
        validator.isStrongPassword(value, {
          minLength: 6
        })
      }
    },
    photo: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'supervisor'],
      default: 'student'
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (!err) {
        this.password = hash
        next()
      }
      if (err) console.log(err)
    })
  })
})

const User = model<IUser, UserModel>('User', userSchema)
export default User
