import {io} from "socket.io-client";

const server = process.env.REACT_APP_BASE_URL;


export const socketInit = () => {
    const options = {
        "force new connection" : true,
        reconnectionAttempt: "infinity",
        timeout: 10000,
        enabledTransports: ["ws", "wss"],// important
    }
    return io(server,options)
}



