import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";


const saltRounds=10;

export async function registerUser(req,res){
   
    const {username,password}=req.body;
    try{
        const user=await pool.query(
            "SELECT * FROM users WHERE username=$1",[username]
        );

       if(user.rows.length>0){
           return res.status(400).json({message:"User Already exist"});
       } 
       const hashedpassword=await bcrypt.hash(password,saltRounds);
            await pool.query(
                "INSERT INTO users (username,password) VALUES ($1,$2)",[username,hashedpassword]
            );

            res.json({message:"User Registered Successfully"});
       
    }catch(err){
        console.error("Unable to Register",err);
        res.status(500).json({message:"Service Error During Registration"})
    }
    
} 

export async function loginUser(req,res){
   
    const {username,password}=req.body;
    try{
        const userResult=await pool.query(
            "SELECT * FROM users WHERE username=$1",[username]
        );
        
      const user=userResult.rows[0];
      
       if(!user){
            res.status(400).json({message:"Incorrect Username or Password"});
       } 
       const isMatch=await bcrypt.compare(password,user.password);
       if(!isMatch){
         res.status(401).json({message:"Incorrect Username or Password"});
       }
           const token= jwt.sign({id:user.id,username:user.username,is_admin: user.is_admin},process.env.JWT_SECRET,{expiresIn:"1h"})
           

            res.json({token});
       
    }catch(err){
        console.error("Unable to Login",err);
        res.status(500).json({message:"Service Error During Login"});
    }
    
} 




