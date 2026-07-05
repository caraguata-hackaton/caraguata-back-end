import {getAuthenticatedUser} from '../../models/userModel.js'

export async function getMeController(req, res, next) {
    try {
        const userId = res.locals.userId

        if (!userId) {
            return res.status(401).json({
                message: 'Usuário não autenticado.',
            })
        }

        const user = await getAuthenticatedUser(userId)

        if (!user) {
            return res.status(401).json({
                message: 'Usuário não encontrado.',
            })
        }

        return res.status(200).json({
            user,
            school: user.school,
        })
    } catch (error) {
        if (error.message === 'Usuário não encontrado.') {
            return res.status(401).json({ message: error.message })
        }
        return next(error)
    }
}
