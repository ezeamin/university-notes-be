import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { router } from './routes/routes';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//1- Inicializamos express
const app = express();

//2- Configuraciones del servidor -> Variables de servidor
app.set('PORT', process.env.PORT || 5000);

//3- Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); // <==== parse request body as JSON

//4- Rutas -> Tendra el siguiente formato
app.use(router);

//5- Loop del servidor
app.listen(app.get('PORT'), () => {
  console.log(`Servidor ejecutándose en puerto
${app.get('PORT')}`);
});
