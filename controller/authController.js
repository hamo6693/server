const bcrypt= require("bcrypt");
const User = require("../models/user");
const jwtHelpers = require("../utilits/jwtHelpers");
const jsonwebtoken = require("jsonwebtoken");

const mongoose = require("mongoose")


const Image = require("../models/img");


exports.register = async(req, res) => {
    const {name,email,password,confPassword} = req.body;
    try{
        const user = await User({
            name,
            email,
            password:bcrypt.hashSync(password,8),
            confPassword:bcrypt.hashSync(password,8),
        })
        await user.save()
        res.status(200).json({message:"ok"})
    }catch(e){
            res.status(500).json({
                message:"wrong"
            })
        }

}


exports.login = async(req,res) => {
    const{email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message:"البريد خطا"
            })
        } 
        const authSuccess = await bcrypt.compare(password,user.password)
        if(authSuccess) {
            const token = jsonwebtoken.sign({id:user.id,name:user.name,email:user.email},process.env.JWT_SECRET)
            res.status(200).json({
                id:user.id,
                //name:user.name,
                accessToken:token
            })
        }else{
            console.log("wrong");
        }
    }catch(e){
        res.status(500)
    }
}

exports.sendImages = async(req,res) => {
    const {base64} = req.body;
    try {
        
      await Image.create({ image: base64 });
      res.json({ status: "تم ارسال الصورة" });
    } catch (error) {
      res.json({ status: "error",data:error })
    }
}

exports.getImages = async(req,res) => {
    
    try {
      await Image.find({}).then(data => {
        res.send({status:"suess",data:data})
      })
    } catch (error) {
      res.json({ status: "error",data:error });
    }
}

exports.find = async(req,res) => {
    const {id} = req.params
    const image = await Image.findById(id)
    if(!image) return res.status(404).send()
    res.json({success:true,data:image})
}


    
