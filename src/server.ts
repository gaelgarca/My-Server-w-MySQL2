import express, { type ErrorRequestHandler, type Express } from 'express';

import router from './routes/index.js';

const isJsonSyntaxError = (
  error: unknown
): error is SyntaxError & { body: unknown; status: number } => {
  if (!(error instanceof SyntaxError)) {
    return false;
  }

  const httpError = error as SyntaxError & {
    body?: unknown;
    status?: unknown;
  };

  return httpError.status === 400 && 'body' in httpError;
};

export class Server {
  private readonly app: Express;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
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

  private configureErrorHandling(): void {
    this.app.use((_request, response) => {
      response.status(404).json({
        message: 'Ruta no encontrada.'
      });
    });

    const errorHandler: ErrorRequestHandler = (
      error,
      _request,
      response,
      _next
    ) => {
      if (isJsonSyntaxError(error)) {
        response.status(400).json({
          message: 'El cuerpo de la solicitud contiene JSON inválido.'
        });
        return;
      }

      const errorName = error instanceof Error ? error.name : 'UnknownError';
      console.error(`[server] Error no controlado: ${errorName}`);

      response.status(500).json({
        message: 'Ocurrió un error interno al procesar la solicitud.'
      });
    };

    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
