const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check,validationResult} = require('express-validator');
const req = require('express/lib/request');
const res = require('express/lib/response');

//@route GET api/profile/me
//@desc  get user profile
//@access Private

router.get('/me', auth ,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg: "There is no profile for the user"});
        }
        res.json(profile);
    }
    catch(err){
        console.error(error.message);
        res.send(500).send('Server error');
    }
});

//@route POST api/profile
//@desc  Create update profile
//@access Private

router.post('/',[
        auth,
        [
            check('status','Status is required').not().isEmpty(),
            check('skills','skills req.').not().isEmpty(),
        ]
    ],
    async(req,res)=>{
        const err = validationResult(req);
        if(!err){
            res.status(400).json({errors: err.array()});
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube, 
            facebook,
            twitter,
            instagram,
            linkedin, 
        } = req.body;
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills){
            profileFields.skills = skills.split(',').map(skill=>skill.trim());
        }
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedin) profileFields.social.linkedin = linkedin;

        try{
            let profile = await Profile.findOne({user: req.user.id});
            if(profile){
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true},
                );
                return res.json(profile);
            }
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        }
        catch(err){
            console.error(err.message);
            res.status(500).send("Server error");
        }

    }
);

//@route GET api/profile
//@desc  get all profile
//@access Public

router.get('/',async(req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route GET api/profile/user/:user_id
//@desc  get profile by userid
//@access Public

router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: 'Profile not found'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == "ObjectId"){
            return res.status(400).send('Profile not found');
        }
        res.status(500).send("Server error");
    }
});

//@route DELETE api/profile
//@desc  DELETE profile
//@access Private

router.delete('/',auth,async(req,res)=>{
    try {
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});s
        res.json({msg:"User removed"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//@route PUT api/profile/experience
//@desc  Update profile experience
//@access Private

router.put('/experience',[
        auth,
        [
            check('title','Title is req.').not().isEmpty(),
            check('company','Company is req.').not().isEmpty(),
            check('from','From date is req.').not().isEmpty(),
        ]
    ],async (req,res)=>{
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()});
        }
        const{
            title,
            company,
            location,
            from, 
            to,
            current,
            description,
        } = req.body

        const newExp = {
            title,
            company,
            location,
            from, 
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user: req.user.id});
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

//@route DELETE api/profile/experience/:exp_id
//@desc  DELETE profile experience
//@access Private

router.delete('/experience/:exp_id',auth,async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        //get index remove
        const removeIndex = profile.experience.map(item=> item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;