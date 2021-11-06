const dbs = require("./dbs");
const utils = require("../helpers/jwt");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = {
  getAdmin: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from admin`;
      result = await conn.query(sql);
      await conn.commit();
      res.json(result[0]);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getUserSearch: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        uid = body.uid,
        uname = body.name,
        uphone = body.phone,
        uemail = body.email,
        udate1 = body.date1,
        udate2 = body.date2;
      let sql, result, id, name, phone, date, email;
      typeof uid !== "undefined" ? (id = "id = ?") : "1";
      typeof uname !== "undefined" ? (name = "name like %'?'%") : "1";
      typeof uphone !== "undefined" ? (phone = "phone like %'?'%") : "1";
      date =
        typeof udate1 === "undefined"
          ? typeof udate2 === "undefined"
            ? "1"
            : `date <= ${udate1}`
          : `date => ${udate1} and date <= ${udate2}`;
      typeof uemail === "undefined" ? (email = "mail  like %'?'%") : "1";

      sql = `select * from member where  ${id} and ${name} and ${phone} and ${date} and ${email}`;

      result = await conn.query(sql, [uid]);
      await conn.commit();
      res.json(result[0]);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  registerUser: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        uid = body.uid,
        uname = body.username,
        upass = body.password,
        email = body.email,
        phone = body.phone;
      let sql, sqlCheckExist, result;
      // Sua lai truy van
      if (!email || !phone) res;
      sqlCheckExist = "select * from member where email=? or phone=?";

      sql = `select * from member where name =? and password = ?`;

      result = await conn.query(sql, [uid]);
      await conn.commit();
      response = false;
      if (result.length == 1) response = true;
      res.json({ response });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  loginMember: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        uname = body.username,
        upassword = body.password;
      if (!uname || !upassword) {
        return res.status(400).json({
          error: true,
          message: "Username or Password required.",
        });
      }

      let sql, result;
      sql = `select * from member where username =? and password = ?`;
      result = await conn.query(sql, [uname, upassword]);
      await conn.commit();

      if (result[0].length == 0) {
        return res.status(401).json({
          error: true,
          message: "Username or Password is Wrong.",
        });
      }
      // generate token
      const token = utils.generateToken(result[0][0]);
      const userObj = utils.getCleanUser(result[0][0]);
      res.json({ user: userObj, token });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  sendEmailResetPass: async (req, res, next) => {
    const newpass = Math.random().toString(36).slice(-12);
    const emailto = req.body.email;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USERMAIL.user,
        pass: USERMAIL.pass,
      },
    });
    var mailOptions = {
      from: USERMAIL.user,
      to: emailto,
      subject: "Reset password of app rentalhouse",
      html: `<h1>Welcome</h1> <p>New password:<span style="background: #f0f0f0" > ${newpass} </span> </p> <br/> Let create new password!`,
    };
    // send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Cap nhat mat khau moi vao csdl
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let sql, result;
      // username la duy nhat
      sql = `update member set password = ?  where email = ? `;
      result = await conn.query(sql, [newpass, emailto]);
      await conn.commit();
      res.json({ status: "200 OK", msg: "Check your email to reset password" });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  // Admin controller
  loginAdmin: async (req, res, next) => {
    // console.log(req)
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        uname = body.username,
        upassword = body.password;
      if (!uname || !upassword) {
        return res.status(400).json({
          error: true,
          message: "Username or Password required.",
        });
      }

      let sql, result;
      // username la duy nhat
      sql = `select * from admin where username =?`;
      result = await conn.query(sql, [uname]);
      await conn.commit();

      if (result[0].length == 0) {
        return res.status(401).json({
          error: true,
          message: "Username is Wrong.",
        });
      } else if (result[0].length > 1) {
        return res.status(401).json({
          error: true,
          message: "Loi he thong",
        });
      } else {
        // check password
        const hash = result[0][0].password;
        if (!bcrypt.compareSync(upassword, hash)) {
          return res.status(401).json({
            error: true,
            message: "Password is Wrong.",
          });
        }
      }
      // generate token
      const token = utils.generateToken(result[0][0]);
      // get basic user details
      const userObj = utils.getCleanUser(result[0][0]);
      // return the token along with user details
      // console.log(userObj)
      res.json({ user: userObj, token });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  registerAdmin: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        uname = body.name,
        uusername = body.username,
        upassword = body.password;
      if (!uname || !upassword || !uusername) {
        return res.status(400).json({
          error: true,
          message: "Name, Username , Password required.",
        });
      }
      // Check username
      let sql1, result1;
      sql1 = `select * from admin where username =? `;
      result1 = await conn.query(sql1, [uusername]);
      await conn.commit();

      if (result1[0].length > 0) {
        return res.status(401).json({
          error: true,
          message: "Username existed",
        });
      } else {
        // Inser into table admin
        let sql, result;

        // // Hash password
        const myPlaintextPassword = upassword;
        const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

        sql = `insert into admin(name, username, password) value(?,?,?)`;
        result = await conn.query(sql, [uname, uusername, hash]);
        await conn.commit();
      }

      res.json({ status: "insert success" });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  updateAdmin: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        uname = body.name,
        uid = req.params.id,
        uusername = body.username,
        upassword = body.password;

      if (!uname & !upassword & !uusername) {
        return res.status(400).json({
          error: true,
          message: "Data not changed",
        });
      }
      // Check username
      let sql, result;
      sql = `update admin set name=?, username =?, password=? where id = ?`;
      const myPlaintextPassword = upassword;
      const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
      result = await conn.query(sql, [uname, uusername, hash, uid]);
      await conn.commit();

      res.json({ status: "Update success" });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
};

module.exports = User;
