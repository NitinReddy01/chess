import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, JOIN_GAME, MOVE, User } from "./utils";
import { socketManager } from "./SocketManager";

export class GameManager{
    private games:Game[];
    private waitingGameId : string | null = null;

    constructor(){
        this.games = [];
    }

    addUser(user:User) {
        this.addHandler(user);
    }

    private addHandler(user:User) {
        user.socket.on('message',(data)=>{
            const message = JSON.parse(data.toString());

            switch (message.type) {
                case INIT_GAME:
                    if(this.waitingGameId) {
                        socketManager.addUser(this.waitingGameId,user);
                        const game = this.games.find(game=>game.gameId === this.waitingGameId);
                        if(!game) {
                            return;
                        }
                        if(game.whitePlayer?.id === user.id) {
                            return ;
                        }
                        game.startGame(user);
                        this.waitingGameId = null;
                    } else {
                        const game = new Game(user,null,10*60);
                        this.games.push(game);
                        this.waitingGameId = game.gameId;
                        socketManager.addUser(game.gameId,user)
                    }
                    break;
                case JOIN_GAME:
                    {
                        const gameId = message.payload.gameId;
                        if(!gameId) {
                            return ;
                        }
                        const availableGame = this.games.find(game=>game.gameId === gameId);

                    }   

                    break;
                case MOVE:
                    const gameId = message.payload.gameId;
                    if(!gameId) {
                        return ;
                    }
                    const game = this.games.find(game=>game.gameId === gameId);
                    if(!game) {
                        return ;
                    }
                    const move = message.payload.move;
                    game.move(user,move);
                    if(game.result) {
                        // remove game from games
                    }
                    break;
                default:
                    break;
            }
        })
    }

    removeUser(socket:WebSocket) {
        console.log("remove");
    }

}