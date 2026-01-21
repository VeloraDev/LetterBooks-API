import 'dotenv/config';
import 'reflect-metadata';
import { appFactory } from './app.js';

const app = appFactory();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
