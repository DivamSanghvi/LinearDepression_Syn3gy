const mongoose= require('mongoose')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')

const UserSchema= new mongoose.Schema({
name:{
    type: String,
    required: [true, "Please Enter Your Name"],
    minLength: 2,
    maxLength: 20
},
email: {
    type: String,
    required:[true, "Please Enter Valid Email"],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,  "Please Enter Valid Email"],
    unique: true
},
password:{
    type: String,
    required: [true, "Please Enter a password"],
    minLength: 6,
}
})

UserSchema.pre('save', async function(){
    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id, name: this.name },
      'thisismyrandomsecret',
      { expiresIn: process.env.JWT_LIFETIME }
    );
  };

UserSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports= mongoose.model('User', UserSchema)