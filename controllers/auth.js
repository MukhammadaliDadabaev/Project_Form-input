const mysql = require("mysql");
const bcrypt = require("bcryptjs");
// const async = require("hbs/lib/async");
const dat = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// ✅ Register function
exports.register = (req, res) => {
  //---------> 1. Usul
  /*  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm; */
  //----------> 2. Usul customers
  const { name, email, password, passwordConfirm } = req.body;
  dat.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          message: "That email is already token...",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do`not match...",
        });
      }
      let hashedPassword = await bcrypt.hash(password, 7);
      console.log(hashedPassword);
      dat.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("register", {
              message: "User register",
            });
          }
        }
      );
    }
  );
};

// ✅ Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Please provide an email and password",
      });
    }
    dat.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("login", {
            message: "Email or Password is incorrect...",
          });
        } else {
          const id = results[0].id;
          res.status(200).redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
