const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    userid : Number,
    username : String,
    score : {
        type:Number,
        require : true,
    },
    joinAt : {
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);