import {Router,Request,Response} from  'express';
import User from '../models/User';
import jwt from "jsonwebtoken";
import { secret } from "../global/enviroment";
import { verifyToken } from "../token/verifyToken";

export const router=Router();

router.post('/login',async (req:Request,resp:Response)=>{
    
    //1° We are going to compare if the params in te request
    //Are different of undefined
    if(req.body.email == undefined || req.body.password == undefined){
        return resp.status(404).json({msg:"Some of the parameters is undefined"});                                        
    }

    // Receiving Data    
    const user = await User.findOne({ email: req.body.email });
    
    
    console.log(req.body);
    
    if (!user) {        
        return resp.status(404).json({msg:"The email doesn't exists"});
    }
    
    if(req.body.password == undefined || user.password==undefined){
        return resp.status(404).json({msg:"Some of the parameters when comparing the password is undefined"});                                        
    }    
        
    const validPassword = await user.comparePassword(
        req.body.password,
        user.password
    );
    
    if (!validPassword) {
        return resp.status(401).json({ auth: false, token: null, msg: "The password is not correct"});
    }

    const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
    });
  
    resp.json({ auth: true, token });           
});

//User creation
router.post('/registerUser',verifyToken,async (req:Request,resp:Response)=>{    
    
    // Receiving Data
    const { name, email, phone, password,age,gender,hobby,created_at } = req.body;

    const user = new User({
        name,
        email,
        phone,
        password,        
        age,
        gender,
        hobby,
        created_at
    });
    
    //Encrypt the user's password
    if(user.password!=undefined && user.password!=null){
        user.password = await user.encryptPassword(user.password);    
        user.save((err:any,document:any)=>{
            if(err){            
                resp.status(422).json({data:"Validation parameters were not satisfied:  "+err.message});
            }else{            
                resp.json({ user });
            }
        });
    }else{
        resp.status(422).json({data:"Validation parameters were not satisfied: Password is required"});
    }
    
});

router.post('/registerGenericUser',async (req:Request,resp:Response)=>{    
    
    const user = new User({
        name:"Roberto Perez",
        email:"r.perez@gmail.com",
        phone:"2221231245",
        password:"123456",
        age:23,
        gender:"male",
        hobby:"play piano"        
    });

    const searchedUser = await User.findOne({ email: user.email });
    if (searchedUser) {
        return resp.status(200).json({data: "The user exists",created:false});
    }
    
    //Encrypt the user's password
    user.password = await user.encryptPassword(user.password);
    
    user.save((err:any,document:any)=>{
        if(err){            
            resp.status(404).json({data:"Validation parameters were not satisfied: "+err.message});
        }else{            
            resp.status(200).json({ user, created:true });
        }
    });
});

//Searches
router.get('/getUsers',verifyToken,async (req:any,resp:Response)=>{
    
    // Receiving Data        
    const users = await User.find().select('id name email phone age gender hobby');    
    resp.status(200).json(users);        
});

router.get('/getFilteredUsers/:name/:hobby',verifyToken,async (req:any,resp:Response)=>{    
    // Receiving Data        
    const name=req.params.name;
    const hobby=req.params.hobby;
    
    var regexpName = new RegExp(name,"i");
    var regexpHobby = new RegExp(hobby,"i");

    //Nos falta validar los espacios en blanco
    const users = await User.find({$or:[{name:regexpName},{hobby:regexpHobby}]}).select('id name email phone age gender hobby');    
    resp.status(200).json(users);        
});

//Delete user
router.delete('/deleteUser/:id',verifyToken,async (req:any,resp:Response)=>{    
    // Receiving Data        
    const id=req.params.id;        
    const user = await User.findByIdAndDelete(id);    
    resp.status(200).json(user);        
});

//Grouping Search
router.get('/getUsersGrouping',verifyToken,async (req:any,resp:Response)=>{    
    // Receiving Data              
    var todayDate=new Date();
    var breakDownDate=(todayDate.getMonth() + 1) + '/' + (todayDate.getDate()-3) + '/' + todayDate.getFullYear();    
    var searchDate=new Date(breakDownDate);    

    
    //const users = await User.find({age: { $gte: 18 },gender:"female",created_at:{$gte: searchDate}}).select('name phone hobby created_at');                    
    const users = await User.aggregate([
        { $match: { age: { $gte: 18 }, gender:"female", created_at:{$gte: searchDate}} },

        {
          $group: {
            // Each `_id` must be unique, so if there are multiple            
            _id: '$hobby',                  
            name: { "$first": "$name" },  
            phone: { "$first": "$phone" },
            count: { $sum: 1 }            
          }
        }
    ]);

    resp.status(200).json(users);        
});

export default router;