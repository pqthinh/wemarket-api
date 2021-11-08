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
        name = body.name,
        address = body.address,
        email = body.email,
        phone = body.phone;

      let result, response;

      if (!email || !phone) res;
      let sqlCheckExist = "select * from user where email=? or phone=?";
      result = await conn.query(sqlCheckExist, [uid]);
      await conn.commit();

      response = { status: false, message: "User existed false" };
      if (result.length == 1) {
        let sql = `insert into user set ? `;
        await conn.query(sql, [uid, name, address, email, phone]);
        await conn.commit();
        response = { status: true, message: "success" };
      }
      res.json({ response });
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
  getUserDetail: async (req, res, next) => {
    const { uid } = req.body;
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from user where uid = ? `;
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
  loginAdmin: async (req, res, next) => {
    // console.log(req)
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        email = body.Email,
        uPassword = body.password;
      if (!email || !uPassword) {
        return res.status(400).json({
          error: true,
          message: "Email or Password required.",
        });
      }

      let sql, result;
      sql = `select * from admin where email =?`;
      result = await conn.query(sql, [email]);
      await conn.commit();

      if (result[0].length == 0) {
        return res.status(401).json({
          error: true,
          message: "Email is wrong.",
        });
      } else if (result[0].length > 1) {
        return res.status(401).json({
          error: true,
          message: "Loi he thong",
        });
      } else {
        // check password
        const hash = result[0][0].password;
        if (!bcrypt.compareSync(uPassword, hash)) {
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
        username = body.username,
        uPassword = body.password;
      if (!uname || !uPassword || !username) {
        return res.status(400).json({
          error: true,
          message: "Name, Username , Password required.",
        });
      }
      // Check username
      let sql1, result1;
      sql1 = `select * from admin where username =? `;
      result1 = await conn.query(sql1, [username]);
      await conn.commit();

      if (result1[0].length > 0) {
        return res.status(401).json({
          error: true,
          message: "Username existed",
        });
      } else {
        let sql, result;

        // Hash password
        const myPlaintextPassword = uPassword;
        const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

        sql = `insert into admin(name, username, password) value(?,?,?)`;
        result = await conn.query(sql, [uname, username, hash]);
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
        uUsername = body.username,
        uPassword = body.password;

      if (!uname & !uPassword & !uUsername) {
        return res.status(400).json({
          error: true,
          message: "Data not changed",
        });
      }
      // Check username
      let sql, result;
      sql = `update admin set name=?, username =?, password=? where id = ?`;
      const myPlaintextPassword = uPassword;
      const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
      result = await conn.query(sql, [uname, uUsername, hash, uid]);
      await conn.commit();

      res.json({ status: "Update success" });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  createUser:async (req, res, next) => {
    let conn;
    let {uid, username, address, email, phone, gender=null, birthday, avatar=null } = req.body;
    try {
      let createdAt = new Date();
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let result, response;

      if (!email || !phone) {
        response = {error: true, message:"Email or phone is empty"}
        res.json({ response });
      }
      else {
        let sqlCheckExist = "select * from user where email=? or phone=?";
        result = await conn.query(sqlCheckExist, [email, phone]);
        await conn.commit();
  
        response = { status: false, message: "User existed false" };
        if (result[0].length == 0) {
          let sql = `insert into user set uid = ?, username = ?, address = ?, email = ?, phone = ?, gender =?, birthday = ?, avatar = ?, status = "pendding", createdAt = ?, updatedAt = ? `;
          await conn.query(sql, [uid, username, address, email, phone, gender, birthday, avatar, createdAt, createdAt]);
          await conn.commit();
          response = { status: 1, message: "success" };
        }
        res.json({ response });
      }
      
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminActiveUser:async (req, res, next) => {
    let { idUser } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `update user
             set status = "active",updatedAt = ?
             where user.id = ?`;
      result = await conn.query(sql, [
        updatedAt,
        idUser,
      ]);

      const response = {
        result: "success",
        status : 1,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
};

module.exports = User;
