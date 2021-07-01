import { Request, Response } from "express"
import { Mongoose } from "mongoose";
import { ITrade } from "../models/Trade";
import User, { IBalance, IUser } from '../models/User';
class UserController {
    public async get(req: Request, res: Response): Promise<Response> {
        const users = await User.find()

        return res.json(users)
    }
    public async create(req: Request, res: Response): Promise<Response> {
        const user = await User.create(req.body).catch(function (err) {
            return { error: Object.keys(err.errors).map(x => (err.errors[x].message)) }
        });
        return res.json(user)
    }
    public async update(req: Request, res: Response): Promise<Response> {
        if (req.body.firstName === "" || req.body.timezone === "") return res.json({ error: "You cannot leave a blank field" })
        const user = await User.findOneAndUpdate({ _id: req.body._id }, req.body).catch(err => ({ error: Object.keys(err.errors).map(x => (err.errors[x].message)) })).catch(x => ({ error: "Unknown error. Are you logged in?" }))
        if (!user) return res.json({ error: "Could not find user in database" }).status(404)
        return res.json(user)
    }
    public async mine(req: Request, res: Response): Promise<Response> {
        const user = await User.findOne({ username: req.query.username })
        if (!user) return res.json({ error: "Could not find user in database" }).status(404)
        return res.json(user)
    }
    public async pushTrade(req: Request, res: Response): Promise<Response> {
        const { trade, _id } = req.body
        // User.updateOne({ _id: _id },
        //     {
        //         $push: { trades: trade },
        //         $inc: { [`balance.${trade.from.toLowerCase()}`]: trade.value },
        //     },
        //     {},
        //     ((err,docs)=>{
        //         console.log(err)
        //         console.log(docs)
        //     })
        // )
        // const user = await User
        //     .findOneAndUpdate(
        //         { _id: _id },
        //         {
        //             $push: { trades: trade },
        //             $inc: { [`balance.${trade.from.toLowerCase()}`]: trade.value },
        //         },
        //         {
        //             new:true
        //         }
        //     ).catch(err => err)

        const user = await User.findOne({_id:_id})
        if (!user) return res.status(404).json({ error: "User not found. Please reauthenticate yourself." })
        user.balance.usd += trade.value
        user.trades.push(trade as ITrade)
        const err = user.validateSync();
        if(err){
            return res.json(
               {errors:Object.keys(err.errors)
               .filter(x=>!x.includes('message') && x!=='name' && !x.includes('.'))
               .map((x)=>err.errors[x]['errors'][Object.keys(err.errors[x]['errors'])[0]].message)
            }).status(500)
        }else{
            user.save({validateBeforeSave:false})
            return res.json(user).status(200)
        }


        //assert.ok(error.errors['name']);
        //if(err) return res.json(err)
        // return user.save((err, result) => {
        //     if (err) {
        //         return res.json(err);
        //     } else {
        //         return res.json(result);
        //     }
        // })
        //return res.json(user)
        // ({
        //     error:Object.keys(err.errors.balance.errors).map(x=>(
        //     err.errors.balance.errors[x].message
        // ))})
        //return res.json(user)
        // try{
        //     await user.save()
        //     return res.json(user)
        // }catch(err){
        //     return err
        // }



    }
}
export default new UserController()