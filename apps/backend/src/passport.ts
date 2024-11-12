import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from './db';


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
        const email = profile.emails?profile.emails[0].value:"test@gmail.com"
        const imageUrl = profile._json.picture || "sample-image"
        try {
            const user = await db.user.upsert({
                create:{
                    name:profile.displayName,
                    provider:"GOOGLE",
                    email,
                    image:imageUrl
                },
                update:{
                    name:profile.displayName
                },
                where:{
                    email
                }
            });
            done(null,{id:user.id,email:user.email,name:user.name,image:imageUrl});
        } catch (error) {
            console.log(error);
        }
    }))

    passport.serializeUser(function (user,done){
        done(null,user)
    })

    passport.deserializeUser(function (user:Express.User,done){
        done(null,user);
    })
}