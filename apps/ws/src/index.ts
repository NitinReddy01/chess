import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { parse } from 'url';
import { extractAuthUser } from './auth';

const wss = new WebSocketServer({ port: 8001 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws,req) {
    if(!req.url){
        return ;
    }
    const params = parse(req.url,true).query
    const user = extractAuthUser(params.token as string,ws);
    if(user) {
        gameManager.addUser(user);
    }
    ws.on('close',()=>{
        gameManager.removeUser(ws);
    })

});

console.log("WS running");