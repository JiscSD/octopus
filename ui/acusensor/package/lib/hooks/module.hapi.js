"use strict";const framework="path-to-regexp";module.exports.hook="route",module.exports.load=({onBeforeRequire:e,proxyMethod:t,report:r,require:o})=>{e("@hapi/hapi",(()=>{const e=o("@hapi/hapi");t(e,"server",(({getReturnValue:e,stack:o})=>{process.nextTick((()=>{const p=e();try{p.table().forEach((({method:e,path:t})=>{if("string"!=typeof t||"string"!=typeof e)return!1;r({route:t,framework:framework,method:e.toUpperCase()},o)}))}catch(e){}t(p,"route",(e=>{const t=e.args;if("object"!=typeof t[0])return!1;const o=t[0],p=o.path,a=o.method;if("string"!=typeof p||"string"!=typeof a)return!1;r({route:p,framework:"hapi",method:a.toUpperCase()},e.stack)}))}))}))}))};