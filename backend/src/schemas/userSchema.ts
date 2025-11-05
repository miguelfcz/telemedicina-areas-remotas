import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    
    nome: z.string()
      .min(1, { message: 'Nome é obrigatório' })
      .min(3, { message: 'Nome precisa de pelo menos 3 caracteres' }),

    email: z.string()
      .min(1, { message: 'Email é obrigatório' })
      .email({ message: 'Email inválido' }),

    password: z.string()
      .min(1, { message: 'Senha é obrigatória' })
      .min(6, { message: 'Senha precisa de pelo menos 6 caracteres' }),

    role: z.enum(['PACIENTE', 'PROFISSIONAL'], {
        message: "Tipo deve ser 'PACIENTE' ou 'PROFISSIONAL'",
    }),
  }),
});