import 'dotenv/config';
import 'reflect-metadata';
import { appFactory } from './app.js';
import { getPort } from './config/constants.js';

const app = appFactory();
const port = getPort();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
