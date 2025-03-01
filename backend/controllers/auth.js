const User=require('../models/User')
const {BadRequestError, UnauthenticatedError}=require('../errors')
const {StatusCodes}=require('http-status-codes')



const register=async (req,res)=>{
    const user= await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user:{userId: user._id, name: user.name, role: user.role}, token: user.createJWT()})
}


const login=async (req,res)=>{
    const {email,password, role}= req.body
    if(!email || !password || !role) throw new BadRequestError("Please enter email, password and role")

    const user=await User.findOne({email: email})
    if(!user) throw new UnauthenticatedError("Invalid Email, user not found")

    if(role!=user.role){
        throw new UnauthenticatedError("You are not authorized to enter for this role")
    }
    
    const isCorrectPassword= await user.comparePassword(password);
    if(!isCorrectPassword) throw new  UnauthenticatedError("Incorrect Password")

        res.status(StatusCodes.OK).json({user:{userId: user._id, name: user.name,role: user.role}, token: user.createJWT()})
}


module.exports={
    login,
    register
}