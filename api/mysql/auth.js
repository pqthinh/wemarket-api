const dbs = require("./dbs");
const utils = require("../helpers/jwt");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const client = require("./elastic");

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
    const { uid } = req.params;
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from user where uid = ? `;
      result = await conn.query(sql, [uid]);
      await conn.commit();
      res.json({ status: 1, data: result[0][0] });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  loginAdmin: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        email = body.email,
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

      if (result[0].length == 0)
        return res.status(401).json({
          error: true,
          message: "Email is wrong.",
        });

      // check password
      const hash = result[0][0].password;
      if (!bcrypt.compareSync(uPassword, hash)) {
        return res.status(401).json({
          data: null,
          error: true,
          message: "Password is Wrong.",
        });
      }

      // generate token
      const token = utils.generateToken(result[0][0]);
      // get basic user details
      const userObj = utils.getCleanUser(result[0][0]);
      // return the token along with user details
      // console.log(userObj)
      res.json({ data: { user: userObj, token }, message: "Login success" });
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
        email = body.email,
        uPassword = body.password;
      if (!uname || !uPassword || !email) {
        return res.status(400).json({
          error: true,
          message: "Username, email , Password required.",
        });
      }
      // Check email
      let sql1, result1;
      sql1 = `select * from admin where email =? `;
      result1 = await conn.query(sql1, [email]);
      await conn.commit();

      if (result1[0].length > 0) {
        return res.status(401).json({
          error: true,
          message: "Email existed",
        });
      } else {
        let sql, result;

        // Hash password
        const myPlaintextPassword = uPassword;
        const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

        sql = `insert into admin(email, name, password) value(?,?,?)`;
        result = await conn.query(sql, [email, uname, hash]);
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
  changePassAdmin: async (req, res, next) => {
    let conn;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const body = req.body,
        oldPassword = body.oldPassword,
        newPassword = body.newPassword,
        id = body.id;
      if (!oldPassword || !newPassword || !id) {
        return res.status(400).json({
          error: true,
          message: "Old pasword, new password, id required.",
        });
      }
      // Check user
      let sql1, result;
      sql1 = `select * from admin where id =? `;
      result = await conn.query(sql1, [id]);
      await conn.commit();

      if (result[0].length < 0) {
        return res.status(401).json({
          error: true,
          message: "Admin not existed",
        });
      } else {
        // check password
        const hashOldPass = result[0][0].password;
        if (!bcrypt.compareSync(oldPassword, hashOldPass)) {
          return res.status(401).json({
            error: true,
            message: "Old password is Wrong.",
          });
        }

        // Hash new password
        const myPlaintextPassword = newPassword;
        const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

        await conn.query(
          `update admin set password = ?, updatedAt = ? where id = ?`,
          [hash, updatedAt, id]
        );
        await conn.commit();
      }

      res.json({ message: "update password success", status: true });
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
        uid = body.id,
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
  createUser: async (req, res, next) => {
    let conn;
    let {
      uid,
      username,
      address,
      email,
      phone = "",
      gender = "",
      birthday = "",
      avatar = "",
    } = req.body;
    try {
      let createdAt = new Date();
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let result, response;

      if (!email) {
        response = { status: false, message: "Email or phone is empty" };
        res.json({ response });
      } else {
        let sqlCheckExist = "select * from user where email=? ";
        result = await conn.query(sqlCheckExist, [email]);
        await conn.commit();

        response = { status: false, message: "User existed false" };
        if (result[0].length == 0) {
          let sql = `insert into user set uid = ?, username = ?, address = ?, email = ?, phone = ?, gender =?, birthday = ?, avatar = ?, status = "pending", createdAt = ? `;
          await conn.query(sql, [
            uid,
            username,
            address,
            email,
            phone,
            gender,
            birthday,
            avatar,
            createdAt,
          ]);
          await conn.commit();
          response = { status: 1, message: "success" };
        }

        //create admin notify
        let adminQuery = await conn.query(
          `select * from admin where deletedAt is null `
        );
        await conn.commit();
        let admins = adminQuery[0];
        let adminNotis = [];
        let h = createdAt.getHours();
        let m = createdAt.getMinutes();
        let s = createdAt.getSeconds();
        let date = createdAt.getDate();
        let month = createdAt.getMonth() + 1;
        let year = createdAt.getFullYear();
        let title = `Tài khoản mới`;
        let content = `Tài khoản người dùng ${username} mới được tạo vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}. Tài khoản đang chờ được kích hoạt`;
        for (let admin of admins) {
          adminNotis.push([admin.id, title, content]);
        }
        let sqlNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
        await conn.query(sqlNoti, [adminNotis]);
        await conn.commit();
        res.json({ response });
      }
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  updateUser: async (req, res, next) => {
    let conn;
    let {
      uid,
      username,
      address,
      gender,
      birthday,
      avatar,
    } = req.body;
    try {
      let updatedAt = new Date();
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      if(!username && !address && !gender && !birthday && !avatar) {
        res.json({ status: 1, message: "success"})
      }
      let updateString = [];
      if(username){
        let string = `username = "${username}"`;
        updateString.push(string);
      }
      if(address){
        let string = `address = "${address}"`;
        updateString.push(string);
      }
      if(gender){
        let string = `gender = "${gender}"`;
        updateString.push(string);
      }
      if(birthday){
        let string = `birthday = "${birthday}"`;
        updateString.push(string);
      }

      if(avatar){
        let string = `avatar = "${avatar}"`;
        updateString.push(string);
      }
      let string = `updatedAt = "${updatedAt}"`;
      updateString.push(string)
      let uidString = `uid = "${uid}"`
      let updateRes = updateString.join();
      
      let result, response;
      let sql = `update user 
                 set ${updateRes}
                 where ${uidString}`;
      await conn.query(sql);
      await conn.commit();
      response = { status: 1, message: "success"};
      res.json({ response });
    

    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  ListAllUser: async (req, res, next) => {
    let conn;
    let { limit = 20, offset = 0 } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let result;
      sql = `select * from user where deletedAt is null`;
      result = await conn.query(sql);
      await conn.commit();
      let user = result[0];
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let userResult = user.slice(skip, skip + Number(limit));
      const response = {
        status: 1,
        length: user.length,
        page: Number(offset) + 1,
        result: userResult,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminActiveUser: async (req, res, next) => {
    let { uid } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `update user
             set status = "active",updatedAt = ?
             where user.uid = ?`;
      result = await conn.query(sql, [updatedAt, uid]);
      //create notify
      let adminQuery = await conn.query(
        `select * from admin where deletedAt is null `
      );
      await conn.commit();
      let admins = adminQuery[0];
      let adminNotis = [];
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let title = `Kích hoạt tài khoản`;
      let content = `Tài khoản người dùng ${result[0].username} đã được kích hoạt vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}`;
      for (let admin of admins) {
        adminNotis.push([admin.id, title, content]);
      }
      let sqlNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
      await conn.query(sqlNoti, [adminNotis]);
      await conn.commit();
      const response = {
        status: true,
        message: "success",
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  listAllUserForAdmin: async (req, res, next) => {
    let conn;
    let { limit = 20, offset = 0 } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let result;
      sql = `select * from user where deletedAt is null`;
      result = await conn.query(sql);
      await conn.commit();
      let user = result[0];
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let userResult = user.slice(skip, skip + Number(limit));
      const response = {
        status: 1,
        length: user.length,
        page: Number(offset) + 1,
        result: userResult,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminFilterUser: async (req, res, next) => {
    let conn;
    let {
      query,
      orderByDate,
      orderByStatus,
      limit = 20,
      offset = 0,
    } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let result;
      sql = `select * from user`;
      result = await conn.query(sql);
      await conn.commit();
      let user = result[0];

      //search email || username || address || phone
      if (query) {
        user = user.filter(
          (x) =>
            x.email.toLowerCase().includes(query.toLowerCase()) ||
            x.username.toLowerCase().includes(query.toLowerCase()) ||
            x.address.toLowerCase().includes(query.toLowerCase()) ||
            x.phone.includes(query)
        );
      }

      //sort by created date
      if (orderByDate) {
        if (orderByDate == "desc") {
          user = user.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        } else {
          user = user.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
      }

      //sort by status
      if (orderByStatus) {
        if (orderByStatus == "desc") {
          user = user.sort(function (a, b) {
            return b.status.localeCompare(a.status);
          });
        } else {
          user = user.sort(function (a, b) {
            return a.status.localeCompare(b.status);
          });
        }
      }

      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let userResult = user.slice(skip, skip + Number(limit));

      const response = {
        status: true,
        total: user.length,
        page: Number(offset) + 1,
        result: userResult,
      };
      res.json(response);
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

    let conn = await dbs.getConnection();
    await conn.beginTransaction();

    let sqlCheckExist = "select * from admin where email=?";
    resCheckExist = await conn.query(sqlCheckExist, [emailto]);
    await conn.commit();

    if (resCheckExist[0].length == 0) {
      return res.status(401).json({
        error: true,
        message: "Khong tim thay email trong he thong",
      });
    } else if (resCheckExist[0].length > 1) {
      return res.status(401).json({
        error: true,
        message: "Loi he thong",
      });
    }

    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: false,
      })
    );
    var mailOptions = {
      from: process.env.EMAIL,
      to: emailto,
      subject: "Reset password of Admin wemarket",
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
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      let sql;
      const myPlaintextPassword = newpass;
      const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

      sql = `update admin set password = ?  where email = ? `;
      await conn.query(sql, [hash, emailto]);
      await conn.commit();
      res.json({ status: "200 OK", msg: "Check your email to reset password" });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminBanUser: async (req, res, next) => {
    let { uid } = req.body;
    let updatedAt = new Date();
    try {
      //validate
      if (!uid) {
        const response = {
          status: false,
          message: "id is required",
        };
        res.json(response);
      }

      conn = await dbs.getConnection();
      await conn.beginTransaction();

      //validate User
      let sqlUser = `select * from user where uid = ?`;
      let userRes = await conn.query(sqlUser, [uid]);
      await conn.commit();
      if (userRes[0].length < 1) {
        const response = {
          status: false,
          message: "User is not existed",
        };
        res.json(response);
        return;
      }
      let user = userRes[0][0];
      result = await conn.query(
        `update user
      set status = "ban",updatedAt = ?
      where user.uid = ?`,
        [updatedAt, uid]
      );
      await conn.commit();

      //update product
      let sqlProduct = `update product 
      set status = "ban", updatedAt = ?
      where product.uid = ?`;
      await conn.query(sqlProduct, [updatedAt, uid]);
      await conn.commit();

      //create notify
      let adminQuery = await conn.query(
        `select * from admin where deletedAt is null `
      );
      await conn.commit();
      let admins = adminQuery[0];
      let adminNotis = [];
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let title = `Ban người dùng `;
      let content = `Tài khoản người dùng ${user.username} đã bị cấm vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}`;
      for (let admin of admins) {
        adminNotis.push([admin.id, title, content]);
      }
      let sqlNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
      await conn.query(sqlNoti, [adminNotis]);
      await conn.commit();

      const response = {
        status: true,
        message: "success",
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
