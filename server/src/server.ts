import express from 'express';
import mongoose from 'mongoose'
import User from '../controllers/User'
import cors from 'cors'
import fetch from 'node-fetch'
import { Socket } from 'dgram';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const app = express()
const server = require('http').createServer(app);

app.use(cors())
app.use(express.json())



       

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

  const reconnectInterval  = 1000
  console.log("User connected")
  const token = process.env.tradermadeAPI
  
  const payload = JSON.stringify({
      userKey:token, 
      symbol:"GBPUSD"
  }) 
      
io.on("connection", async function(socket: Socket) {
    var ws
    var connect = function(){

    const ws = new WebSocket ('wss://marketdata.tradermade.com/feedadv');
  
    ws.on('open', function open() {
        ws.send(payload);
    });
    ws.on('error', function(d:string){
        console.log(d)
    })
    ws.on('close', function() {
      console.log('socket close');
      //setTimeout(()=>{connect()}, reconnectInterval)
    });
    
    ws.on('message', async function incoming(data: string) {
       if(data.length > "User Key Used to many times".length){
            try{
                setTimeout(async ()=>{
                    await io.emit('trading',data);
                }, 1000)
                console.log(data)
            }catch(er){
                console.log(er)
            }
         }
    })
}
connect()
    
        
 });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
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

app.get('/api/user',User.checkVerified, User.mine)
app.post('/api/users/create', User.create)
app.post('/api/trade', User.pushTrade)
app.post('/api/user/update', User.update)   
app.post('/api/user/buy', User.addMoney)   
app.get("/time", async (req,res)=>{
    const response_time = await fetch(
        "https://www.timeapi.io/api/Time/current/zone?timeZone=" +
          req.query.timezone
      );
      const _time = await response_time.json();
      return res.json(_time)
})


app.get('/api/verify/:id', User.verify)


server.listen(3001);
