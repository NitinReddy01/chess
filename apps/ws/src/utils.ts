import { WebSocket } from "ws";

export type move = {from:string,to:string,promotion?:string};
export const JOIN_GAME = "join";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export interface User{
    id:number;
    name:string
    socket:WebSocket;
    isGuest?:boolean;
    image:string;
}

export type GameStatus = "completed" | "in_progress" | "time_up" | "aborted" | "player_exit";
export type GameResult = "White Wins" | "Black Wins" | "Draw"
  