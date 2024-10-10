const express = require('express');
const path = require('path');

const app = express();
const fs = require('node:fs');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
fs.readFile('./tasks', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const tasks = data.split('\n')  
  res.render('index' ,{tasks: tasks} ); 
});
    
});

app.listen(3001, () => {
    console.log('Server is started http://localhost:3001');
});
