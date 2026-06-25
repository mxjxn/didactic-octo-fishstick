import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import gameRoutes from './routes/games'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/games', gameRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Serve frontend static files
const frontendDist = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist))

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
