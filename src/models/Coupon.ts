import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  discountType: 'percentage' | 'fixed'
  value: number
  minOrderValue: number
  maxDiscount?: number
  expiresAt: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Coupon =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema)
