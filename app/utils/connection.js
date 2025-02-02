const mysql = require("mysql-await");

var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    charset: process.env.DATABASE_CHARSET
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
    // this is used to keep the session active
    setInterval(function () {
        let sql = "SELECT id FROM Users WHERE id = 1"
        con.query(sql)
    }, 5 * 60 * 1000);
});

module.exports = { con }