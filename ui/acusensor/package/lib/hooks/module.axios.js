"use strict";module.exports.hook="httprequest",module.exports.load=({proxyMethod:t,report:e,emitInternal:r})=>{const o=require("module").prototype;t(o,"require",(function({args:r,stack:o,returnPassthrough:s}){if("axios"!==r[0])return!1;s((r=>(["get","post","put","patch","delete"].forEach((o=>{t(r,o,(({args:t,stack:r})=>{if("string"!=typeof t[0])return!1;e({request:{url:t[0],method:o.toUpperCase()},direction:"outgoing"},r)}))})),r)))}))};