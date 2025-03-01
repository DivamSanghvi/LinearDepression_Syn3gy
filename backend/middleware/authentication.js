// if the person has a token thats valid then we will let them enter otherwise no. so we will throw unauthroized error if token does not exist and we will use next() if it does.

const {UnauthenticatedError} = require('../errors')
const jwt= require('jsonwebtoken')

const authentication=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    // console.log(req.headers)
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('authentication Invalid bale')
    }
   
    const token = authHeader.split(' ')[1];
try{
    const payload=jwt.verify(token, 'thisismyrandomsecret');
    // ATTACHING USER TO THE REQUEST OBJ
    req.user={userId: payload.userId, name: payload.name};
    next();
}catch(error){
    throw new UnauthenticatedError("token is invalid")
}

}

module.exports=authentication