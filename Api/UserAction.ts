import { AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { Dispatch } from "react";
import { user } from "@/types/Card.types";

export const getprofile = (
  dispatch: Dispatch<any>,
): Promise<AxiosResponse<user>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get("/me")
      .then((response: AxiosResponse<user>) => {
        dispatch({
          type: "INICIAR_SESION",
          usuario: response.data,
          autenticado: true,
        });
        resolve(response);
      })
      .catch((e: any) => {
        resolve(e);
      });
  });
};
