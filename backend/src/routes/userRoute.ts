// backend/src/routes/user.routes.ts

import { Router } from 'express';
// Usando os nomes de arquivo corretos que você postou:
import { registerUserHandler, loginUserHandler } from '../controllers/userController.js';
import { validate } from '../middlewares/validate.js';
import { registerUserSchema, loginUserSchema } from '../schemas/userSchema.js';

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário (Paciente ou Profissional)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, password, role]
 *             properties:
 *               nome:
 *                 type: string
 *                 default: "João da Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "joao@exemplo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 default: "senha123"
 *               role:
 *                 type: string
 *                 enum: [PACIENTE, PROFISSIONAL]
 *                 default: "PACIENTE"
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Erro de validação (Zod).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidation'
 *       '409':
 *         description: Email já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorConflict'
 */


router.post(
  '/register',
  validate(registerUserSchema),
  registerUserHandler
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "joao@exemplo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 default: "senha123"
 *     responses:
 *       '200':
 *         description: Login bem-sucedido. Retorna o token e os dados do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Erro de validação.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidation'
 *       '401':
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: "Credenciais inválidas"
 */

router.post(
  '/login',
  validate(loginUserSchema),
  loginUserHandler
);

export default router;