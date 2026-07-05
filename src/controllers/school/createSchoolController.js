import { createSchool, validateSchool } from "../../models/schoolModel.js"

export async function createSchoolsController(req, res, next){
    try{
        const school = req.body

        const {success, error, data} = validateSchool(school, {id: true})

        if(!success){
            return res.status(400).json({
                message: "Erro de validação",
                fieldErrors: error
            })
        }

        const result = await createSchool(data)

        return res.json({
            message: "Escola criada com sucesso!",
            school: result
        })
    }catch(error) {
        if(error.code === 'P2002' && error.message.includes("email")){
            console.log(error.message)
            return res.status(400).json({
                message: "Erro de validação",
                fieldErrors: {
                    email: ["O email já está em uso por outro usuário."]
                }
            })
        }

        next(error)
    }
}
