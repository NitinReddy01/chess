import { wp, wr, wq, wb, wn, wk, bp, bn, br, bk, bb, bq } from "./images";

export interface Player{
    id:string;
    name:string;
    image:string;
    time:number;
}

export type move = {from:string,to:string,promotion?:string}; 

export const chessImageMap = {
    'w': {
        'p': wp,
        'r': wr,
        'q': wq,
        'b': wb,
        'n': wn,
        'k': wk,
    },
    'b': {
        'p': bp,
        'n': bn,
        'r': br,
        'k': bk,
        'b': bb,
        'q': bq,
    }
};

export type GameResult = "White Wins" | "Black Wins" | "Draw"