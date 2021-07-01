import { model, Schema } from "mongoose";

export interface ITrade{
    from:string,
    to:string,
    when:string,
    value:number
}
const TradeSchema = new Schema({
    from: {type:String, required:true},
    to: {type:String, required:true},
    value: {type:Number, default:0},
    when: {type:String, default:new Date().toISOString()},
})
export default model<ITrade>('Trade', TradeSchema)