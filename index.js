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
            res.render('index', {tasks: tasks})
    })   
})

app.post('/', (req, res) => {
    console.log('form sent data')
    let task = req.body.task
    readFile('./tasks.json')
        .then((tasks) => {
            let index
            if(tasks.length === 0){
                index = 1
            } else {
                index = tasks[tasks.length - 1].id + 1 
            } 

            const newTask = {
                id: index,
                task: task
            } 

            tasks.push(newTask)
            const data = JSON.stringify(tasks, null, 2)
            writeFile('./tasks.json' , data)
            res.redirect('/')
        })
})

app.get('/delete-task/:taskID' , (req, res) => {
    let deletedTaskID = parseInt(req.params.taskID)
    readFile('./tasks.json')
    .then((tasks) => { 
        tasks.forEach((task, index) => {
            if (task.id === deletedTaskID) {
                tasks.splice(index, 1)
            }
        })
        const data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json' , data)
        res.redirect('/')
    })
})
app.get('/delete-tasks', (req, res) => {
    // Kustutame kõik ülesanded
    writeFile('./tasks.json', JSON.stringify([], null, 2))
    //writeFile: Funktsioon, mis kirjutab andmed faili. Selles kontekstis kasutatakse seda selleks, et kirjutada tühja massiivi [] ülesannete faili.
    //JSON.stringify([], null, 2): Siin teisendatakse tühja massiivi JSON-i stringiks ja seejärel kirjutatakse see ülesannete faili tasks.json. See tühistab kõik olemasolevad ülesanded.
    //null ja 2 on lisaparametrid, mis määravad, kuidas JSON stringina vormistatakse (muutmata objektivõtmeid ja kasutades 2 taandega tühikut).
    .then(() => res.redirect('/'))
    //writeFile tagastab lubaduse (Promise), mis tähendab, et see töötab asünkroonselt. Kui ülesannete faili kirjutamine on edukalt lõpetatud, siis see täidab then-bloki.
    //Kui ülesannete fail on edukalt tühjendatud, käivitub then-blokk.
    //res.redirect('/'): Kui ülesannete fail on tühjaks kirjutatud, suunatakse kasutaja tagasi avalehele (/), kus kuvati kõik ülesanded. Kuna nüüd failis ei ole enam ülesandeid, on ülesandeloend tühi.
})
//Kui kasutaja külastab URL-i http://localhost:3001/delete-tasks, saadab brauser GET-päringu sellele aadressile. Server saab selle päringu ja hakkab vastavalt käituma.
//Kui server saab GET-päringu aadressile /delete-tasks, otsib see vastavat ruuterit. Kui see ruuter on defineeritud, käivitab see vastava koodi.
//Kui brauser suunatakse tagasi algavale lehele /, küsib server uuesti ülesandeloendit (tasks.json). Kuna see fail on nüüd tühi (kõik ülesanded kustutati), ei kuvata enam ühtegi ülesannet.



app.listen(3001, () => {
    console.log('Server is started http://localhost:3001')
})