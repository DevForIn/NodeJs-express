const express = require('express');
const app = express();
const mysql = require('mysql');

// port wait for 3000 and play function !
app.listen(3000, function(){
    console.log('listening on 3000')
});

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'qms'
});

connection.connect();

connection.query('SELECT * from user',(error,rows, fields) => {
    if(error) throw error;
    console.log('User info is : ',rows);
});

connection.end();



