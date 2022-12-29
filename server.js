const express = require('express');
const res = require('express/lib/response');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// https://sirius7.tistory.com/59
const session = require('express-session');
const FileStore = require('session-file-store')(session);


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
    console.log('MySQL DB Connect success ! ');
});

connection.end();

// parse application/x-www-form-urlencoded
// { extended: true } : nested object를 지원한다.
// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
app.use(bodyParser.urlencoded({ extended : true }));

// parse application/json
app.use(bodyParser.json());

app.get('/',(req,res) => res.send('Hello wordl ! ! !'));

app.post('/signin', (req,res) => {
    const {userName, password } = req.body;
    // 클라이언트로부터 전송된 페이로드를 그대로 response한다.
    res.send({userName, password});
});