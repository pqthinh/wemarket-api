var nodemailer = require("nodemailer");

const sendEmail = ({
  emailFrom = process.env.EMAIL,
  passEmail = process.env.EMAIL_PASSWORD,
  emailTo,
  titleEmail,
  htmlContent,
}) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailFrom,
      pass: passEmail,
    },
  });

  const mailOptions = {
    from: emailFrom,
    to: emailTo, //'myfriend@yahoo.com, myotherfriend@yahoo.com',
    subject: titleEmail,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
