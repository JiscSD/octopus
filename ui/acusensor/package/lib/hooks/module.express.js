"use strict";function asyncGeneratorStep(t,e,r,o,s,n,a){try{var c=t[n](a),i=c.value}catch(t){return void r(t)}c.done?e(i):Promise.resolve(i).then(o,s)}function _asyncToGenerator(t){return function(){var e=this,r=arguments;return new Promise((function(o,s){var n=t.apply(e,r);function a(t){asyncGeneratorStep(n,o,s,a,c,"next",t)}function c(t){asyncGeneratorStep(n,o,s,a,c,"throw",t)}a(void 0)}))}}module.exports.hook="route",module.exports.packageNames=["express"];const framework="path-to-regexp",extractRouteArg=t=>{const e=[];return"string"==typeof t||t instanceof RegExp?e.push(t):"object"==typeof t&&t instanceof Array&&t.forEach((t=>{e.push(t)})),e},ExpressStaticPathRef=Symbol("ExpressStaticPathRef"),ExpressStaticOptions=Symbol("ExpressStaticOptions");module.exports.load=({onBeforeRequire:t,require:e,report:r,proxyMethod:o})=>{t("express",(()=>{const t=e("express");["delete","get","head","options","patch","post","put"].forEach((e=>{o(t.application,e,(({args:t,stack:o})=>{if("function"!=typeof t[1])return!1;const s=e.toUpperCase();extractRouteArg(t[0]).forEach((t=>{t instanceof RegExp?r({route:t.toString(),framework:"regex",method:s},o):r({route:t,framework:framework,method:s},o)}))}))})),o(t.application,"use",(({args:t,stack:e})=>{const s=(()=>{for(let e=0;e<=1;e++)if("function"==typeof t[e]&&t[e][ExpressStaticPathRef]){let r="string"==typeof t[0]?t[0]:"/";return r.endsWith("/")&&(r=r.substr(0,r.length-1)),{fsPath:t[e][ExpressStaticPathRef],webPath:r,options:t[e][ExpressStaticOptions]}}return null})();if(null!==s)return void n(s,e);if("string"!=typeof t[0])return;let a=t[0];if("/"!==a&&a.endsWith("/")&&(a=a.substr(0,a.length-1)),r({route:a,framework:framework,method:"GET"},e),"function"==typeof t[1]&&t[1].prototype&&t[1].prototype.constructor&&"router"===t[1].prototype.constructor.name){const e=t[1];o(e,"route",(t=>{const e=t.args;extractRouteArg(e[0]).forEach((e=>{if("string"!=typeof e)return!1;e.startsWith("/")||(e="/"+e);r({route:`${a}${e}`,framework:framework,method:"GET"},t.stack)}))}))}})),o(t,"static",(({args:t,stack:e,returnPassthrough:r})=>{r((e=>(e[ExpressStaticPathRef]=t[0],e[ExpressStaticOptions]="object"==typeof t[1]?t[1]:{},e)))}))}));const s=(t,r)=>{const o=e("util").promisify,s=e("path").resolve,n=e("fs"),a=o(n.readdir),c=o(n.stat);function i(t){return p.apply(this,arguments)}function p(){return p=_asyncToGenerator((function*(t){const e=yield a(t),r=yield Promise.all(e.map((o=_asyncToGenerator((function*(e){const r=s(t,e);return(yield c(r)).isDirectory()?i(r):r})),function(t){return o.apply(this,arguments)})));var o;return r.reduce(((t,e)=>t.concat(e)),[])})),p.apply(this,arguments)}i(t).then((t=>{r(t)})).catch((t=>{r([])}))},n=({fsPath:t,webPath:o,options:n},a)=>{e("fs");const c=e("path");((t,r=(()=>{}))=>{const o=e("fs");o.access(t,o.constants.F_OK,(e=>{if(e)return r(!1);o.stat(t,((t,e)=>t?r(!1):e.isDirectory()?void r(!0):r(!1)))}))})(t,(e=>{e&&s(t,(e=>{e.forEach((e=>{let s=e.substr(t.length);s=s.split(c.sep).join("/"),s=o+s,r({route:s,framework:"express-static",method:"GET"},a)}))}))}))}};