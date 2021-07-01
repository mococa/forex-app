import { CastError, Model, model, Schema } from "mongoose";
import Trade from "./Trade";

export interface ITrade{
    from:string,
    to:string,
    when:string,
    value:number
}
//type Unpacked<T> = T extends (infer U)[] ? U : T;
export interface IBalance{
  usd:number,
  gbp:number
}
export const BalanceSchema = new Schema({
    usd:{type:Number, min:[0, "You don't have enough US$"]},
    gbp:{type:Number, min:[0, "You don't have enough £"]}
})
export interface IUser{
    firstName:string,
    balance:IBalance,
    timezone:string,
    trades: ITrade[]
}
type UserType = IUser;
const UserSchema = new Schema({
    username: {type:String, required:[true,'You need to fill a username!'], unique:true,
    //}// validate:{

    /*},,validate: {
        validator: function(v:string):any{
            return this.model('User').findOne({ username: v }).then((user:IUser) => !user)
        },
        message: props => `${props.value} is already used by another user`
    },*/
},
    firstName: {type:String, required:[true, 'You need to fill a first name!']},
    balance: {type:BalanceSchema, default:{usd:10,gbp:10}},
    timezone: {type:String, default:"London"},
    trades:{type:Array, default:[]}
 },{timestamps:true})
 
 UserSchema.path('username').validate(function(v:string){
    return model('User').findOne({ username: v }).then(user => !user)
}, "Username already taken")

export default model<IUser>('User', UserSchema)