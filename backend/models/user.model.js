import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
    location: { // New field added
        type: String,
        required: true, // Adjust based on your requirement
        default: "Not specified" // Provide a default if necessary
    },
    jobType:{
        type: String,
    },
    SavedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job', // Reference the Job model
        },
    ],
},{timestamps:true});
export const User = mongoose.model('User', userSchema);