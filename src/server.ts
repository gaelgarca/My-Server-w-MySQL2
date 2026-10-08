import express, { type Express } from 'express';

import router from './routes/index.js';

export class Server {
  private readonly app: Express;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.get('/health', (_request, response) => {
      response.status(200).json({ status: 'ok' });
    });

    this.app.use('/api/v1', router);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

