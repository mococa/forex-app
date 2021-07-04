import { CastError, Model, model, Schema, Document, EnforceDocument } from "mongoose";
import TradeSchema,{ICoins, ICoinsKeys, ITrade} from "./Trade";
import AuthService from "../services/auth_service";
const SALT = 10

export interface IWallet{
  USD:number,
  GBP:number
}

export interface IUser{
    _id?:string,
    firstName:string,
    wallet:IWallet,
    timezone:string,
    trades: ITrade[],
    password:string,
    username:string,
    verified:boolean
}

interface UserModel extends Omit<IUser, '_id'>, Document{}

const UserSchema = new Schema({
    username: {type:String, required:[true,'You need to fill a username!'], unique:true},
    email:{type:String, required:[true, "You need to fill your e-mail"], unique:true},
    password:{type:String, required:true},
    firstName: {type:String, required:[true, 'You need to fill a first name!']},
    wallet: { 
        USD:{type:Number, default:10, min:[0, "You don't have enough money for this trade"]}, 
        GBP:{type:Number, default:10, min:[0, "You don't have enough money for this trade"]}, 
    },
    timezone: {type:String, default:"London"},
    trades:{type:[TradeSchema], default:[]},
    verified:{type:Boolean, default:false}
 },{timestamps:true})

UserSchema.path('username').validate(function(v:string){
    return model('User').findOne({ username: v }).then(user => !user)
}, "Username already taken")

UserSchema.path('email').validate(function(v:string){
    return model("User").findOne({email:v}).then(user => !user)
}, "Email already in use")

UserSchema.pre<UserModel>('save', async function():Promise<void>{
    if(!this.password || !this.isModified('password')) return;
    try{
        const hashedPassword = await AuthService.hashPassword(this.password)
        this.password = hashedPassword
    }catch(err){
        console.error(`Error hashing password for user ${this.username}`)
    }
})


export default model<UserModel>('User', UserSchema)