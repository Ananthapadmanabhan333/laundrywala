import mongoose, { Schema, Document } from 'mongoose'

export interface IPricing extends Document {
  category: string
  service: string
  basePrice: number
  pricePerUnit: number
  minPrice: number
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const pricingSchema = new Schema<IPricing>(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'shirts',
        't-shirts',
        'jeans',
        'sarees',
        'blazers',
        'blankets',
        'curtains',
        'shoes',
      ],
    },
    service: {
      type: String,
      required: true,
      enum: ['wash', 'wash_iron', 'dry_clean', 'premium'],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const Pricing =
  mongoose.models.Pricing || mongoose.model<IPricing>('Pricing', pricingSchema)
