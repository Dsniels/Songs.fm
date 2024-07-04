import { action } from "@/types/action.type"
import sesionUsuarioReducer from "./SesionUsuario"
export const mainReducer = ({sesionUsuario } : any, action : action) =>{
    return{
        sesionUsuario : sesionUsuarioReducer(sesionUsuario, action)
    }
} 