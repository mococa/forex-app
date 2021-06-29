import { model, Schema } from "mongoose";

export interface ITrade extends Document{
    from:string,
    to:string,
    when:string,
    profit:number
}
const TradeSchema = new Schema({
    from: {type:String, required:true},
    to: {type:String, required:true},
    profit: {type:Number, default:0},
    when: {type:String, default:new Date().toISOString()},
})
export default model<ITrade>('Trade', TradeSchema)