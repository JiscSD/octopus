"use strict";const fs=require("fs"),fsPromises=require("fs").promises;module.exports.hook="core.fs",module.exports.load=({proxyMethod:e,report:r})=>{["open","openSync","readFile","readFileSync","writeFile","writeFileSync","appendFile","appendFileSync","rename","renameSync","copyFile","copyFileSync","unlink","unlinkSync","createReadStream","createWriteStream"].forEach((i=>{e(fs,i,(function({args:e,stack:o}){r({method:i,args:e},o)}))})),fsPromises&&["appendFile","copyFile","open","readFile","rename","unlink","writeFile"].forEach((i=>{e(fsPromises,i,(function({args:e,stack:o}){r({method:i,args:e},o)}))}))};