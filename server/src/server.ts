import express from 'express';
import mongoose from 'mongoose'
import * as socketio from "socket.io";
import http from 'http';
import User from '../controllers/User'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()

app.use(cors())
app.use(express.json())

const httpServer = http.createServer(app);

const io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
    }
});
  
io.on("connection", function(socket: any) {
    console.log("a user connected");
    socket.on("message", function(message: any) {
      console.log(message);
    });
  });
  
const server = httpServer.listen(3001, function() {
    console.log("listening on *:3001");
});
  

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/module1', {
        useNewUrlParser: true , 
        useUnifiedTopology: true
    }).then(()=>{
        console.log("MongoDB connection successfully.");
    }).catch(err=>{
        console.log("Error connecting to MongoDB: " + err);
    });

app.get('/', (req,res)=>{
    res.send("Hey")
})
app.get('/api/users', User.get)
app.get('/api/user', User.mine)
app.post('/api/users/create', User.create)
app.post('/api/push/trade', User.pushTrade)
app.post('/api/update', User.update)
app.get("/time", async (req,res)=>{
    const response_time = await fetch(
        "https://www.timeapi.io/api/Time/current/zone?timeZone=" +
          req.query.timezone
      );
      const _time = await response_time.json();
      return res.json(_time)
})
//app.listen(3001, ()=>console.log(101))