import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'happyteeth32.clinic@gmail.com',
    to: email,
    subject: subject,
    text: message,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
