const express = require("express");
const app = express();
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io');
const { Socket } = require("dgram");

const port =  process.env.PORT || 4100  ;


//important to do create a server and connect to socket.IO
const server = http.createServer(app);
const io = socketIO(server,{
    cors:{
        origin:"http://localhost:3000/",
        methods:["GET", "HEAD"],
        Credential: true,
    }
});
const  users=[{}];
io.on("connection",(socket)=>{
    console.log("connection established 1");
    console.log("connection established");
   
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
  })

  socket.on('message',({message,id})=>{
      io.emit('sendMessage',{user:users[id],message,id});
  })

  socket.on('disconnectEvent',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
      console.log(`user left`);
  })
      
})

app.use(cors());

app.get('/', (req , res)=>{
    res.send("ITS WORKING")
})


server.listen(port , ()=>{
    console.log("listening on port " + port);
})
