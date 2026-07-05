import {getSchools} from "../../models/schoolModel.js";

export async function getSchoolsController(req, res){
    const {name} = req.query

    const result = await getSchools(name)

    res.json({
        message: "Escolas listadas com sucesso",
        users: result
    })
}