const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const sqlite = require('sqlite3').verbose()

const db = new sqlite.Database('./base.db', (err) => {
    if (err) {
        return console.log(err)
    }
    console.log("БД подключена")
})

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json())

app.post('/auth', (req, res) => {
    const login = req.body.login
    const password = req.body.password

    db.get(`SELECT login, role FROM users WHERE login = '${login}' AND password = '${password}'`, (err, row) => {
        if (err) {
            return console.log(err)
        }
        else {
            console.log(row)
            if (row == undefined) {
                res.status(400).send({
                    message: "Неверный логин или пароль"
                })
            }
            else {
                res.status(200).send({
                    info: row
                })
            }
        }
    })
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
