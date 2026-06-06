import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  orderId: mongoose.Types.ObjectId
  rating: number
  comment?: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Review =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema)
