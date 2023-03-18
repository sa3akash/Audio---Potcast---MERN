const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/Routes");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const server = require("http").createServer(app)
const ACTIONS = require("./actions.js")


const io = require("socket.io")(server,{
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
})


// middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({limit: "8mb"}));
app.use(express.urlencoded({extended: true, limit: "8mb"}));
// image url work for static fulder  assain
app.use('/storage', express.static('storage'));
app.use(cookieParser());
app.use("/api",router);
mongoose.connect(process.env.DB_URL);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("DB connected...");
  });


// socket work

let socketUserMaping = {};

io.on("connection", (socket)=>{
  console.log("New User connection " + socket.id)

  socket.on(ACTIONS.JOIN,({roomId,user})=>{

        socketUserMaping[socket.id] = user
    // new Map
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        
      clients.forEach((clientId)=>{
        io.to(clientId).emit(ACTIONS.ADD_PEER,{
          peerId : socket.id,
          createOffer : false,
          user : user
        })
        socket.emit(ACTIONS.ADD_PEER,{
          peerId : clientId,
          createOffer : true,
          user : socketUserMaping[clientId]
        })
      })

      
      socket.join(roomId)
 
  })

 

  // handle relay ice 

  socket.on(ACTIONS.RELAY_ICE,({peerId,icecandidate})=>{
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE,{
      peerId: socket.id,
      icecandidate: icecandidate
    })
  })

  // Relay sdp (sesion description)
  socket.on(ACTIONS.RELAY_SDP, ({peerId,sessionDescription})=>{
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION,{
      peerId:socket.id,
      sessionDescription : sessionDescription
    })
  })



  /// handle mute unmute
  socket.on(ACTIONS.MUTE, ({roomId,userId})=>{

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

    clients.forEach(clientId=>{
      io.to(clientId).emit(ACTIONS.MUTE,{
        peerId: socket.id,
        userId
      })
    })

  })

  socket.on(ACTIONS.UNMUTE, ({roomId,userId})=>{
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

    clients.forEach(clientId=>{
      io.to(clientId).emit(ACTIONS.UNMUTE,{
        peerId: socket.id,
        userId
      })
    })
  })


  // leave

  const leaveRoom = ({roomId}) => {
    const {rooms} = socket;

    Array.from(rooms).forEach((roomId)=>{
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

      clients.forEach((clientId)=>{
        io.to(clientId).emit(ACTIONS.REMOVE_PEER,{
          peerId : socket.id,
          userId: socketUserMaping[socket.id]?.id
        })
        socket.emit(ACTIONS.REMOVE_PEER,{
          peerId : clientId,
          userId: socketUserMaping[clientId]?.id
        })
      })
      socket.leave(roomId)
    })

    delete socketUserMaping[socket.id]

  }

  socket.on(ACTIONS.LEAVE,leaveRoom)

  socket.on("disconnecting", leaveRoom)

})




// socket work end
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
