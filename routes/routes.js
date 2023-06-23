import express from 'express';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

import { data } from '../data.js';

dotenv.config();
export const router = express.Router();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

router.post('/', async (req, res) => {
  let text = `\nPrueba realizada a las ${new Date().toLocaleTimeString()} del día ${new Date().toLocaleDateString()}\n\n`;

  const args = req.body;

  for (let i = 0; i < args.length; i++) {
    const { materia, state, score = '' } = args[i] || {};

    const description = data.ESTADOS.find(
      (e) => e.letter === state
    ).description;

    text += `
      ${materia.id} - ${materia.description} - ${description} (${state}) ${
      score && `- ${score}`
    }
    `;
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: 'Resultados de la prueba - UNSTA',
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (e) {
    console.log('ERRORRRRR:', e);
    res.sendStatus(500);
  }
});
