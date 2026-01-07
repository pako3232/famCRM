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

    const { flowers, package, discount, bonus, deliveryPrice, fullPrice, discountedPrice, date, clientID, userID } = req.body

    let query = "INSERT INTO sales (packageID, discount, deliverPrice, price, discountedPrice, date, clientID, userID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"

    db.run(query, [package, discount, deliveryPrice, fullPrice, discountedPrice, date, clientID, userID], function (err) {
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

app.get("/getAll", (req, res) => {

    const sql = `SELECT
                    s.id as saleID,
                    s.packageID,
                    s.discount,
                    s.deliverPrice,
                    s.price,
                    s.discountedPrice,
                    u.FIO as florist,
                    s.date,
                    f.name,
                    f.price as flowerPrice,
                    sf.flower as flowerID,
                    sf.quantity,
                    c.name as clientName,
                    c.phoneNumber,
                    p.name as packageName,
                    p.price as packagePrice
                    FROM sales s
                    LEFT JOIN sales_flowers sf ON s.id = sf.saleID
                    LEFT JOIN flowers f ON sf.flower = f.id
                    LEFT JOIN clients c on s.clientID = c.id
                    LEFT JOIN packages p on s.packageID = p.id
                    LEFT JOIN users u on s.userID = u.id
                    ORDER BY s.id DESC`

    db.all(sql, (err, sales) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: "Ошибка при получении данных о прадажах" })
        }
        const fullSales = {}

        sales.forEach(sale => {
            let formattedDate = null;
            if (sale.date) {
                formattedDate = new Date(sale.date.replace(" ", "T") + "Z").toLocaleString("ru-RU", {
                    timeZone: "Asia/Novosibirsk",   // можно поменять на свой
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
            }
            if (!fullSales[sale.saleID]) {
                fullSales[sale.saleID] = {
                    id: sale.saleID,
                    packageID: sale.packageID,
                    discount: sale.discount,
                    deliveryPrice: sale.deliverPrice,
                    price: sale.price,
                    discountedPrice: sale.discountedPrice,
                    userID: sale.userID,
                    date: formattedDate,
                    clientName: sale.clientName,
                    phoneNumber: sale.phoneNumber,
                    packageName: sale.packageName,
                    packagePrice: sale.packagePrice,
                    florist: sale.florist,
                    flowers: []
                }

            }
            if (sale.flowerID) {
                fullSales[sale.saleID].flowers.push({
                    flowerID: sale.flowerID,
                    quantity: sale.quantity,
                    name: sale.name,
                    price: sale.flowerPrice
                })
            }

        })

        const fullSalesArr = Object.values(fullSales)
        fullSalesArr.reverse()
        console.log(fullSalesArr)
        res.status(200).send({
            sales: fullSalesArr
        })

    })
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://loaclhost:${PORT}`);
});
