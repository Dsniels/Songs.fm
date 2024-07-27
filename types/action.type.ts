import { user } from "./Card.types";

export type action = {
  type: "INICIAR_SESION" | "CERRAR_SESION";
  usuario: user;
};
