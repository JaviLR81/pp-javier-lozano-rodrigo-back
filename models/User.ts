//Este modelo será el modelado de los datos de mongo db
import bcrypt from "bcryptjs";
const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema = new Schema(
    {      
        name: {
            type:String,            
            required: [true, 'Name is required'],
            validate: {
                validator: function(v:any) {                    
                    return /^[a-zA-Z\s]*$/.test(v);
                },
                message: (props:any) => `${props.value} Name is not valid!`
            }
        },
        email: {
            type:String,
            unique:true,
            required: [true, 'Email is required'],
            validate: {
                validator: function(v:any) {                    
                    return /^[^\s@]+@[^\s@]+$/.test(v);
                },
                message: (props:any) => `${props.value} Email is not valid!`
            }
        },
        phone:{
            type: String,
            validate: {
                validator: function(v:any) {
                    //return /\d{3}-\d{3}-\d{4}/.test(v);
                    return /^\d{10}$/.test(v);
                },
                message: (props:any) => `${props.value} is not a valid phone number!`
            },
            required: [true, 'Phone number required']
        },
        password:{
            type: String,            
            required: [true, 'Password is required']
        },
        age:{
            type: Number,            
            required: [true, 'Age is required'],
            min:1,
            max:100
        },
        gender:{
            type:String,            
            required: [true, 'Gender is required'],
            validate: {
                validator: function(v:any) {                    
                    return /^[a-zA-Z\s]*$/.test(v);
                },
                message: (props:any) => `${props.value} Gender is not valid!`
            }
        },        
        hobby: {
            type:String,            
            required: [true, 'Hobby is required'],
            validate: {
                validator: function(v:any) {                    
                    return /^[a-zA-Z\s]*$/.test(v);
                },
                message: (props:any) => `${props.value} Gender is not valid!`
            }
        },
        created_at:{
            type: Date,
            default: new Date()
        }            
    }    
);

userSchema.methods.encryptPassword = async (password:any) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function (password:any) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);