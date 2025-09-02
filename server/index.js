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

    db.get(`SELECT login, role, id FROM users WHERE login = '${login}' AND password = '${password}'`, (err, row) => {
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
                console.log(row)
                res.status(200).send({
                    info: row

                })
            }
        }
    })
});

app.post('/bonusCheck', (req, res) => {
    const phoneNumber = req.body.phoneNumber

    db.get(`SELECT * FROM clients WHERE phoneNumber = '${phoneNumber}'`, (err, row) => {
        console.log(phoneNumber)
        if (err) {
            console.log(err)
        }
        else {
            console.log(row)
            if (row == undefined) {
                res.status(400).send({
                    message: "Клиент не найден"
                })
            }
            else {
                res.status(200).send({
                    info: row
                })
            }
        }
    })
})

app.get('/getFlowers', (req, res) => {
    db.all(`SELECT * FROM flowers WHERE 1`, (err, rows) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(rows)
            res.status(200).send({
                info: rows
            })
        }
    })
})

app.get("/getPackages", (req, res) => {
    db.all("SELECT * FROM packages WHERE 1", (err, rows) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(rows)
            res.status(200).send({
                info: rows
            })
        }
    })
})

app.post("/pushSale", (req, res) => {
    console.log(req.body)

    const { flowers, package, discount, bonus, deliveryPrice, fullPrice, discountedPrice, clientID, userID } = req.body

    let query = "INSERT INTO sales (packageID, discount, deliverPrice, price, discountedPrice, clientID, userID) VALUES (?, ?, ?, ?, ?, ?, ?)"

    db.run(query, [package, discount, deliveryPrice, fullPrice, discountedPrice, clientID, userID], function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ message: "Ошибка добавления данных" })
        }

        if (bonus) {
            db.run("UPDATE clients SET bonuses = bonuses + ? WHERE id = ?", [bonus, clientID], function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send("Ошибка добавления бонусов")
                }

            })
        }
        if (discount) {
            db.run("UPDATE clients SET bonuses = bonuses - ? WHERE id = ?", [discount, clientID], function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send("Ошибка убавления бонусов")
                }

            })
        }

        const saleID = this.lastID

        console.log("Запись добавлена " + saleID)

        query = "INSERT INTO sales_flowers (flower, quantity, saleID) VALUES (?, ?, ?)"

        const insertPromises = flowers.map(flower => {
            return new Promise((resolve, reject) => {
                db.run(query, [flower.selected.id, flower.quantity, saleID], function (err) {
                    if (err) reject(err)
                    else resolve(this.lastID)
                })
            })
        })

        Promise.all(insertPromises)
            .then(itemIDs => {
                console.log("Добавлены товары с ID: " + itemIDs)
                res.status(200).send({
                    message: "Продажа и товары успешно добавлены",
                    saleID,
                    itemIDs
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).send({
                    message: "Ошибка добавления товаров"
                })
            })

    })
})

app.listen(PORT, '192.168.0.179', () => {
    console.log(`Сервер запущен на http://192.168.0.179:${PORT}`);
});
