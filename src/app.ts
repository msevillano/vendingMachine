import express, { Application } from 'express';
import bodyParser from 'body-parser';

import router from './router';

export function startApp(): Application {
  const app = express();

  app.use(bodyParser.json({ type: 'application/json' }));

  app.use(router());

  return app;
}

export default startApp;
