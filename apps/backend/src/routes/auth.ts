import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get('/google',passport.authenticate('google',{scope:["profile","email"]}));

authRouter.get('/google/callback',passport.authenticate('google',{
    successRedirect:'/success',
    failureRedirect:'/fail'
}))

export default authRouter;