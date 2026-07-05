import { getUserById } from "../../models/userModel.js";

export async function getUserByIdController(req, res, next) {
    try {
        const id = +req.params.id

        const result = await getUserById(id)

        if (!result) {
            return res.status(404).json({
                message: "Usuario nao encontrado."
            })
        }

        return res.json({
            message: "Usuario encontrado com sucesso",
            user: result
        })
    } catch (error) {
        next(error)
    }
}
