import { action } from "@/types/action.type";

export const initialState = {
  usuario: {
    display_name: "",
    images: {},
  }
  
};

const sesionUsuarioReducer = (state = initialState, action: action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      // skipcq: JS-0054
      const { display_name, images } = action.usuario;
      // skipcq: JS-0054
      const imagen = images.length>0? images[1] : []
     

      return {
        ...state,
        usuario: {
          display_name,
          images: imagen,
        }
      };
  

    case "CERRAR_SESION":
      return {
        ...state,
        usuario: action.usuario,
      };
    default: {
      break;
    }
  }
};

export default sesionUsuarioReducer;
