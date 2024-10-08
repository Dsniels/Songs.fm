import { AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { Dispatch } from "react";
import { user } from "@/types/Card.types";

export const getprofile = (
  // skipcq: JS-0323
  dispatch: Dispatch<any>,
): Promise<AxiosResponse<user>> => {
  return new Promise((resolve, _) => {
    HttpCliente.get("/me")
      .then((response: AxiosResponse) => {

        dispatch({
          type: "INICIAR_SESION",
          usuario: response.data,
        });
        resolve(response);
      })
      .catch(resolve);
  });
};
