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