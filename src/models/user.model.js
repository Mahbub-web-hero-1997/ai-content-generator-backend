import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true
    },
    confirmPassword:{
        type:String,
        required:[true, "Please confirm your password"],
        validate:{
            validator:function(value){
                return value === this.password;
            },
            message:"Password and confirm password do not match"
        },       
    },
    avatar:{
        type:String,
        default:"https://res.cloudinary.com/dz1qj3x8h/image/upload/v1698231234/avatar/avatar-default.png",
        trim:true
    },
    role:{
        type:String,
        default:"user",
        enum:["user", "admin"]
    },
credits:{
type:Number,
default:0,
},
subscriptionPlan:{
    type:String,
    enum:["free", "basic", "pro", "enterprise"],  
    default:"free"
},
subscriptionExpiry:{
type:Date,
default:null
},
resetPasswordToken: String,
resetPasswordExpires: Date,
createdAt:{
    type:Date,
    default:Date.now
},
updatedAt:{
    type:Date,
    default:Date.now
},
refreshToken:{
    type:String,
    default:null
}
},{
    timestamps:true
})
// Hash password before saving user
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10);
    // Remove confirmPassword field
    this.confirmPassword=undefined;
    next();
});
// Check password is correct
const bcrypt=require("bcryptjs");
userSchema.methods.confirmPassword=async function(password){
    return await bcrypt.compare(password, this.password);
}
// Generate Access Token
userSchema.methods.generateAccessToken=async function(){
    const token=jwt.sign(
        {_id:this._id, role:this.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRE}
    )
    return token;
}
// Generate Refresh Token
userSchema.methods.generateRefreshToken=async function(){
    const token=jwt.sign(
        {_id:this._id, role:this.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRE}        
    )
    return token;
}
export const User=mongoose.model("User", userSchema);
