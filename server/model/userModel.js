const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phone: {type: String, required: true, unique: true},
    name: {type: String, required: false},
    activated: {type: Boolean, required: false, default: false},
    avater: {type: String, required: false, set: (avater)=> {
        if(avater){
            return `${process.env.BASE_URL}${avater}`
        }
    }}

},{
    timestamps: true, 
    toJSON: {getters: true}
})


const User = new mongoose.model('User', UserSchema, 'users');

module.exports = User;