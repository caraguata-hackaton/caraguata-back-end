import { z } from 'zod'

function getOptions(options) {
  const result = z.array(z.object({
    label: z.string(),
    value: z.string()
  })).safeParse(options)

  return result.success ? result.data : []
}

function booleanSchema(label) {
  return z.preprocess((value) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  }, z.boolean({ error: `${label} deve ser verdadeiro ou falso.` }))
}

function createFieldSchema(field) {
  let schema

  if (field.type === 'TEXT') {
    schema = z.string().trim().min(1, `${field.label} é obrigatório.`).max(255, `${field.label} deve ter no máximo 255 caracteres.`)
  } else if (field.type === 'TEXTAREA') {
    schema = z.string().trim().min(1, `${field.label} é obrigatório.`).max(2000, `${field.label} deve ter no máximo 2000 caracteres.`)
  } else if (field.type === 'NUMBER') {
    schema = z.coerce.number({ error: `${field.label} deve ser um número.` })
  } else if (field.type === 'BOOLEAN') {
    schema = booleanSchema(field.label)
  } else if (field.type === 'DATE') {
    schema = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: `${field.label} deve ser uma data válida.`
    })
  } else if (field.type === 'SELECT') {
    const values = getOptions(field.options).map((option) => option.value)
    schema = z.string().refine((value) => values.includes(value), {
      message: `Opção inválida para ${field.label}.`
    })
  } else {
    schema = z.unknown()
  }

  return field.required ? schema : schema.optional().nullable()
}

export function createDynamicFieldsSchema(fields) {
  const shape = {}

  for (const field of fields) {
    shape[field.name] = createFieldSchema(field)
  }

  return z.object(shape).strict()
}
