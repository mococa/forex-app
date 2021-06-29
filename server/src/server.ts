import express from 'express';
import mongoose from 'mongoose'
import * as socketio from "socket.io";

import User from '../controllers/User'
import cors from 'cors'
import fetch from 'node-fetch'
import currency from './currency'


const app = express()
const server = require('http').createServer(app);

app.use(cors())
app.use(express.json())



const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

io.on("connection", async function(socket: any) {
    console.log("User connected")
    const base_currency = await currency(new Date(), socket.handshake.query.from.toString(), socket.handshake.query.to.toString())
    console.log(base_currency)
    
     setInterval(()=>{
        const floated_currency = parseFloat((base_currency*((Math.random()*8 - 4)/100)).toFixed(5) )
        const data = {floating:floated_currency, newValue:(floated_currency+base_currency).toFixed(5)}
        //io.sentMydata = false;
        //if (!io.sentMydata) {
        io.emit('trading', data);
         //   io.sentMydata = true;
       // }
     },1000)
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
function checkUser(req:express.Request,res:express.Response,next:any) {
    if(req.query) return next()
    if(!User.mine) return res.json({error:"Could not find user in database"}).status(404)
}
app.get('/api/user',checkUser, User.mine)
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
server.listen(3001);
