const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');

//@route GET api/auth
//@desc  Test route
//@access Public

router.get('/',auth, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        return res.status(500).send('server error');
    }
});   

//Login post api/user

router.post('/', [
    check('email','Valid email').isEmail(),
    check('password','Password req').exists()
] ,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:[{msg:"Invalid credò"}]});
        }
        
        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"Invalid cred1"}]});
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn : 36000},
            (err,token) => {
                if(err) throw err;
                res.json({token});
            }
            );
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;