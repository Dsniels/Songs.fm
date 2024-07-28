import { action } from "@/types/action.type";

export const initialState = {
  usuario: {
    display_name: "",
<<<<<<< HEAD
    images: {},
  }
  
=======
    images: [{ url: "" }],
  },
>>>>>>> f8f3028746e285ca8831e21a03413370c401d43d
};

const sesionUsuarioReducer = (state = initialState, action: action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      const { display_name, images } = action.usuario;
<<<<<<< HEAD
      const imagen = images.length>0? images[1] : []
     
=======

>>>>>>> f8f3028746e285ca8831e21a03413370c401d43d
      return {
        ...state,
        usuario: {
          display_name,
          images: imagen,
        }
      };
<<<<<<< HEAD
  
    
=======
>>>>>>> f8f3028746e285ca8831e21a03413370c401d43d

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
