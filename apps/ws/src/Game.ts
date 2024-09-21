import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { move } from "./utils";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private game:Chess;

    constructor(player1:WebSocket,player2:WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.game = new Chess();
        this.player1.send(JSON.stringify({
            type:"start",
            payload:{
                color:'white'
            }
        }))
        this.player2.send(JSON.stringify({
            type:"start",
            payload:{
                color:'black'
            }
        }))
    }

    public move(socket:WebSocket,move:move) {
    
        if(this.game.turn() === 'w' && socket !== this.player1) {
            return ;
        }

        if(this.game.turn() === 'b' && socket !== this.player2) {
            return ;
        }

        try {
            this.game.move(move);
        } catch (error) {
            console.log(error);
            return ;
        }
        if(this.game.turn() === 'w') {
            this.player1.send(JSON.stringify({
                type:"move",
                payload:{
                    move
                }
            }))
        } else {
            this.player2.send(JSON.stringify({
                type:"move",
                payload:{
                    move
                }
            }))
        }
    }
}