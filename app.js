const express = require('express');
const mongoose = require('mongoose');
const app = express();


app.use(express.json()); // json 파싱 미들웨어


// MongoDB Connect
mongoose.connect('mongodb://localhost:27017/test',{ 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);

// 연결 확인
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Complate');
});

// Schema 및 model 정의
const catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    bread: String
});


const Cat = mongoose.model('Cat',catSchema);

// C R U D Start 
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

app.get('/cats/ids', async (req, res) => {
    try{
        const cats = await Cat.find().select('_id');
        res.status(200).send(cats);
    }catch(error){
        res.status(500).send(error);
    }
});

// R find Id
app.get('/cats/:id', async (req, res) => {
    try{
        const cat = await Cat.findById(req.params.id)
        if(!cat){
            return res.status(404).send("not find this id...");
        }
        console.log(cat);
        res.status(200).send(cat);

    }catch(error){
        res.status(400).send(error);
    }
});



// U
app.put('/cats/:id', async(req,res) => {
    try{
        const cat = await Cat.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true,
        });

        // id와 같은 형식이면서 없으면 null undefine 
        if(!cat){
            return res.status(404).send("not find this id...");
        }
        res.status(200).send(cat);

    }catch(error){
        res.status(400).send(error);
    }
})

// D
app.delete('/cats/:id', async(req,res) => {
    try {
        const cat = await Cat.findByIdAndDelete(req.params.id);
        
        if(!cat){
            return res.status(404).send("not find this id...");
        }
        res.status(200).send(cat);
    } catch (error) {
        res.status(500).send(error);
    }
});


//
app.get('/', function (req, res) {
    res.send('test');
});


var server = app.listen(3000,function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server is working ! \nPORT is', port);
});
