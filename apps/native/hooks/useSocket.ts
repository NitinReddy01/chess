import { useEffect, useState } from 'react';
import useAppSelector from './useAppSelector';

export default function useSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const wsURL = process.env.EXPO_PUBLIC_WS_URL;
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        if (!wsURL) {
            console.log("Invalid WebSocket URL");
            return;
        }
        // console.log("WebSocket URL:", wsURL);

        const ws = new WebSocket(`${wsURL}?token=${token}`);
        let heartbeatInterval: NodeJS.Timeout;

        ws.onopen = () => {
            // console.log("WebSocket connected");
            setSocket(ws);

            heartbeatInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "ping" }));
                    console.log("Ping sent");
                }
            }, 57000);
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            // console.log("WebSocket disconnected");
            setSocket(null);

            if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
            }
        };

        return () => {
            if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
            }
            ws.close();
        };
    }, [wsURL, token]);

    return socket;
}
