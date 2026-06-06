import mongoose, { Schema, Document } from 'mongoose'

export interface IReply {
  userId: mongoose.Types.ObjectId
  userName: string
  message: string
  createdAt: Date
}

export interface ISupportTicket extends Document {
  userId: mongoose.Types.ObjectId
  subject: string
  message: string
  status: 'open' | 'pending' | 'resolved' | 'closed'
  replies: IReply[]
  createdAt: Date
  updatedAt: Date
}

const replySchema = new Schema<IReply>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
)

export const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema)
