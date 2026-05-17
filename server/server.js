import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import vendorRoutes from './routes/vendorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
// Import models to register schemas
import './models/User.js'
import './models/Product.js'
import './models/Order.js'
import './models/Vendor.js'

import helmet from 'helmet'
import hpp    from 'hpp'
import rateLimit from 'express-rate-limit'

dotenv.config()
connectDB()

const app = express()

// ─── SECURITY MIDDLEWARE ──────────────────────────────────
app.use(helmet()) // Set security headers
app.use(hpp())    // Prevent HTTP Parameter Pollution

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      10000,            // Limit each IP to 10000 requests per windowMs
  message:  'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders:   false,
})

// Apply limiter to all routes (or just /api)
app.use('/api', limiter)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://icecream-app-rho.vercel.app',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}))
app.use(express.json({ limit: '10kb' })) // Limit body size to prevent DoS
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => res.send('IceCream API running 🍦'))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))