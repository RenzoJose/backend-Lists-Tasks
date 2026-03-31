import express from 'express'
import tasksRouter from './tasks/tasks.routes'

const app = express()

// CORS — permite peticiones desde el frontend (Vite en dev)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']
app.use((_req, res, next) => {
  const origin = _req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
})

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json())

// Rutas de la API
app.use('/api/tasks', tasksRouter)

// Ruta raíz de comprobación
app.get('/', (_req, res) => {
  res.json({ message: 'API de Tareas funcionando ✅' })
})

export default app
