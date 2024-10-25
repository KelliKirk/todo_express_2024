const express = require('express')
const path = require('path')
const fs = require('node:fs');

const app = express()

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const tasks = JSON.parse(data) 
            resolve(tasks)
        });
    })
} 

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf8', err => {
            if (err) {
              console.error(err);
              return;
            }
            resolve(true)
        });
    })
}

app.get('/', (req, res) => {
    readFile('./tasks.json')
        .then((tasks) => { 
            res.render('index', {
                tasks: tasks,
                error: null
            })
    })   
})

app.post('/', (req, res) => {
    console.log('form sent data')
    let task = req.body.task
    let error = null
    if(task.trim().length === 0){
        error = 'Please insert correct task data'
        readFile('./tasks.json')
        .then((tasks) => { 
            res.render('index', {
                tasks: tasks, 
                error: error
            })
        }) 
    } else{
        readFile('./tasks.json')
        .then((tasks) => {
            let index
            if(tasks.length === 0){
                index = 0
            } else {
                index = tasks[tasks.length - 1].id + 1 
            } 

            const newTask = {
                id: index,
                task: task
            } 

            tasks.push(newTask)
            console.log(tasks)

            const data = JSON.stringify(tasks, null, 2)

            writeFile('./tasks.json', data)

            res.redirect('/')
        })
    } 

})

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === deletedTaskId){
                    tasks.splice(index, 1)
                } 
            });

            const data = JSON.stringify(tasks, null, 2)

            writeFile('./tasks.json', data)

            res.redirect('/')
        })
})

app.get('/delete-tasks', (req, res) => {
    tasks = [] 
    const data = JSON.stringify(tasks, null, 2)
    writeFile('./tasks.json', data)
    res.redirect('/')
})

app.get('/edit-task/:taskID', (req, res) => {
    const taskID = parseInt(req.params.taskID);
    readFile('./tasks.json')
        .then(tasks => {
            const task = tasks.find(t => t.id === taskID);
            if (task) {
                res.render('edit', { task: task }); // Kui ülesanne leitakse, kuvatakse redigeerimisvorm
            } else {
                res.redirect('/'); // Kui ülesannet ei leita, suunatakse tagasi avalehele
            }
        });
});

//Ruuter, mis hõlmab nii veahaldust kui redigeerimist
app.post('/edit-task/:taskID', (req, res) => {
    const taskID = parseInt(req.params.taskID);
    const editedTask = req.body.task;

    readFile('./tasks.json')
        .then(tasks => {
            const taskIndex = tasks.findIndex(t => t.id === taskID);

            // Kontrollime, kas ülesanne leiti
            if (taskIndex !== -1) {
                // Kontrollime, kas redigeerimisväli on tühi
                if (editedTask.trim().length === 0) {
                    // Kui tühi, seadistame veateate ja renderdame redigeerimisvormi
                    const error = 'Please insert correct task data';
                    return res.render('edit', {
                        task: tasks[taskIndex], // Tagastame olemasoleva ülesande, et see oleks redigeerimisvormis nähtav
                        error: error
                    });
                }

                // Kui ülesanne leiti ja on korrektne, uuendame seda
                tasks[taskIndex].task = editedTask;
                const data = JSON.stringify(tasks, null, 2);
                
                return writeFile('./tasks.json', data)
                    .then(() => res.redirect('/')); // Suuname tagasi avalehele
            } else {
                res.redirect('/'); // Kui ülesannet ei leita, suunatakse tagasi avalehele
            }
        });
});





app.listen(3001, () => {
    console.log('Server is started http://localhost:3001')
})