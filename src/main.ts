import { appFactory } from './app.js';
import 'dotenv/config';

const app = appFactory();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
