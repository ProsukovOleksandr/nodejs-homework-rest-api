import nodemailer from "nodemailer";
import "dotenv/config";

//const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;
const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.UKR_NET_EMAIL,
        pass: process.env.UKR_NET_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

/*const data = {
  to: "vegij33166@jybra.com",
  subject: "Test email",
  html: "<b>Test email</b>",
};*/
const sendEmail = (data) => {
  const email = { ...data, from: process.env.UKR_NET_EMAIL };
  return transport.sendMail(email);
};
export default sendEmail;
