import { getAuthenticatedUserContext } from '../models/authContextModel.js'

export function requireRole(...allowedRoles) {
  return async function roleMiddleware(req, res, next) {
    try {
      const userId = res.locals.userId

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const user = await getAuthenticatedUserContext(userId)

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: 'Você não tem permissão para acessar este recurso.'
        })
      }

      res.locals.user = user
      return next()
    } catch (error) {
      if (error.message === 'Usuário não encontrado.') {
        return res.status(401).json({ message: error.message })
      }
      return next(error)
    }
  }
}
