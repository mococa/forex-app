import {Request, Response} from "express"
import User from '../models/User';
class UserController{
    public async get(req:Request, res:Response):Promise<Response>{
        const users = await User.find()
        return res.json(users)
    }
    public async create(req:Request, res:Response):Promise<Response>{
        const user = await User.create(req.body).catch(err=>({error:Object.keys(err.errors).map(x=>(err.errors[x].message))}))
        return res.json(user)
    }
    public async update(req:Request, res:Response):Promise<Response>{
        const user = await User.findOneAndUpdate({_id:req.body._id}, req.body).catch(err=>({error:Object.keys(err.errors).map(x=>(err.errors[x].message))}))
        return res.json(user)
    }
    public async mine(req:Request, res:Response):Promise<Response>{
        const user = await User.findOne({_id:req.query.id})
        console.log(user)
        return res.json(user)
    }
    public async pushTrade(req:Request, res:Response):Promise<Response>{
        const user = await User.findOneAndUpdate({_id:req.body._id}, {$push:{trades: req.body.trade}, $inc:{balance:req.body.trade.profit}}).catch(err=>({error:Object.keys(err.errors).map(x=>(err.errors[x].message))}))
        return res.json(user)
    }
}
export default new UserController()