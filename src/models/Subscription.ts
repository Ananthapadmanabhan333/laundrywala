import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscription extends Document {
  name: string
  description: string
  price: number
  billingCycle: 'weekly' | 'monthly' | 'quarterly'
  pickupsPerWeek: number
  discount: number
  benefits: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly'],
      required: true,
    },
    pickupsPerWeek: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    benefits: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const Subscription =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema)
