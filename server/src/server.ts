import express from 'express';
import mongoose from 'mongoose'
import * as socketio from "socket.io";
import User from '../controllers/User'
import cors from 'cors'
import fetch from 'node-fetch'
import currency from './currency'
import { SlowBuffer } from 'buffer';
//import { io } from "socket.io-client";


const app = express()
const server = require('http').createServer(app);

app.use(cors())
app.use(express.json())

const WebSocket = require ('ws');

       

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

//const findFirstDiff = (str1:any, str2:any):string => str2[[...str1].findIndex((el, index) => el !== str2[index]);

  const reconnectInterval  = 1000
  console.log("User connected")
  const token = "siou_xj8kxWEApsya8xVw"
  
  const payload = JSON.stringify({
      userKey:token, 
      symbol:"GBPUSD"//socket.handshake.query.to.toUpperCase()+socket.handshake.query.from.toUpperCase(),
  }) 
      
  
io.on("connection", async function(socket: any) {
    var ws
    var connect = function(){

    const ws = new WebSocket ('wss://marketdata.tradermade.com/feedadv');
  
    ws.on('open', function open() {
        ws.send(payload);
       
    });
    
    ws.on('close', function() {
      console.log('socket close');
      setTimeout(()=>{connect()}, reconnectInterval)
    });
    
    ws.on('message', function incoming(data: string) {
       if(data.length > "User Key Used to many times".length /*&&
        // data !== lastData*/){
            try{
                setTimeout(async ()=>{
                    await io.emit('trading',data);
                }, 1000)
                console.log(data)
            }catch(er){
                console.log(er)
            }
        // lastData = data;
         }
    })
}
connect()
    
        
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

app.get('/', async (req,res)=>{
    res.json({status:200}) 
})

app.get('/api/users', User.get)

app.get('/api/user',/*checkUser,*/ User.mine)
app.post('/api/users/create', User.create)
app.post('/api/trade', User.pushTrade)
app.post('/api/user/update', User.update)
app.get("/time", async (req,res)=>{
    const response_time = await fetch(
        "https://www.timeapi.io/api/Time/current/zone?timeZone=" +
          req.query.timezone
      );
      const _time = await response_time.json();
      return res.json(_time)
})
server.listen(3001);
