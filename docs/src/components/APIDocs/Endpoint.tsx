import React from "react";

import * as Interfaces from "@/interfaces";
import * as Types from "@/types";

import MethodBadge from "./MethodBadge";

type Props = {
  method: Types.HTTPMethod;
  path: string;
  description: string;
  authorization: Types.Authorization;
  parameters?: Interfaces.Parameters;
};

const Endpoint: React.FC<Props> = (props): React.ReactElement => {
  return (
    <section>
      <h3>
        <MethodBadge method={props.method} /> <code>{props.path}</code>
      </h3>
      <p>{props.description}</p>
      <p>Authorization: {props.authorization}</p>
      {props.parameters && (
        <>
          <table>
            <caption>Parameters</caption>
            <tbody></tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default Endpoint;
