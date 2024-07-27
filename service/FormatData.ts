import { annotationResponse } from "@/types/Card.types";

  export const extractInfo =(node: annotationResponse) => {
    let data : Array<string> = [];
    
    if (typeof node === "string" && node !== ".") {
      data.push(node);
    } else if (node.children) {
      node.children.map((i: any) => {
        data.push(extractInfo(i));
      });
    }
    return data.join("");
  };
