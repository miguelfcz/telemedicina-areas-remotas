import express from 'express';
import type { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import userRoutes from './routes/userRoute.js';
import profileRoutes from './routes/profileRoute.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      role: string;
    };
  }
}

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
    tags: [
      {
        name: 'Autenticação',
        description: 'API para registro e login de usuários'
      }
    ],
    components: {
      schemas: {
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID único do usuário' },
            nome: { type: 'string', description: 'Nome do usuário' },
            email: { type: 'string', format: 'email', description: 'Email do usuário' },
            role: { type: 'string', enum: ['PACIENTE', 'PROFISSIONAL'], description: 'Tipo de usuário' },
          },
        },
        ErrorValidation: {
          type: 'object',
          properties: {
            message: { type: 'string', default: "Erro de validação" },
            errors: {
              type: 'array',
              items: { type: 'object', properties: { message: { type: 'string' } } }
            }
          }
        },
        ErrorConflict: {
          type: 'object',
          properties: {
            message: { type: 'string', default: "Este email já está em uso." }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            crm: { type: 'string', nullable: true },
            especialidade: { type: 'string', nullable: true },
            localidade: { type: 'string', nullable: true },
            userId: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                nome: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string', enum: ['PACIENTE', 'PROFISSIONAL'] }
              }
            }
          }
        },
        UpdateProfilePayload: {
          type: 'object',
          properties: {
            crm: { 
              type: 'string', 
              nullable: true, 
              description: 'CRM (Somente para PROFISSIONAL)' 
            },
            especialidade: { 
              type: 'string', 
              nullable: true, 
              description: 'Especialidade (Somente para PROFISSIONAL)' 
            },
            localidade: { 
              type: 'string', 
              nullable: true, 
              description: 'Localidade (para Paciente ou Profissional)' 
            },
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API de Telemedicina rodando!');
});

app.listen(port, () => {
  console.log(`[server]: Servidor rodando em http://localhost:${port}`);
  console.log(`[docs]: Documentação Swagger em http://localhost:${port}/api-docs`);
});