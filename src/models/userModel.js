import * as z from 'zod'
import { prisma } from '../helpers/dbConnection.js'
import { createValidator } from '../helpers/createValidator.js'

const userSchema = z.object({
    id: z.int("Id é obrigatório e deve ser um valor numérico")
        .positive("Id deve ser um valor numérico positivo"),
    name: z.string("Nome deve ser uma string")
        .min(3, "Nome deve ter no mínimo 3 caracteres")
        .max(255, "Nome deve ter no máximo 255 caracteres"),
    email: z.email("Email deve ser um endereço de email válido"),
    pass: z.string("Senha é obrigatória e deve ser uma string")
        .min(6, "Senha deve ter no mínimo 6 caracteres")
        .max(255, "Senha deve ter no máximo 255 caracteres"),
    role: z.string("Cargo deve ser uma string")
        .min(3, "O cargo deve ter no mínimo 3 caracteres")
        .max(255, "O cargo deve ter no máximo 255 caracteres"),
    schoolId: z.int("O id da escola é obrigatório e deve ser um valor numérico")
        .min(1, "O id da escola deve ter no mínimo 1 caractere"),
    registration: z.string("A matricula é obrigatória")
        .min(1, "A matricula deve ter no mínimo 1 caractere")
        .max(255, "A matricula deve ter no máximo 255 caracteres")
})

export const validateUser = createValidator(userSchema)

export const createUser = async (user) => {
    return prisma.user.create({
        data: user,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    });
}

export const getUsers = async (name) => {
    return prisma.user.findMany({
        where: name ? {
            name: {
                contains: name
            }
        } : {},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    });
}

export const getUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
}

export const getUserByRegistration = async (registration) => {
    return prisma.user.findUnique({
        where: {
            registration
        },
        select: {
            id: true
        }
    });
}

export const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    });
}

export const deleteUser = async (id) => {
    return prisma.user.delete({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    });
}

export const updateUser = async (user, id) => {
    return prisma.user.update({
        data: user,
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    });
}
