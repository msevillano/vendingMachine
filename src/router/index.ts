import { Router } from 'express';

import { reportCurrentBalance, addFunds, returnFunds, buy, toggleServiceMode, fillMachine } from '../controller';

export default function createRouter(): Router {
  const router = Router();

  router.post('/addFunds', addFunds);
  router.get('/balance', reportCurrentBalance);
  router.get('/returnFunds', returnFunds);
  router.post('/buy', buy);
  router.post('/service', toggleServiceMode);
  router.post('/fillMachine', fillMachine);

  return router;
}
