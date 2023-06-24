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

router.post('/finales', async (req, res) => {
  const date = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  let text = `\nPrueba realizada en ${date}\n\n`;

  const args = req.body;
  let novedades = false;

  if (Object.keys(args) === 0 || !args[0]?.materia || !args[0]?.state) {
    return res.sendStatus(400);
  }

  for (let i = 0; i < args.length; i++) {
    const { materia, state, score = '' } = args[i] || {};

    const description = data.ESTADOS.find(
      (e) => e.letter === state
    ).description;

    if (score) novedades = true;

    text += `
      ${materia.id} - ${materia.description} - ${description} (${state}) ${
      score ? `- ${score} ${state === 'A' ? '🥳🎉' : '😥😭'}` : ''
    }
    `;
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: `${
      novedades ? 'NOVEDADES!! - ' : ''
    }Resultados automáticos FINALES - UNSTA`,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (e) {
    console.log('ERROR:', e);
    res.sendStatus(500);
  }
});

router.post('/parciales', async (req, res) => {
  const date = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  let text = `\nPrueba realizada en ${date}\n\n`;

  const body = req.body;

  if (Object.keys(body) === 0) {
    return res.sendStatus(400);
  }

  const { novedades } = body;

  if (novedades) {
    text += 'NOVEDADES!!\n\nRevisa los parciales 🎉\n\n';
  } else {
    text += 'No hay novedades en los parciales 😥😭\n\n';
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: `${
      novedades ? 'NOVEDADES!! - ' : ''
    }Resultados automáticos PARCIALES - UNSTA`,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (e) {
    console.log('ERROR:', e);
    res.sendStatus(500);
  }
});
