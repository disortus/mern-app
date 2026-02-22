import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";
import userModel from "./models/user.js";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/blog').then(() => {
    console.log("Mongodb database successfuly started")
}).catch((err) => {
    console.log(`Mongodb database failed with error: ${err}`)
})

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Home page");
})

app.post('/auth/register', registerValidator, async (req, res) => {
    try{
            const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array);
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
        email: req.body.email,
        fullname: req.body.fullname,
        passwordHash: hash
    })

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
        fullname: user.fullname
    }, "secret1234", {
        expiresIn: '30d'
    })

    const {passwordHash, ...userData} = user._doc;

    res.json({...userData, token});
    }
    catch (err) {
        console.log(err);
        res.json({
            message: "failed to register"
        });
    }
})



app.listen(port, (err) => {
    if (err){
        console.log(err);
    }

    console.log(`Server started at http://localhost:${port}`);
})