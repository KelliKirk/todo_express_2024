const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading tasks');
            }
            const tasks = data.split('\n'); 
            resolve(tasks)
        });   
    } )
} 

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    readFile('./tasks')
        .then(tasks => {
            console.log(tasks)
             res.render('index', { tasks: tasks });
        }) 
        })
        
    

app.post('/', (req, res) => {
    console.log('form sent data');
    
    tasks.push(req.body.task)
    console.log(req.body.task);
     const data = tasks.join('\n')
     console.log(data)
    console.log(tasks.join('\n'))

     const tasks = data.split('\n');  
  
    
        fs.writeFile('./tasks', data, err => {
            if (err) {
              console.error(err);
            } else {
              res.redirect('/')
            }
          });
        
});

app.listen(3001, () => {
    console.log('Server is started http://localhost:3001');
});
