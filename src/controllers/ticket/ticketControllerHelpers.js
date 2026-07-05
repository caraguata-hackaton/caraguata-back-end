import { flattenError, ZodError } from 'zod'

export function sendValidationError(res, error) {
  const flattened = flattenError(error)
  return res.status(400).json({
    message: 'Erro de validação',
    fieldErrors: flattened.fieldErrors,
    formErrors: flattened.formErrors
  })
}

export function handleTicketError(error, res, next) {
  if (error instanceof ZodError) return sendValidationError(res, error)

  const statusByMessage = {
    'Usuário não está vinculado a nenhuma escola.': 403,
    'Você não tem permissão para acessar este recurso.': 403,
    'Categoria inválida.': 400,
    'Chamado não encontrado.': 404,
    'Usuário não encontrado.': 401
  }

  const status = statusByMessage[error.message]
  if (status) return res.status(status).json({ message: error.message })

  if (error.code === 'P2002') {
    return res.status(400).json({ message: 'Já existe um registro com estes dados.' })
  }

  return next(error)
}
