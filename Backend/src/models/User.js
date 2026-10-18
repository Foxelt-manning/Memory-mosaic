import mongoose from 'mongoose'
import bycrpt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        name: {
         type: String,
         required: [true, "Name is required"],
         trim: true,
         maxlength: [120,"Name cannot exceed 120 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false, // Exclude password from query results by default
        },
        avatarUrl:{
            type: String,
            required: [false, "Avatar URL is required"],
            trim: true,
        }
    },{
        timestamps: true
    }
);

userSchema.pre('save',async function (){
    if (!this.isModified('password')) return;
    
    this.password =await bycrpt.hash(this.password,12);
});

userSchema.methods.comparePassword = async function (enteredPassword){
    return bycrpt.compare(enteredPassword,this.password);
};

const User =mongoose.model('User',userSchema);

export default User;