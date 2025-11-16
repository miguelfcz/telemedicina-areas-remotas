import type { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import prisma from '../config/prisma.js';
import { registerUserSchema } from '../schemas/userSchema.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

const { sign } = jwt;

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
        return res.status(409).json({ 
          message: 'Este email já está em uso.',
        });
      }
    }

    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor desconhecido' });
  }
};