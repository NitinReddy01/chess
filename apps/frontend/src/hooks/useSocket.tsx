import { useEffect, useState } from "react";

const wsUrl = import.meta.env.VITE_APP_WS_URL

export default function useSocket() {
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws = new WebSocket(wsUrl);
        ws.onopen = ()=>{
            setSocket(ws);
        }

        ws.onclose = ()=>{
            setSocket(null);
        }

        return ()=>{
            ws.close();
        }

    },[]);

  return socket;
}
