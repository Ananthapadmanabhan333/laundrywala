import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  phone: string
  name: string
  email?: string
  profileImage?: string
  address: string
  latitude: number
  longitude: number
  accountType: 'customer' | 'agent' | 'admin'
  firebaseUID: string
  isVerified: boolean
  isActive: boolean
  preferences: {
    notifications: boolean
    sms: boolean
    email: boolean
  }
  wallet: {
    balance: number
    transactions: {
      id: string
      amount: number
      type: 'credit' | 'debit'
      description: string
      createdAt: Date
    }[]
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    profileImage: String,
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    accountType: {
      type: String,
      enum: ['customer', 'agent', 'admin'],
      default: 'customer',
    },
    firebaseUID: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
    },
    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [
        {
          id: String,
          amount: Number,
          type: {
            type: String,
            enum: ['credit', 'debit'],
          },
          description: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

userSchema.index({ phone: 1 })
userSchema.index({ firebaseUID: 1 })
userSchema.index({ accountType: 1 })
userSchema.index({ createdAt: -1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
