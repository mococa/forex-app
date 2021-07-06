import nodemailer from "nodemailer"
import * as fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.googleEmail,
        pass: process.env.googlePassword
    }
});
async function sendEmail(to:string|string[], subject:string, body:string) {
  //DO NOT FORGET TO ALLOW THE USAGE: https://accounts.google.com/DisplayUnlockCaptcha
  //AND ALSO https://myaccount.google.com/lesssecureapps
    const mailOptions = {
        from: process.env.googleEmail, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: body// plain text body
    };
    if (body) {
        var promise = new Promise((resolve,reject)=>{
            return transporter.sendMail(mailOptions, (err, info) => {
                if (err) {console.log(err);return resolve(err)}
                console.log("Email(s) sent.")
                return resolve({
                    id: info.messageId,
                })
            })
        })
        return promise.then(x=>x)
        
    }
    return "Error. Email without body.";
}
export interface IPattern{
    from:string,
    to:string
}
export default class Email{
    _subject:string = "";
    _body:string = "";
    _to:string|Array<string> = "";

    to(emailAddress:string|Array<string>){
        this._to = emailAddress
        return this
    }
    subject(subject:string){
        this._subject = subject;
        return this
    }
    body(htmlFileName:string, patterns:Array<IPattern>){
        var tempBody = fs.readFileSync(process.cwd()+'/server/emails/'+htmlFileName, { encoding: 'utf-8' })
        for (const pattern of patterns) {
            tempBody = tempBody.split(pattern.from).join(pattern.to)
        }
        this._body = tempBody
        return this
    }
    async send(){
        return await sendEmail(this._to, this._subject, this._body)
    }
}