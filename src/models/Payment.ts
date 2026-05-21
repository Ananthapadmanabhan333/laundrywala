import mongoose, { Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  orderId: mongoose.Types.ObjectId
  amount: number
  currency: string
  method: 'razorpay' | 'cod'
  status: 'pending' | 'completed' | 'failed'
  razorpayPaymentId?: string
  razorpayOrderId?: string
  razorpaySignature?: string
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    errorMessage: String,
  },
  { timestamps: true }
)

export const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema)
