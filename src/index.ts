import 'dotenv/config';
import express from 'express';

const { PORT } = process.env;

async function main() {
  const { default: auth } = await import('./routes/auth');
  const app = express();
  app.use('/api', auth);
  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
}

main();
