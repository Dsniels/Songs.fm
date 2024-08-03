import { childrenType } from "@/types/Card.types";

export const extractInfo = (node: childrenType | string) => {
  const data: Array<string> = [];

  if (typeof node === "string" && node !== " ") {
    data.push(node.trim());
  } else if (typeof node !== "string" && node.children) {
    node.children.forEach((i) => {
      data.push(extractInfo(i).trim());
    });
  }
  return data.join("");
};
