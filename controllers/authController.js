import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address,answer } = req.body
        //validation
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone is required' });
        }
        if (!address) {
            return res.send({ message: 'Address is required' });
        }
        if (!answer) {
            return res.send({ message: 'Answer is required' });
        }

        //existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already registered please login',
            })
        }
        const hashesdPassword = await hashPassword(password);
        //save
        const user = await new userModel({ name, email, password: hashesdPassword, phone, address,answer}).save();

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error in registration',
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "invalid email and password"
            });
        }
        //email match
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "email not registered"
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "invalid username or password"
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user :{
                name:user.name,
                email:user.email,
                password:user.password,
                phone: user.phone,
                address:user.address,
                answer: user.answer,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error in login',
            error
        })
    }

};

// export password controller

export const forgotPasswordController = async()=>{
    try {
        const{email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({
                message:"Email is required"
            })
        }
        if(!answer){
            res.status(400).send({
                message:"Answer is required"
            })
        }
        if(!newPassword){
            res.status(400).send({
                message:"New Password is required"
            })
        }
        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'wrong email or password'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password reset Successfully",  
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })
    }
}

//test controller
export const testController=(req,res)=>{
    res.send("protected route");
}
