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
                return reject('Error reading tasks');
            }
            const tasks = JSON.parse(data); 
            resolve(tasks);
        });   
    });
}; 

app.use(express.urlencoded({ extended: true }));

let tasks = []; 

app.get('/', (req, res) => {
    readFile('./tasks.json')
        .then(fileTasks => {
            tasks = fileTasks; 
            res.render('index', { tasks: tasks });
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

app.post('/', (req, res) => {
    console.log('form sent data');
    readFile('./tasks.json')
        .then(tasks => {
            let index
            if(tasks.length == 0) {
                index = 1
            } else {
                index = tasks[tasks.length - 1].id + 1 
            } 

            const newTask = {
                id: index,
                task: task
            } 
        } )
    tasks.push(newTask);
    console.log(tasks);
    const data = JSON.stringify(tasks, null, 2)
    console.log(data)
    
    const data = tasks.join('\n');
    
    fs.writeFile('./tasks.json', data, err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing tasks');
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3001, () => {
    console.log('Server is started http://localhost:3001');
});
