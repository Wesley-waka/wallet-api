import express from 'express';
import walletRouter from './routes/wallet.route';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/wallet', walletRouter);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});