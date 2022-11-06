const mongoose = require('mongoose');
require('dotenv').config();

const {MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env;
const MONGO_URL = `mongodb+srv://adminis:123890qweiop@cluster0.ybsprdy.mongodb.net/test`;
const connect = ()=>{
    mongoose.connect(
        MONGO_URL
        , {dbName : 'Agario-Test', }
        , (error)=>{
            if(error){
                console.log(MONGO_URL+'몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공');
            }
        }
    );
};

mongoose.connection.on('error', (error)=>{
    console.error('몽고디비 에러');
});

mongoose.connection.on('disconnected', ()=>{
    console.log('몽고 디비 disconnected. 재연결 try');
    connect();
});

module.exports = connect;