const sqlite3 = require("sqlite3").verbose();

const DBSource = "contacts.sqlite";

let db = new sqlite3.Database(DBSource, (err) => {
  if (err) {
    console.log(err.message);
    throw err;
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS contact(
                contactId INTEGER PRIMARY KEY AUTOINCREMENT,
                name text NOT NULL,
                email text ,
                phone text,
                address text NOT NULL,
                lat text,
                lng text              
            )`
    );
  }
});

module.exports = db;
