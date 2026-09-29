import express from 'express'
import ip from 'ip'

const app = express();
const PORT = 3000;

let mapping = {}

const TTL = 10_000
const attempts = 5

app.use('/limitter',(req,res,next)=>{
    const myIp = req.socket.remoteAddress;
    // const myIp = ip.address();
    console.log(myIp);

    if(mapping[myIp] === 1){
        setTimeout(()=>{
            // delete mapping[myIp]
            delete mapping[myIp];
            console.log("running")
    },TTL);
    }

    if(attempts <= mapping[myIp]){
        return res.status(429).json({
            error:"too many requests"
        })
    }

    mapping[myIp] = mapping[myIp]+1 || 1;
    console.log(mapping[myIp])

    res.json({
        message:"ok request received"
    })
    next();
})


app.listen(PORT,()=>{
    console.log(`app is running in ${PORT}`)
})