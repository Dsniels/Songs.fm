import { action } from "@/types/action.type";

export const initialState ={ 
    usuario:{
        display_name : '',
        images : {},
},
    autenticado : false
}


const sesionUsuarioReducer = (state : object = initialState, action : action) =>{
    switch (action.type) {
        case 'INICIAR_SESION':
            const {display_name, images} : any = action.usuario;
            const imagen = images.length>0? images[1] : {}
            return{
                ...state,
                usuario : {
   
                    display_name,
                    images : imagen
                },
                autenticado : action.autenticado
            }
            
        case 'CERRAR_SESION':
            return {
                ...state,
                usuario : action.usuario,
                autenticado : action.autenticado
            }
            break;
        default:
            break;
    }
}


export default sesionUsuarioReducer;