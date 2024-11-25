import express from 'express';
const app = express();
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import { InitPassport } from './passport';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:"asd",
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false,maxAge:24*60*60*1000}
}))
InitPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());


app.use('/auth',authRouter);

app.get('/success',(req,res)=>{
    console.log(req.user);
    res.send(req.user);
})

app.get('/test',(req,res)=>{
    console.log(req.isAuthenticated());
    res.send(req.user);
})

app.listen(PORT,()=>{
    console.log(`Backend Server Running on ${PORT}`);
})