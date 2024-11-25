import { User } from "./utils";


class SocketManager{
    public static instance:SocketManager;
    private rooms:Map<string,User[]>;
    private userRoomMapping:Map<User,string>;

    private constructor(){
        this.rooms = new Map<string,User[]>();
        this.userRoomMapping = new Map<User,string>();
    }

    static getInstance(){
        if(this.instance) {
            return this.instance;
        }
        this.instance = new SocketManager();
        return this.instance;
    }

    addUser(roomId:string,user:User){
        this.rooms.set(roomId,[...(this.rooms.get(roomId) || []), user])
        this.userRoomMapping.set(user,roomId);
    }

    brodcast(roomId:string,message:string){
        const users = this.rooms.get(roomId);
        if(!users) {
            return ;
        }
        users.map(user=>{
            user.socket.send(message);
        })
    }
}

export const socketManager = SocketManager.getInstance();