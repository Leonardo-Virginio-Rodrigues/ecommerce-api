import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { env } from "../../config/env";

const options: SMTPTransport.Options = {
  host: env.email.smtp.host,
  port: Number(env.email.smtp.port),
  secure: env.email.smtp.secure,
  auth:
    process.env.MAIL_USER && process.env.MAIL_PASS
      ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
      : undefined,
};

const mailer: Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport(options);

mailer.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: path.resolve("resources/providers/mail"),
      defaultLayout: false,
      partialsDir: path.resolve("resources/providers/mail"),
    },
    viewPath: path.resolve("resources/providers/mail"),
    extName: ".hbs",
  })
);

export { mailer };
