// 수분기록 / 혈압기록 / 운동기록 / 배뇨기록 / 배변기록 // 체중기록 우선

const express = require('express');
const router = express.Router();


// C R U D Start 
// C
router.post('/cats',async (req, res) =>{
    try{
        const newCat = await Cat.create(req.body);
        res.status(201).send(newCat);
    } catch(error){
        res.status(400).send(error);
    }
});


// R
router.get('/cats', async (req, res) => {
    try{
        const cats = await Cat.findAll();
        res.status(200).send(cats);
    }catch(error){
        res.status(500).send(error);
    }
});

// R find Id
router.get('/cats/:id', async (req, res) => {
    try{
        const cat = await Cat.findByPk(req.params.id);
        if(!cat){
            return res.status(404).send("not find this id...");
        }
        console.log(cat);
        res.status(200).send(cat);

    }catch(error){
        res.status(400).send(error);
    }
});

// R find all Ids
router.get('/cats/ids/all', async (req, res) => {
    try {
        const cats = await Cat.findAll({
            attributes: ['id'], // ID만 가져오기
        });
        if (!cats || cats.length === 0) {
            return res.status(404).send("No cats found.");
        }
        res.status(200).send(cats);
    } catch (error) {
        res.status(400).send(error);
    }
});



// U
router.put('/cats/:id', async(req,res) => {
    try{
        const cat = await Cat.findByPk(req.params.id)
        if(!cat){
            return res.status(404).send("not find this id...");
        }

        await cat.update(req.body);
        res.status(200).send(cat);

    }catch(error){
        res.status(400).send(error);
    }
});

// D
router.delete('/cats/:id', async(req,res) => {
    try {
        const cat = await Cat.findByPk(req.params.id);
        
        if(!cat){
            return res.status(404).send("not find this id...");
        }

        await cat.destroy(cat);
        res.status(200).send(cat);
    } catch (error) {
        res.status(500).send(error);
    }
});