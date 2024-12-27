"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let socketArray = [];
console.log("not yet connected");
wss.on('connection', (socket) => {
    console.log("connected for now");
    socket.on("message", (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {
            socketArray.push({
                socket,
                RoomId: parsedMessage.payload.RoomId
            });
            console.log("user joined");
        }
        let currentUserRoomId = null;
        if (parsedMessage.type === 'chat') {
            let currentUserRoomId = null;
            for (let i = 0; i < socketArray.length; i++) {
                if (socketArray[i].socket === socket) {
                    currentUserRoomId = socketArray[i].RoomId;
                }
            }
            for (let j = 0; j < socketArray.length; j++) {
                if (socketArray[j].RoomId == currentUserRoomId) {
                    socketArray[j].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    // socket.on("disconnect",()=>
    // {
    //   socketArray=socketArray.filter((x.socket)=>x.socket!=parsedMessage.socket);
    // })
});
