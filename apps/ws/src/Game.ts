import { Chess, Move } from "chess.js";
import { GAME_OVER, GameResult, GameStatus, MOVE, move, User } from "./utils";
import { v4 } from "uuid";
import { socketManager } from "./SocketManager";
import { db } from "./db";


export class Game{
    public whitePlayer: User | null;
    public blackPlayer: User | null;
    private game:Chess;
    public gameId:string;
    private whitePlayerTime = 0;
    private blackPlayerTime = 0;
    private lastMoveTime = new Date();
    public result:GameResult | null = null;

    constructor(player1:User,player2:User | null,gameTime:number) {
        this.whitePlayer = player1;
        this.blackPlayer = player2;
        this.game = new Chess();
        this.gameId = v4();
        this.whitePlayerTime = gameTime;
        this.blackPlayerTime = gameTime;
    }

    async startGame(player2:User){
        if(!player2) {
            return ;
        }
        this.blackPlayer = player2;
        this.lastMoveTime = new Date(Date.now());
        await this.addGameInDb();
        socketManager.brodcast(this.gameId,JSON.stringify({
            type:'start-game',
            payload:{
                gameId:this.gameId,
                whitePlayer:{
                    id:this.whitePlayer?.id,
                    name:this.whitePlayer?.name,
                    image:this.whitePlayer?.image,
                    guest:this.whitePlayer?.isGuest,
                    time:this.whitePlayerTime
                },
                blackPlayer:{
                    id:this.blackPlayer?.id,
                    name:this.blackPlayer?.name,
                    image:this.blackPlayer?.image,
                    guest:this.blackPlayer?.isGuest,
                    time:this.blackPlayerTime
                }
            }
        }));
    }

    private async addGameInDb(){
        const game = await db.game.create({
            data:{
                id:this.gameId,
                whitePlayerId:this.whitePlayer?.id!,
                blackPlayerId:this.blackPlayer?.id!,
                board:this.game.fen(),
                startedAt:new Date(Date.now()),
                status:"in_progress"
            }
        });
    }

    private async addMoveInDb(move:move,timeStamp:Date){
        await db.$transaction([
            db.move.create({
                data:{
                    gameId:this.gameId,
                    from:move.from,
                    to:move.to,
                    timeStamp
                }
            }),
            db.game.update({
                where:{
                    id:this.gameId
                },
                data:{
                    board:this.game.fen()
                }
            })
        ])
    }

    public async move(user:User,move:move) {
    
        if(this.game.turn() === 'w' && user.id !== this.whitePlayer?.id) {
            return ;
        }
        
        if(this.game.turn() === 'b' && user.id !== this.blackPlayer?.id) {
            return ;
        }

        try {
            this.game.move(move);
            const moveTime = new Date(Date.now());
            const timeElapsed = Math.floor((moveTime.getTime() - this.lastMoveTime.getTime()) / 1000);
            // turn is flipped as move is done
            if(this.game.turn() === "b") {
                this.whitePlayerTime -= timeElapsed;
            } else if(this.game.turn() === "w" ) {
                this.blackPlayerTime -= timeElapsed;
            }

            await this.addMoveInDb(move,moveTime);

            socketManager.brodcast(this.gameId,JSON.stringify({
                type:MOVE,
                payload:{
                    move,
                    whitePlayerTime:this.whitePlayerTime,
                    blackPlayerTime:this.blackPlayerTime,
                }
            }))
            this.lastMoveTime = moveTime;
            if(this.game.isGameOver()){
                let result : GameResult, reason = "" ;
                if(this.game.isCheckmate()){
                    result = this.game.turn() === "b"? "White Wins": "Black Wins";
                    reason = "Checkmate";
                } else if(this.game.isStalemate()) {
                    result = "Draw";
                    reason = "Stalemate";
                } else if (this.game.isThreefoldRepetition()){
                    result = "Draw";
                    reason = "Repetition";
                } else if(this.game.isDraw()) {
                    result = "Draw";
                    if(this.game.isInsufficientMaterial()) {
                        reason = "Insufficient Material";
                    } else {
                        reason = "50 Move Rule";
                    }
                } 
                this.endGame("completed",result!,reason)
            }
        } catch (error) {
            console.log(error);
            return ;
        }
    }

    private async endGame(status:GameStatus,result:GameResult,reason:string) {
        socketManager.brodcast(this.gameId,JSON.stringify({
            type:GAME_OVER,
            payload:{
                result,
                reason
            }
        }));
        this.result = result;
    }
}