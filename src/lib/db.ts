import mongoose, { Connection } from 'mongoose'

let cachedConnection: Connection | null = null

export async function connectDB(): Promise<Connection> {
  if (cachedConnection) {
    console.log('🔄 Using cached database connection')
    return cachedConnection
  }

  try {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined')
    }

    console.log('📡 Connecting to MongoDB...')

    const connection = await mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })

    cachedConnection = connection.connection
    console.log('✅ Connected to MongoDB successfully')

    return cachedConnection
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    throw error
  }
}

export async function disconnectDB(): Promise<void> {
  if (cachedConnection) {
    await mongoose.disconnect()
    cachedConnection = null
    console.log('📴 Disconnected from MongoDB')
  }
}

export default connectDB
