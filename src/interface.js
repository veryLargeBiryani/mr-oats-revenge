const app = require('express')() , { PORT } = require('../config.json') || 3000;

app.use( express.json() );
app.listen(PORT, ()=>{
    console.log('--Oats API Initialized--');
})