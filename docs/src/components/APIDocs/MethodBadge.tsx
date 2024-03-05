import React from "react";

import * as Types from "@/types";

type Props = {
  method: Types.HTTPMethod;
};

const MethodBadge: React.FC<Props> = (props): React.ReactElement => (
  <span className={`method-badge operation-${props.method.toLowerCase()}`}>
    {props.method}
  </span>
);

export default MethodBadge;
