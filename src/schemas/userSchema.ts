import {z} from 'zod'
import { Document } from 'mongoose';
const userSchema = z.object({
    name:z.string(),
    email:z.string().email({ message: "Invalid email address" }),
    password:z.string().min(6,{ message: "Must be 6 or more characters long" }).max(20,{message:'Max password size is 20'}),
    role:z.enum(['admin','user'])
})
interface user extends Document {
    name:string;
    email:string;
    password:string;
    role:string;
}
export {user}
export default userSchema