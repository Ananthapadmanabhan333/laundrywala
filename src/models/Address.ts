import mongoose, { Schema, Document } from 'mongoose'

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  addressLine: string
  latitude: number
  longitude: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const addressSchema = new Schema<IAddress>(
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
      default: 'Home',
    },
    addressLine: {
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const Address =
  mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema)
