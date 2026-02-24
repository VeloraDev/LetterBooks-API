import 'dotenv/config';
import 'reflect-metadata';
import { appFactory } from './app.js';
import { PORT } from './config/constants.js';

const app = appFactory();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
