import bcrypt from 'bcrypt'
const SALT = 10


export default class AuthService{
    public static async hashPassword(password:string, salt=SALT):Promise<string>{
        return await bcrypt.hash(password,salt)
    }
    public static async comparePassword(password:string|undefined,hashedPassword:string):Promise<boolean>{
        if(!password) return false
        return await bcrypt.compare(password, hashedPassword);
    }
}