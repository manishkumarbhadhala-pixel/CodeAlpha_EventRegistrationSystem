const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
const app = express();
const eventRoutes = require('./routes/eventsRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('event-registration api is running');
});

app.use('/',eventRoutes);
app.use('/', registrationRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
