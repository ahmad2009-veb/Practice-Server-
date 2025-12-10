const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

let items = [
    {id:1,name:"Ahmad",age:16},
    {id:2,name:"Muhammad",age:18},
    {id:3,name:"Yusuf",age:12},
]

app.get('/items', (req,res) => {
    res.json(items)
})


app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`);  
})