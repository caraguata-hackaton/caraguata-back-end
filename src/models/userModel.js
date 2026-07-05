import * as z from 'zod'
import { prisma } from '../helpers/dbConnection.js'
import { getAuthenticatedUserContext } from './authContextModel.js'

export const userRoleSchema = z.enum(['MANAGER', 'SCHOOL_USER'])

const userBaseSchema = z.object({
    id: z.int('Id é obrigatório e deve ser um valor numérico')
        .positive('Id deve ser um valor numérico positivo'),
    name: z.string('Nome deve ser uma string')
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(255, 'Nome deve ter no máximo 255 caracteres'),
    email: z.email('Email deve ser um endereço de email válido'),
    pass: z.string('Senha é obrigatória e deve ser uma string')
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .max(255, 'Senha deve ter no máximo 255 caracteres'),
    role: userRoleSchema.optional().default('SCHOOL_USER'),
    schoolId: z.coerce.number()
        .int('O id da escola deve ser um valor numérico inteiro')
        .positive('O id da escola deve ser um valor numérico positivo')
        .optional()
        .nullable(),
    registration: z.string('A matrícula é obrigatória')
        .min(1, 'A matrícula deve ter no mínimo 1 caractere')
        .max(255, 'A matrícula deve ter no máximo 255 caracteres')
})

function validateSchoolForRole(data, ctx) {
    if (data.role === 'SCHOOL_USER' && !data.schoolId) {
        ctx.addIssue({
            code: 'custom',
            path: ['schoolId'],
            message: 'Usuário comum precisa estar vinculado a uma escola.'
        })
    }
}

const loginSchema = z.object({
    registration: z.string().trim().min(1),
    pass: z.string().min(6).max(255)
})

const userIdSchema = z.coerce.number()
    .int('Id deve ser um valor numérico inteiro')
    .positive('Id deve ser um valor numérico positivo')

function validateSchema(schema, data) {
    const result = schema.safeParse(data)
    if (!result.success) {
        return { success: false, error: z.flattenError(result.error).fieldErrors }
    }
    return { success: true, data: result.data }
}

export function validateUser(data, partial) {
    const schema = (partial ? userBaseSchema.partial(partial) : userBaseSchema)
        .superRefine(validateSchoolForRole)
    return validateSchema(schema, data)
}

export function validateLogin(data) {
    return validateSchema(loginSchema, data)
}

export function validateUserId(id) {
    return validateSchema(userIdSchema, id)
}

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
    })
}

export const getUsers = async (name) => {
    return prisma.user.findMany({
        where: name ? { name: { contains: name } } : {},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    })
}

export const getUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } })
}

export const getUserByRegistration = async (registration) => {
    return prisma.user.findUnique({ where: { registration } })
}

export const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    })
}

export const deleteUser = async (id) => {
    return prisma.$transaction(async (transaction) => {
        await transaction.session.deleteMany({ where: { userId: id } })

        return transaction.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                schoolId: true,
                registration: true
            }
        })
    })
}

export const updateUser = async (user, id) => {
    return prisma.user.update({
        data: user,
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolId: true,
            registration: true
        }
    })
}

export function getAuthenticatedUser(userId) {
    return getAuthenticatedUserContext(userId)
}
