import { model, Schema } from "mongoose";
import Trade from "./Trade";

interface ITrade extends Document{
    from:string,
    to:string,
    when:string,
    profit:number
}

export interface IUser extends Document{
    firstName:string,
    balance?:number,
    timezone:string,
    trades?: Array<ITrade>
}
const UserSchema = new Schema({
    username: {type:String, required:[true,'You need to fill a username!'], unique:true,validate: {
        validator: function(v:any){
            return this.model('User').findOne({ username: v }).then(user => !user)
        },
        message: props => `${props.value} is already used by another user`
    },
},
    firstName: {type:String, required:[true, 'You need to fill a first name!']},
    balance: {type:Number, default:10},
    timezone: {type:String, default:"London"},
    trades:{type:Array, default:[]}
},{timestamps:true})
export default model<IUser>('User', UserSchema)