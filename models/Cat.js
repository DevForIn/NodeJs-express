const mongoose = require('mongoose');

// Schema 및 model 정의
const catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    bread: String
});


const Cat = mongoose.model('Cat',catSchema);

module.exports = Cat;