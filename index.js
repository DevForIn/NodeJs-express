const express = require('express');
const mongoose = require('mongoose');
const app = express();


app.use(express.json()); // json 파싱 미들웨어


// MongoDB Connect
mongoose.connect('mongodb://localhost:27017/test',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// 연결 확인
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Schema 및 model 정의
const catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    bread: String
});


const Cat = mongoose.model('Cat',catSchema);

// C R U D Start ! 

// C
app.post('/cats',async (req, res) => {
    try{
        const newCat = new Cat(req.body);
        await newCat.save();
        res.status(201).send(newCat);
    } catch(error){
        res.status(400).send(error);
    }
});

// R
app.get('/cats', async (req, res) => {
    try{
        const cats = await Cat.find();
        res.status(200).send(cats);
    }catch(error){
        res.status(500).send(error);
    }
});










app.get('/', function (req, res) {
    res.send('test');
});

var server = app.listen(3000,function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server is working ! PORT : ', port);
});
