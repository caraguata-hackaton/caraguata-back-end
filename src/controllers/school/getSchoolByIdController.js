import { getSchoolById } from "../../models/schoolModel.js";

export async function getSchoolByIdController(req, res){
    try {
        const id = +req.params.id

        const result = await getSchoolById(id)

        res.json({
            message: "Escola encontrada com sucesso",
            school: result
        })
    } catch (error) {
        if(error.code === 'P2025'){
            console.log(error.message)
            return res.status(404).json({
                message: `Escola não encontrada.`
            })
        }
    }
}