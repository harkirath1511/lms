import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import subRoutes from './routes/subRoutes.js';
import queryRouter from './routes/queryRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

const app  = express();
const port = process.env.PORT || 3000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); 


app.get('/', (req, res) => res.send('API working'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/sub', subRoutes);
app.use("/api/queries", queryRouter);
app.use("/api/profile", profileRouter);
app.use("/api/uploads", uploadRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
