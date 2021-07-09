import { Request, Response, NextFunction } from "express"
import { isValidObjectId, Mongoose, Document, ObjectId } from "mongoose";
import { ICoinsKeys, ITrade } from "../models/Trade";
import User, { IWallet, IUser } from '../models/User';
import AuthService from "../services/auth_service";
import Email from "../services/email-sender";

const timezones = ["Europe/London","America/Sao_Paulo", "America/New_York","Europe/Paris","Asia/Seoul","Asia/Tokyo","Africa/Johannesburg", "Europe/Moscow"]
enum errors {
    ALREADY_EXISTS = "User already exists.",
    NOT_FOUND = "Could not find user in database.",
    NOT_VERIFIED = "User is not verified. Please, check your email.",
    WRONG_USER_OR_PASSWORD = "Username or password is invalid.",
    MISSING_PASSWORD = "Please, provide a password.",
    MISSING_USERNAME = "Please, provide a username.",
    UNKNOWN_ERROR = "An unknown error occurred. Please, reauthenticate yourself.",
    PASSWORD_MISMATCH = "Entered password does not match its confirmation.",
    EMAIL_REGEX_RULE_MISMATCH = "Email not entered in the right format.",
    PASSWORD_REGEX_RULE_MISMATCH = "Password must be stronger.",
    UNKNOWN_TIMEZONE = "Entered timezone is not in the database. Please provide a valid one.",
    INVALID_TRADE = "Invalid trade detected. Please, refresh the page and try again."
}

class UserController {
    public async get(req: Request, res: Response): Promise<Response> {
        const users = await User.find()
        return res.json(users)
    }
    public async verify(req: Request, res: Response): Promise<Response | void> {
        if(req.query.test) console.info("Verification for tests.")
        if (!req.params.id || !isValidObjectId(req.params.id)) return res.json({ error: errors.NOT_FOUND }).status(404)
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.json({ error: errors.NOT_FOUND }).status(404)
        user.verified = true;
        await user.save({ validateBeforeSave: false })
        return req.query.test ? res.json(user).status(200) : res.redirect("http://localhost:3000/confirmed")
    }
    public async checkVerified(req: Request, res: Response, next: NextFunction): Promise<Response | NextFunction | void> {
        const { username } = req.query
        if (!username) return res.json({ error: errors.NOT_FOUND }).status(404)
        const user = await User.findOne({ username: username as string })
        if (!user) return res.json({ error: errors.NOT_FOUND }).status(404)
        if (!user.verified) return res.json({ error: errors.NOT_VERIFIED }).status(404)
        return next()
    }

    public async checkRegisterFields(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        req.body.testing = false;
        if (req.body.passwordConfirmation !== req.body.password) {
            return res.json({ error: [errors.PASSWORD_MISMATCH] }).status(400)
        }
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(req.body.email)) {
            return res.json({ error: [errors.EMAIL_REGEX_RULE_MISMATCH] }).status(400)
        }
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) {
            return res.json({ error: [errors.PASSWORD_REGEX_RULE_MISMATCH] }).status(400)
        }
        return next()
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        delete req.body.passwordConfirmation
        const user = await User.create(req.body).catch(function (err) {
            return ({ error: Object.keys(err.errors).map(x => (err.errors[x].message)) as string[] })
        });
        function isUser(u: IUser | object) {
            return 'username' in u;
        }
        if (req.body.testing !== true && !isUser(user)) return res.json(user)
        const { firstName, email, _id } = user as IUser
        if (req.body.testing === true) {
            console.info("Test user created successfully.") 
            return res.json(user).status(200)
        }else{
            new Email()
                .to(email)
                .subject("Email confirmation")
                .body('email-confirmation.html',
                    [
                        { from: "${firstName}", to: firstName },
                        { from: '${websiteName}', to: "Westpoint Module 1" },
                        { from: "${token}", to: _id as string },
                        { from: "${websiteUrl}", to: "http://localhost:3000" },
                        { from: "${serverUrl}", to: "http://localhost:3001" },
                        { from: "${websiteAddress}", to: "4th Floor, 100 Cannon St, London EC4N 6EU, United Kingdom" },

                    ])
                .send()
        }
        return res.json({ success: true, firstName, email })
    }

    public async update(req: Request, res: Response): Promise<Response> {
        if (req.body.firstName === "" || !req.body.firstName || req.body.timezone === "" || !req.body.timezone)
            return res.json({ error: "You cannot leave a blank field" })

        if(!timezones.includes(req.body.timezone)) return res.json({error:errors.UNKNOWN_TIMEZONE, validTimezones:timezones.join(", ")})

        const user = await User.findOneAndUpdate({ _id: req.body._id }, req.body).catch(err => ({ error: Object.keys(err.errors).map(x => (err.errors[x].message)) })).catch(x => ({ error: errors.NOT_FOUND }))

        if (!user) return res.json({ error: errors.NOT_FOUND }).status(404)
        return res.json(user).status(200)
    }

    public async mine(req: Request, res: Response): Promise<Response> {

        const queryLookup = req.query.username !== undefined ? {username:req.query.username as string} : {_id:req.query._id as string}
        console.log(queryLookup)

        const user = await User.findOne(queryLookup)
        if (!user) return res.json({ error: errors.NOT_FOUND }).status(404)

        const user_clone = (({ password, ...o }) => o)(user.toObject())// remove password

        if ('username' in req.query){
            if (!req.query.password) return res.json({ error: errors.WRONG_USER_OR_PASSWORD })
            if (!await AuthService.comparePassword(req.query.password as string, user.password))
                return res.json({ error: errors.WRONG_USER_OR_PASSWORD }).status(404)
        }
        
        return res.json(user_clone).status(200)
    }

    public async pushTrade(req: Request, res: Response): Promise<Response> {
        const { trade, _id, buy } = req.body
        if(!buy && trade.value < 0 || (buy && trade.value > 0) ) return res.json({error: errors.INVALID_TRADE})
        trade.buy = buy;
        const { from, to } = trade as ITrade
        if (!isValidObjectId(_id))
            return res.status(400).json({ error: errors.UNKNOWN_ERROR });
        
        const user = await User.findOne({ _id: _id });
        if (!user) return res.status(404).json({ error: errors.NOT_FOUND });

        user.wallet[to] += trade.value;
        user.wallet[from] += buy ? 1 : -1;

        user.trades.push({ ...trade, when: new Date().getTime() });

        const err = user.validateSync();
        if (err)
            return res.json({
                error: err.message.split(": ")
                    .slice(-1)[0]
            }).status(400);

        await user.save({ validateBeforeSave: false })
        return res.json(user).status(200);

    }

    public async addMoney(req: Request, res: Response): Promise<Response> {
        const { name, username, amount, coin, password } = req.body
        const user = await User.findOne({ username: username })
        if (!user) return res.status(404).json({ error: errors.NOT_FOUND });
        if (!await AuthService.comparePassword(password as string, user.password))
            return res.json({ error: errors.WRONG_USER_OR_PASSWORD }).status(404)
        const currency = coin as ICoinsKeys
        user.wallet[currency] += parseFloat(amount)
        user.purchases.push({ amount: parseFloat(amount) || 0, currency: currency, when: new Date().getTime() })
        await user.save({ validateBeforeSave: false })
        return res.json(user).status(200)
    }

    public async remove(req: Request, res: Response): Promise<Response> {
        const { username, password } = req.body
        const user = await User.findOne({ username: username })
        if (!user) return res.status(404).json({ error: errors.NOT_FOUND });
        if (!await AuthService.comparePassword(password as string, user.password))
            return res.json({ error: errors.WRONG_USER_OR_PASSWORD }).status(404)
        await user.remove()
        console.log("User removed successfully.")
        return res.json({ success: true }).status(200)
    }

}
export default new UserController()