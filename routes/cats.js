const express = require('express');
const router = express.Router();
const Cat = require('../models/Cat'); // Cat 모델 가져오기

// C R U D Start 
// C
router.post('/cats',async (req, res) => {
    try{
        const newCat = new Cat(req.body);
        await newCat.save();
        res.status(201).send(newCat);
    } catch(error){
        res.status(400).send(error);
    }
});

// R
router.get('/cats', async (req, res) => {
    try{
        const cats = await Cat.find();
        res.status(200).send(cats);
    }catch(error){
        res.status(500).send(error);
    }
});

router.get('/cats/ids', async (req, res) => {
    try{
        const cats = await Cat.find().select('_id');
        res.status(200).send(cats);
    }catch(error){
        res.status(500).send(error);
    }
});

// R find Id
router.get('/cats/:id', async (req, res) => {
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
router.put('/cats/:id', async(req,res) => {
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
router.delete('/cats/:id', async(req,res) => {
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
module.exports = router;
