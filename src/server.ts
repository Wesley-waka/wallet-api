import express, { Request, Response } from 'express';
import walletRouter from './routes/wallet.route';
import transactionRouter from './routes/transaction.route';

const app = express();
const port = 3000;
  
app.use(express.json());

app.use('/wallet', walletRouter);
app.use('/transaction', transactionRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});