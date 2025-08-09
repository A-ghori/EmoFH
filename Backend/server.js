const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10
})
.then(() => console.log(' **MongoDB connected**'))
.catch((err) => console.error(' MongoDB connection error:', err));

const app = express();

//MiddleWare 
app.use(cors());
app.use(express.json());


//Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth',authRoutes);

//Sample Route
app.get('/', (req,res)=>{
    res.send('EmoFH Backend is Live');
});

//Downloads Routes

//For Windows Downloads
app.get('/download/windows',(req,res) => {
    const filePath = path.join(__dirname,'downloads','EmoFH-Setup-Windows.exe');
    res.download(filePath,"EmoFH-Windows.exe");
});

//For Mac
app.get('/downloads/mac',(req,res) => {
    const filePath = path.join(__dirname, 'downloads',"EmoFH-Setup-Mac.dmg");
    res.download(filePath, 'EmoFH-Mac-dmg');
})

//Start Server
const PORT = process.env.PORT || 5040;
app.listen(PORT, () => {
    console.log(`Server is RUnning for EmoFH on http://localhost:${PORT}`);
})