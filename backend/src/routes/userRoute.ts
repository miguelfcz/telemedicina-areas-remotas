import { Router } from 'express';
import { registerUserHandler } from '../controllers/userController.js';
import { validate } from '../middlewares/validate.js';
import { registerUserSchema } from '../schemas/userSchema.js';

const router = Router();

/**
 * @swagger
 * /api/users/register:
 * post:
 * summary: Registra um novo usuário (Paciente ou Profissional)
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nome
 * - email
 * - password
 * - role
 * properties:
 * nome:
 * type: string
 * default: "João da Silva"
 * email:
 * type: string
 * format: email
 * default: "joao@exemplo.com"
 * password:
 * type: string
 * format: password
 * default: "senha123"
 * role:
 * type: string
 * enum: [PACIENTE, PROFISSIONAL]
 * default: "PACIENTE"
 * responses:
 * 201:
 * description: Usuário criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserResponse'
 * 400:
 * description: Erro de validação (Zod).
 * 409:
 * description: Email já cadastrado.
 */
router.post(
  '/register',
  validate(registerUserSchema),
  registerUserHandler
);

export default router;