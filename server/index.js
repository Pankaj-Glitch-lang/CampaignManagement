
const express=require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const cors = require('cors');
const CampaignRouter = require('./router/campaign.router');
const AdminRouter = require('./router/admin.router');
dotenv.config()
const app=express()
const uri=mongodb_uri = "mongodb+srv://pankajmahato0089:eCwJm0kvbkdVMuql@cluster0.f21rb.mongodb.net/campaign-manager?retryWrites=true&w=majority&appName=Cluster0"
app.use(express.json())
app.use(cors())
const atlasDb= ()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));

}


app.use('/api/campaigns',CampaignRouter)
app.use('/admin',AdminRouter)
app.listen(8080,(err)=>{
    if(!err){
        console.log('Server Started..');
        atlasDb()
    }else{
        console.log('Something Went wrong',err);
    }
})