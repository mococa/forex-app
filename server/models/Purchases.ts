import { model, Schema } from "mongoose";
import { ICoins, ICoinsKeyFields, ICoinsKeys } from "./Trade";


export interface IPurchase {
    currency: ICoinsKeys,//'USD' | 'GBP',
    amount: number,
    when:number
}
const PurchaseSchema = new Schema({
    currency:{type:String},
    amount:{type:Number},
    when: { type: Number, default: new Date().getTime() },
}, { timestamps: false })

PurchaseSchema.path('currency').validate(function (currency: ICoins) {
    return currency in ICoins
}, "Invalid currency." )
PurchaseSchema.path('amount').validate(function (amount: number) {
    return amount > 0 || amount === NaN
}, "Invalid amount of money." )

export default PurchaseSchema