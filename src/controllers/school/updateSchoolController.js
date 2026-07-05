import {updateSchool, validateSchool} from "../../models/schoolModel.js";

export async function updateSchoolController(req, res, next) {
    try{
        const {id} = req.params
        const school = req.body

        const {success, error, data} = validateSchool({id: +id, name: school.name}, {address: true})

        if(!success){
            return res.status(400).json({
                message: "Erro de validação",
                fieldErrors: error
            })
        }

        const result = await updateSchool(data, data.id)

        return res.json({
            message: "Escola atualizada com sucesso!",
            publication: result
        })
    }catch(error) {
        if(error.code === 'P2025'){
            console.log(error.message)
            return res.status(404).json({
                message: "Escola não encontrada para ser atualizada."
            })
        }
        next(error)
    }
}