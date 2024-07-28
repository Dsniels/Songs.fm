<<<<<<< HEAD
import { childrenType} from "@/types/Card.types";

  export const extractInfo = (node: childrenType | string ) => {
    const data : Array<string> = [];
    
    
    if (typeof node === "string" && node !== ".") {
      data.push(node);
    } else if (typeof node !== "string" && node.children) {
      node.children.forEach((i) => {
        data.push(extractInfo(i));
      });
    }
    return data.join("");
  };
=======
import { annotationResponse } from "@/types/Card.types";

export const extractInfo = (node: annotationResponse | string) => {
  let data: Array<string> = [];

  if (typeof node === "string" && node !== ".") {
    data.push(node);
  } else if (typeof node !== "string" && node.children) {
    node.children.map((i: any) => {
      data.push(extractInfo(i));
    });
  }
  return data.join("");
};
>>>>>>> f8f3028746e285ca8831e21a03413370c401d43d
