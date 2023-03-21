const { Socket } = require("engine.io");
const express = require("express");
const { userJoin, formatMsg, GetRoomUsers, GetCurrentUser, userLeave} = require("./utils/user")

const app = express();
const http = require("http");
const { Server } = require("socket.io");

let httpserver = http.createServer(app);

let io = new Server(httpserver)

let temp= "ABC Server"

io.on("connection", (socket) => {
  //  console.log("new client joined")

    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //welcome current client
        socket.emit("message", formatMsg(temp, "welcome to abc server"))


        //broadcast when new client join the chatRoom
        socket.broadcast.to(user.room).emit("message",formatMsg(temp,"a new client has joined the chat"))

        //send client and room info to  everyone in same Room
        io.to(user.room).emit("roomUsers",{room:user.room,users:GetRoomUsers(user.room)})

        //chatMsg
        socket.on("chatMessage",(msg)=>{
            const user = GetCurrentUser(socket.id);
            io.to(user.room).emit("message",formatMsg(user.username,msg))
        })
    })

    //client disconnect
    socket.on("disconnect", () => {
     //   console.log("client leave");
        let user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit("message",formatMsg(temp,`${user.username}  has left the chat room`))
        }

        //send users and room info
        io.to(user.room).emit("roomUsers",{room:user.room,users:GetRoomUsers(user.room)})
    })
})



httpserver.listen(8000, () => {
    console.log("listing at port 8000")
})

