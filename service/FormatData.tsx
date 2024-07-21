  export const extractInfo =(node: any) => {
    let data = [];
    if (typeof node === "string" && node !== ".") {
      data.push(node);
    } else if (node.children) {
      node.children.map((i: any) => {
        data.push(extractInfo(i));
      });
    }
    return data.join("");
  };