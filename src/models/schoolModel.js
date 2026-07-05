import * as z from 'zod'
import {prisma} from '../helpers/dbConnection.js'
import { createValidator } from '../helpers/createValidator.js'

const schoolSchema = z.object({
    id: z.int("Id é obrigatório e deve ser um valor numérico")
      .positive("Id deve ser um valor numérico positivo"),
    name: z.string("Nome deve ser uma string")
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(200, "Nome deve ter no máximo 200 caracteres"),
    address: z.string("Endereço deve ser uma string")
      .min(3, "Endereço deve ter no mínimo 3 caracteres")
      .max(10000, "Descrição deve ter no máximo 10000 caracteres"),
})

export const validateSchool = createValidator(schoolSchema)

export const createSchool = (school) => {
    return prisma.school.create({
        data: school
    });
}

export const getSchools = () => {
    return prisma.school.findMany();
}

export const getSchoolById = (id) => {
    return prisma.school.findUnique({
        where: {
            id
        }
    });
}

export const deleteSchool = (id) => {
    return prisma.school.delete({
        where: {
            id
        }
    });
}

export const updateSchool = (school, id) => {
    return prisma.school.update({
        data: school,
        where: {
            id
        }
    });
}
