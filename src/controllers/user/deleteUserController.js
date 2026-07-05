import {deleteUser, validateUserId} from "../../models/userModel.js";

export async function deleteUsersController(req, res, next) {
    try {
        const {success, error, data: id} = validateUserId(req.params.id)

        if (!success) {
            return res.status(400).json({
                message: "Erro de validação",
                fieldErrors: error
            })
        }

        const result = await deleteUser(id)

        return res.json({
            message: "Usuário deletado com sucesso!",
            user: result
        })
    } catch (error) {
        if (error.code === 'P2025') {
            console.log(error.message)
            return res.status(404).json({
                message: `Usuário não encontrado para ser deletado.`
            })
        }
        if (error.code === 'P2003') {
            return res.status(409).json({
                message: 'Usuário não pode ser deletado porque possui chamados vinculados.'
            })
        }
        next(error)
    }
}
