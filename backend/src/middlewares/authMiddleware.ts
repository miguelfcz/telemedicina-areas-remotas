import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const { verify } = jwt;

interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const parts = authorization.split(' ');
  const [scheme, token] = parts;

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('ERRO: JWT_SECRET não definido no arquivo .env');
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }

  try {
    const payload = verify(token, jwtSecret) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
