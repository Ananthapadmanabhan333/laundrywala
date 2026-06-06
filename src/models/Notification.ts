import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  message: string
  type: 'order' | 'payment' | 'general' | 'coupon'
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['order', 'payment', 'general', 'coupon'],
      default: 'general',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', notificationSchema)
