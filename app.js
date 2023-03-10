require('dotenv').config();
require('./config/database').connect();

const config = process.env;
const cors = require('cors')
const express = require ('express');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors())
app.use(express.json());

app.post('/register',async(req,res)=>{
    try{
        const{first_name,last_name,email,password}=req.body;
        if(!(email&&password&&first_name&&last_name)){res.status(410).send('all input is required')}
        const olduser = await User.findOne({email})
        if (olduser){return res.status(401).send('Emailนี้สมัครแล้ว ')}
        encryptedPassword = await bcrypt.hash(password,10);
        const user = await User.create({first_name,last_name,email:email.toLowerCase(),password:encryptedPassword})
        const token = jwt.sign({user_id:user._id,email},process.env.TOKEN_KEY,{expiresIn:'2h'})
        user.token = token;
        res.status(201).json(user);
    }
    catch(error){console.log(error)}
})

app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!(email&&password)){res.status(300).send('All input is required')}
        const user = await User.findOne({email})
        if (user&&(await bcrypt.compare(password,user.password)))
        { const token = jwt.sign({user_id:user._id,email},process.env.TOKEN_KEY,{expiresIn:"2h"})
        user.token=token;
        return res.status(200).json(user)}
        res.status(400).send('invalid credentials😵‍💫😵‍💫😵‍💫😵‍💫')
    }
    catch(error){console.log(error)}
})

app.post('/Auth',(req,res,next)=>{
   
    try{  
        const token = req.headers['id_token']
        const decoded = jwt.verify(token,config.TOKEN_KEY) 
        res.json({status:'ok',decoded});
    }
    catch(error){ 
        res.json({status:'error',message:error.message});
    }
     next()
})

app.get('/user',async(req,res)=>{

    try{
        const user = await User.find({}).select("-password").exec();
        res.send(user);
    }
    catch{
        console.log(err);
    res.status(500).send("Server Error!");
    }
})

app.get('/user/:id',async(req,res)=>{

    try{
        const id = req.params.id;
        const user = await User.findOne({_id: id}).select("-password").exec();
        res.send(user);
    }
    catch{
        console.log(err);
    res.status(500).send("Server Error!");
    }
})

app.delete('/user/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await User.findOneAndDelete({ _id: id });
        res.send(user);
      } 
      catch (err) {
        console.log(err);
        res.status(500).send("Server Error!");
      }
})

app.put('/user/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const{first_name,last_name,email,password}=req.body;
        encryptedPassword = await bcrypt.hash(password,10);
        const user = await User.findOneAndUpdate(
            { _id: id },
            {first_name,last_name,email:email.toLowerCase(),password:encryptedPassword});
        res.send(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Server Error!");
      }
})

module.exports = app;