import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import gameRoutes from './routes/games'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/games', gameRoutes)

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})
