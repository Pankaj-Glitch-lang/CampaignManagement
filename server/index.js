
const express=require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const cron=require('node-cron')
const cors = require('cors');
const CampaignRouter = require('./router/campaign.router');
const AdminRouter = require('./router/admin.router');
dotenv.config()
const app=express()
const uri=process.env.mongodb_uri
const PORT=process.env.PORT
app.use(express.json())
app.use(cors())
const atlasDb= ()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));

}

app.post('/task',(req,res)=>{

    const {name,description,recipients, subject,content,cronExpression}=req.body
})

app.use('/api/campaigns',CampaignRouter)
app.use('/admin',AdminRouter)
app.listen(PORT,(err)=>{
    if(!err){
        console.log('Server Started..');
        atlasDb()
    }else{
        console.log('Something Went wrong',err);
    }
})