import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const getMyProfileHandler = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Usuário não autenticado' });
        
        const { userId } = req.user;
        
        const profile = await prisma.profile.findUnique({
            where: {userId: userId},
            include: {
                user: {
                    select: {
                        nome: true,
                        email: true,
                        role: true
                    },
                },
            },
        });

        if (!profile) return res.status(404).json({ message: 'Perfil não encontrado' });

        return res.status(200).json(profile);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({message: error.message })
        }
        return res.status(500).json({message: 'Erro interno do servidor desconhecido'})
    }
};

export const updateMyProfileHandler = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(500).json({ message: 'Usuário não autenticado' });
        }

        const { userId, role } = req.user;
        const { crm, especialidade, localidade } = req.body;

        if (role == 'PACIENTE' && (crm || especialidade )) {
            return res.status(403).json({message: 'Paciente não pode definir CRM ou Especialidade.'});
        }

        const updateProfile = await prisma.profile.update({
            where: { userId: userId},
            data: {
                crm,
                especialidade,
                localidade,
            },
            include: {
                user: {
                    select: {
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        return res.status(200).json(updateProfile);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({message: error.message })
        }
        return res.status(500).json({message: 'Erro interno do servidor desconhecido'})
    }
};