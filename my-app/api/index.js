const express=require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app=express();
const port=8000;
const cors =require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const jwt=require('jsonwebtoken');

mongoose.connect('mongodb+srv://E-commerceReact-NativeProject:E-commerceReact-NativeProject@cluster0.ndttazh.mongodb.net/').then(()=>{
    console.log("Mongodb is connected");
}).catch((error)=>{
    console.log("Mongodb is not connected ",error);
})

app.listen(port,()=>{
    console.log("App is running at ",port);
})

// Register End Point
const User=require('./models/user');
const Order=require('./models/order');

const sendVerificationEmail=async (email,verificationToken)=>{
    // create a Nodemailer Transporter

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"shoaibakhter181422@gmail.com",
            pass:"zqbc kaaf lvjm ryou",
        },
    });

    // write email message 
    const mailOptions={
        from: "Shoaib.com",
        to:email,
        subject:"Email Verification",
        text:`Please click the following link to verify your email : http://localhost:8000`
    }

    // send Mail
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.log("Error sending Verification email: ",error);
    }
}

app.post('/register',async()=>{
    try {
        const {name,email,password} = req.body;

        // check if email is already registered
        const existingUser=await User.findOne({email});
        if(existingUser){
            console.log("Email already registered: ", email);
            return res.status(400).json({message:"Email already registered"})
        }

        // Create a new user
        const newUser=await User({name,email,password});

        // Generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");
        
        // save the user to the database
        await newUser.save();

        // Debugging Statement to verify data
        console.log("New User Created: ",newUser);

        // save verification email to the user
        // Email Service for sending verification

        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({
            message:"Registration Successful: Please check your email for verification"
        })
    } catch (error) {
        console.log("Error during register: ",error);
        res.status(500).json({message:"Registration Failed"});
    }
});

app.get("/verify/:token",async (req,res)=>{
    try {
        const token = req.params.token;
        // Find the user with the given token from the database

        const user=await User.findOne({verificationToken:token});
        if(!user){
            return res.status(404).json({message:"Invalid Verification token"});
        }

        // Mark user as verified
        user.verified=true;
        user.verificationToken=undefined;

        await user.save();
        
        res.status(200).json({message:"Email Verification Failed"});
    } catch (error) {
        res.status(500).json({message:"Email Verification Failed"});
    }
})