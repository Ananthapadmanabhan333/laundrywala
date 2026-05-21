import mongoose, { Schema, Document } from 'mongoose'

export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'collected'
  | 'in_wash'
  | 'in_iron'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface IClothItem {
  category: string
  quantity: number
  service: 'wash' | 'wash_iron' | 'dry_clean' | 'premium'
  price: number
}

export interface IOrder extends Document {
  orderNumber: string
  userId: mongoose.Types.ObjectId
  customerId: mongoose.Types.ObjectId
  agentId?: mongoose.Types.ObjectId
  clothes: IClothItem[]
  pickupDetails: {
    address: string
    latitude: number
    longitude: number
    scheduledDate: Date
    timeSlot: string
    notes?: string
  }
  deliveryDetails: {
    address: string
    latitude: number
    longitude: number
    estimatedDate: Date
    timeSlot: string
  }
  status: OrderStatus
  timeline: {
    status: OrderStatus
    timestamp: Date
    agentLocation?: {
      latitude: number
      longitude: number
    }
  }[]
  pricing: {
    subtotal: number
    tax: number
    discount: number
    deliveryFee: number
    total: number
  }
  payment: {
    method: 'razorpay' | 'cod'
    status: 'pending' | 'completed' | 'failed'
    transactionId?: string
    paidAt?: Date
  }
  notifications: {
    userId: string
    message: string
    type: string
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    clothes: [
      {
        category: String,
        quantity: Number,
        service: String,
        price: Number,
      },
    ],
    pickupDetails: {
      address: String,
      latitude: Number,
      longitude: Number,
      scheduledDate: Date,
      timeSlot: String,
      notes: String,
    },
    deliveryDetails: {
      address: String,
      latitude: Number,
      longitude: Number,
      estimatedDate: Date,
      timeSlot: String,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'assigned',
        'collected',
        'in_wash',
        'in_iron',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },
    timeline: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        agentLocation: {
          latitude: Number,
          longitude: Number,
        },
      },
    ],
    pricing: {
      subtotal: Number,
      tax: Number,
      discount: { type: Number, default: 0 },
      deliveryFee: Number,
      total: Number,
    },
    payment: {
      method: {
        type: String,
        enum: ['razorpay', 'cod'],
        default: 'cod',
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      transactionId: String,
      paidAt: Date,
    },
    notifications: [
      {
        userId: String,
        message: String,
        type: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
)

orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ status: 1, agentId: 1 })

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)
