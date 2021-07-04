import { model, Schema } from "mongoose";


export interface IAPITrade {
    symbol: string;
    ts: string;
    bid: number;
    ask: number;
    mid: number;
    time?: string;
}
export enum ICoins{
    'USD',
    'GBP'
}
export type ICoinsKeys = keyof typeof ICoins;
type ICoinsKeyFields = {[key in ICoinsKeys]:boolean}
//https://stackoverflow.com/questions/39701524/using-enum-as-interface-key-in-typescript saved me

export interface ITrade extends ICoinsKeyFields {
    from: ICoinsKeys,//'USD' | 'GBP',
    to: ICoinsKeys,//'USD' | 'GBP',
    when: string,
    value: number,
    buy: boolean,
    tradeAtTime?: IAPITrade,

}
const TradeSchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    value: { type: Number, default: 0 },
    when: { type: String, default: new Date().toISOString() },
    buy:{type: Boolean, required:true},
    tradeAtTime:{ type:Object, required: false },
}, { timestamps: false })

TradeSchema.path('from').validate(function (f: ICoins) {
    return f in ICoins
}, "Invalid currency." )

TradeSchema.path('to').validate(function (f: ICoins) {
    return f in ICoins
}, "Invalid currency." )
export default TradeSchema