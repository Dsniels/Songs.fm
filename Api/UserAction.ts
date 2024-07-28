import { AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { Dispatch } from "react";
import { user } from "@/types/Card.types";

export const getprofile = (
  dispatch: Dispatch<any>,
): Promise<AxiosResponse<user>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get("/me")
<<<<<<< HEAD
      .then((response: AxiosResponse) => {
=======
      .then((response: AxiosResponse<user>) => {
>>>>>>> f8f3028746e285ca8831e21a03413370c401d43d
        dispatch({
          type: "INICIAR_SESION",
          usuario: response.data,
        });
        resolve(response);
      })
      .catch(resolve);
  });
};
