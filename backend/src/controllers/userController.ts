import type { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import prisma from '../config/prisma.js';
import { registerUserSchema } from '../schemas/userSchema.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const registerUserHandler = async (req: Request, res: Response) => {
  try {

    const { nome, email, password, role } = registerUserSchema.parse(req).body;

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return res.status(201).json(user);

  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.issues,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target === 'User_email_key') {
        return res.status(409).json({ // 409 Conflict
          message: 'Este email já está em uso.',
        });
      }
    }

    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};