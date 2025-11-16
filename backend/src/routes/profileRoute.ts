import { Router } from 'express';
import { getMyProfileHandler, updateMyProfileHandler } from '../controllers/profileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

import { validate } from '../middlewares/validate.js';
import { updateProfileSchema } from '../schemas/userSchema.js';

const router = Router();

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Busca o perfil do usuário logado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       '401':
 *         description: Não autorizado (token inválido ou não fornecido).
 */
router.get('/me', authMiddleware, getMyProfileHandler);

/**
 * @swagger
 * /api/profile/me:
 *   put:
 *     summary: Atualiza o perfil do usuário logado (CRM, Especialidade, Localidade)
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePayload'
 *     responses:
 *       '200':
 *         description: Perfil atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       '400':
 *         description: Erro de validação (Zod) ou campos extras enviados.
 *       '403':
 *         description: "Proibido (ex: Paciente tentando adicionar CRM)."
 *       '401':
 *         description: Não autorizado.
 */
router.put(
  '/me',
  authMiddleware,
  validate(updateProfileSchema),
  updateMyProfileHandler
);

export default router;
