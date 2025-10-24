const express = require('express');
const app = express();
app.use(express.json());
app.get('/items', (req,res)=> res.json([{ ok:true }]));
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log('Listening on', PORT));
