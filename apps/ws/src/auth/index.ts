import jwt from 'jsonwebtoken';
import { WebSocket } from 'ws';
import { User } from '../utils';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

export interface userJwtClaims {
  id: number;
  name: string;
  isGuest?: boolean;
  image:string
}

export const extractAuthUser = (token: string, ws: WebSocket): User | null => {
    try {
        const decoded = jwt.verify(token, jwtSecret) as userJwtClaims;
        return {...decoded,socket:ws};        
    } catch (error) {
        console.log(error);
        return null;
    }

};