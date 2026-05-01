import bcrypt from "bcryptjs";
import mongoose from "mongoose";

interface IUser{
    username:string,
    email:string,
    password:string
}

const userSchema= new mongoose.Schema<IUser>({
    username:{
        type:String,
        required:[true,"username required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"email required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password required"],
    }
},{
    timestamps:true,
})

userSchema.pre("save", async function () {
  
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});


const User= mongoose.models?.User || mongoose.model<IUser>("User",userSchema)
export default User;