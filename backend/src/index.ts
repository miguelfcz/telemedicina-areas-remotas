import express from 'express';
import type { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Telemedicina Áreas Remotas',
      version: '1.0.0',
      description: 'Documentação da API do projeto de telemedicina.',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      schemas: {
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['PACIENTE', 'PROFISSIONAL'] },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API de Telemedicina rodando!');
});

app.listen(port, () => {
  console.log(`[server]: Servidor rodando em http://localhost:${port}`);
  console.log(`[docs]: Documentação Swagger em http://localhost:${port}/api-docs`);
});