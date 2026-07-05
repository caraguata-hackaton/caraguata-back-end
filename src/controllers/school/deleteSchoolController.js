import {validateSchool, deleteSchool} from "../../models/schoolModel.js";

export async function deleteSchoolController(req, res, next){
    try{
        const id = req.params.id

        const {success, error, data} = validateSchool({id: +id}, { name: true, address: true })

        if(!success){
            return res.status(400).json({
                message: "Erro de validação",
                fieldErrors: error
            })
        }

        const result = await deleteSchool(data.id)

        return res.json({
            message: "Escola deletada com sucesso!",
            user: result
        })
    }catch(error) {
        if(error.code === 'P2025'){
            console.log(error.message)
            return res.status(404).json({
                message: `Escola não encontrada para ser deletada.`
            })
        }
        next(error)
    }
}