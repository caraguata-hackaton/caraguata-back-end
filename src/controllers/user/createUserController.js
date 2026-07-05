import { createUser, getUserByEmail, getUserByRegistration, validateUser } from "../../models/userModel.js"
import bcrypt from "bcrypt"

export async function createUsersController(req, res, next) {
    try {
        const user = req.body

        const { success, error, data } = validateUser(user, { id: true })

        if (!success) {
            return res.status(400).json({
                message: "Erro de validacao",
                fieldErrors: error
            })
        }

        const emailAlreadyExists = await getUserByEmail(data.email)
        if (emailAlreadyExists) {
            return res.status(400).json({
                message: "Erro de validacao",
                fieldErrors: {
                    email: ["O email ja esta em uso por outro usuario."]
                }
            })
        }

        const registrationAlreadyExists = await getUserByRegistration(data.registration)
        if (registrationAlreadyExists) {
            return res.status(400).json({
                message: "Erro de validacao",
                fieldErrors: {
                    registration: ["A matricula ja esta em uso por outro usuario."]
                }
            })
        }

        data.pass = await bcrypt.hash(data.pass, 10)
        const result = await createUser(data)

        return res.json({
            message: "Usuario criado com sucesso!",
            user: result
        })
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                message: "Erro de validacao",
                fieldErrors: error.meta?.target?.includes("registration") ? {
                    registration: ["A matricula ja esta em uso por outro usuario."]
                } : {
                    email: ["O email ja esta em uso por outro usuario."]
                }
            })
        }

        next(error)
    }
}
