const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Corrected path for user model
const Order =require('./models/order')

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotEnv.config({
    path: 'config/config.env'
});

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Mongodb is connected");
}).catch((error) => {
    console.log("Mongodb is not connected ", error);
});

app.listen(port, () => {
    console.log("App is running at ", port);
});

// Register End Point
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "shoaibakhter181422@gmail.com",
            pass: "empz nlin zcto yaio",
        },
    });

    const mailOptions = {
        from: "Shoaib.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email : http://192.168.0.18:8000/verify/${verificationToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.log("Error sending Verification email: ", error);
    }
};

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered: ", email);
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({ name, email, password });

        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        await newUser.save();

        console.log("New User Created: ", newUser);

        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({
            message: "Registration Successful: Please check your email for verification"
        });
    } catch (error) {
        console.log("Error during register: ", error);
        res.status(500).json({ message: "Registration Failed" });
    }
});

app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Invalid Verification token" });
        }

        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: "Email Verification Successful" });
    } catch (error) {
        res.status(500).json({ message: "Email Verification Failed" });
    }
});

const generateSecret = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecret();

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login Failed" });
    }
});

app.post("/addresses", async (req, res) => {
    try {
        const { userId, address } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        user.addresses.push(address);
        await user.save();
        res.status(200).json({ message: "Address created Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Adding Address" });
    }
});

app.get('/addresses/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const addresses = user.addresses;
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ message: "Error Getting Addresses of User" });
    }
});

// Middleware to verify token and extract user ID
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Route to get user info
app.get('/user/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.sendStatus(404);
        res.json({ userId: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Endpoint to fetch user data by email
app.get('/user/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  //endpoint to store all the orders
app.post("/orders", async (req, res) => {
    try {
      const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
        req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      //create an array of product objects from the cart Items
      const products = cartItems.map((item) => ({
        name: item?.title,
        quantity: item.quantity,
        price: item.price,
        image: item?.image,
      }));
  
      //create a new Order
      const order = new Order({
        user: userId,
        products: products,
        totalPrice: totalPrice,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      });
  
      await order.save();
  
      res.status(200).json({ message: "Order created successfully!" });
    } catch (error) {
      console.log("error creating orders", error);
      res.status(500).json({ message: "Error creating orders" });
    }
  });
  
  //get the user profile
  app.get("/profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving the user profile" });
    }
  });
  
  app.get("/orders/:userId",async(req,res) => {
    try{
      const userId = req.params.userId;
  
      const orders = await Order.find({user:userId}).populate("user");
  
      if(!orders || orders.length === 0){
        return res.status(404).json({message:"No orders found for this user"})
      }
  
      res.status(200).json({ orders });
    } catch(error){
      res.status(500).json({ message: "Error"});
    }
  })

module.exports = app;
