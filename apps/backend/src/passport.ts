import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export  function InitPassport(){
    if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        console.log("Missing env values for auth providers");
        return ;
    }
    passport.use(new GoogleStrategy({
        clientID:GOOGLE_CLIENT_ID,
        clientSecret:GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'
    },async (accessToken,refreshToken,profile,done)=>{
        console.log(profile);
        done(null,{id:"asd"});
    }))

    passport.serializeUser(function (user,done){
        console.log(user,"serialize");
        done(null,user)
    })

    passport.deserializeUser(function (id,done){
        console.log(id);
        done(null,{name:"nitin"});
    })
}