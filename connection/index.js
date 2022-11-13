import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`Connect to mongoDB successfully on ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export { connectDB }
