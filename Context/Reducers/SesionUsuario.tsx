import { action } from "@/types/action.type";

export const initialState = {
  usuario: {
    display_name: "",
    images: [{ url: "" }],
  },
};

const sesionUsuarioReducer = (state = initialState, action: action) => {
  switch (action.type) {
    case "INICIAR_SESION": {
      const { display_name, images } = action.usuario;

      return {
        ...state,
        usuario: {
          display_name,
          images,
        },
      };
    }

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
