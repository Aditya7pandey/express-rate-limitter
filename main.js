import express from 'express'
import redis from './redis-connect.js';
import ip from 'ip'

const app = express();
const PORT = 3000;

const MAX_ALLOWED = 5;
const MAX_TIME = 10;

app.use('/',async (req,res,next)=>{
    const myIp = ip.address();

    const request = await redis.incr(myIp);

    if(request === 1){
        await redis.expire(myIp,MAX_TIME);
    }

    if(request > MAX_ALLOWED){
        return res.status(429).json({
            message:"too many req"
        })
    }

    res.json({
        message:"ok req"
    })
    next();
})

app.listen(PORT,()=>{
    console.log(`app is running in ${PORT}`)
})