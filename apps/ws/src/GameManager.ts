import { WebSocket } from "ws";
import { Game } from "./Game";
import { MOVE, START_GAME } from "./utils";

export class GameManager{
    private games:Game[];
    private users:WebSocket[]=[]
    private waitingUser : WebSocket | null = null;

    constructor(){
        this.games = [];
    }

    addUser(socket:WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    private addHandler(socket:WebSocket) {
        socket.on('message',(data)=>{
            const message = JSON.parse(data.toString());

            switch (message.type) {
                case START_GAME:
                    if(this.waitingUser) {
                        const game = new Game(this.waitingUser,socket);
                        this.games.push(game);
                        this.waitingUser = null;
                    } else {
                        this.waitingUser = socket;
                    }
                    break;
                case MOVE:
                    const game = this.games.find(game=>(game.player1 === socket || game.player2 === socket ));
                    if(game) {
                        game.move(socket,message.payload.move);
                    }
                    break;
                default:
                    break;
            }
        })
    }

    removeUser(socket:WebSocket) {
        this.users = this.users.filter(user=>user!==socket);

    }

    

}