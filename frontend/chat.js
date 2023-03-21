
const socket = io("http://localhost:8000/" ,{transports:["websocket"]})

let roomName  = document.getElementById("room-name");
let userlist = document.getElementById("users");
let chatForm = document.querySelector(".chat_form");

const urlparam = new URLSearchParams(window.location.search);
const username = urlparam.get("username");
const room = urlparam.get("room");


//join chatroom
socket.emit("joinRoom", {username, room})


//msg from server
socket.on("message",msg=>{
  //  console.log(msg)
    outputmsg(msg)
})

//msg submit
chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    
    //msg text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    //send msg to server
    socket.emit("chatMessage",msg);

    //clear input value
    e.target.elements.msg.value="";
})


//output msg to dom
function outputmsg(msg){
    let div = document.createElement("div");
    let p = document.createElement("p");
    
    p.innerText = msg.username;
    p.innerHTML += ` <span> ${msg.time}<span/>`
    div.appendChild(p);
    let paragraph = document.createElement("p");
    paragraph.innerText = msg.text;

    div.appendChild(paragraph)

    let chatMsg= document.querySelector(".chat_msg")
    chatMsg.appendChild(div)
}

//get room and all users in that room
socket.on("roomUsers", ({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

// output room name to dom
function outputRoomName(room_name){
   roomName.innerText= room_name
}

// output user name to dom
function outputUsers(usersData){
    userlist.innerHTML= "";
    usersData.forEach((user)=>{
        let li = document.createElement("li");
        li.innerText=user.username;
        userlist.append(li)
    })
}