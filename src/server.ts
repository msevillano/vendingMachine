import dotEnv from 'dotenv';
if (process.env.NODE_ENV === 'development') dotEnv.config();

const port = process.env.PORT as string;
import createApp from './app';

const app = createApp();

app.listen(port, function () {
  console.log(`VendingMachine is up and running on port ${port}`);
});
