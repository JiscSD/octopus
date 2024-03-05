export interface Parameters {
  name: string;
  required: boolean;
  dataType: "string" | "array (string)";
  parameterType: "path" | "query";
  desscription: "string";
}
