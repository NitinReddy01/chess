import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "jwt_secret";
const appUrl = process.env.APP_URL || "chess://play";
const webUrl = process.env.WEB_URL || "http://localhost:8081/play";

const authRouter = Router();

authRouter.get('/google',(req,res,next)=>{
    const platform = req.query.platform || 'web'; 
    const state = encodeURIComponent(JSON.stringify({ platform })); 
    passport.authenticate('google', {
        scope: ["profile", "email"],
        state 
    })(req, res, next);
});


// authRouter.get('/google/callback',passport.authenticate('google',{
//     successRedirect:'chess://auth',
//     failureRedirect:'/fail'
// }))

authRouter.get('/google/callback', (req, res, next) => {
    const state = req.query.state ? JSON.parse(decodeURIComponent(req.query.state as string)) : {};
    const platform = state.platform || 'web';
    // @ts-ignore
    passport.authenticate('google', (err, user, info,status) => {
        if (err) {
            return next(err); 
        }
        if (!user) {
            return res.redirect('/fail'); 
        }

        const token = jwt.sign({id:user.id,name:user.name,image:user.image},jwtSecret,{algorithm:'HS256'});
        const userDetails = {...user,token};
        const userString = JSON.stringify(userDetails);
        const redirectUrl = platform === "web"?`${webUrl}?user=${userString}`:`${appUrl}?user=${userString}`;

        return res.redirect(redirectUrl);
    })(req, res, next);
});


export default authRouter;