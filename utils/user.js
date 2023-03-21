
const moment = require("moment");

const users =[];

function userJoin(id,username,room){
    const user = {id,username,room}
    users.push(user);
    return user;
}

function formatMsg(username,text){
    return {
        username,
        text,
        time:moment().format("h:mm a")
    }
}

function GetRoomUsers(room){
    return users.filter(user=>user.room===room)
}

function GetCurrentUser(id){
        return users.find(user=>user.id===id)
}

function userLeave(id){
    for(let i=0; i<users.length; i++){
        if(users[i].id===id){
            return users.splice(i,1)[0]
        }
    }
}

module.exports = {userJoin,formatMsg,GetRoomUsers,GetCurrentUser , userLeave}