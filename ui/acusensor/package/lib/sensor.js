"use strict";
const showHelp=()=>{process.stdout.write("\nUsage: \n  node sensor.js userscript.js [arguments]\n\nEnvironment variables:\n  SENSOR_BRIDGE   bridge endpoint\n")};
(process.argv.length<2||process.argv.includes("--help"))&&(showHelp(),
	process.exit(1));
const fs=require("fs"),
	path=require("path"),
	os=require("os"),
	Log=require("./classes/Logger").logger("main");
Log.on("message",
	Log.output.stdout.full);
const packageJSONPath=path.join(__dirname,
	"..",
	"package.json");
let SensorBridge=process.env.SENSOR_BRIDGE||process.env.SENSOR_AGENT||"",
	SensorVersion="";
try{if(!SensorBridge){const e=JSON.parse(fs.readFileSync(packageJSONPath).toString());
e.sensoragent&&e.sensoragent.startsWith("http")&&(SensorBridge=e.sensoragent.trim()),
	SensorVersion=`node-${parseInt(e.version)}`}}catch(e){}const si=require("./classes/ScriptInspector"),
	bridge=require("./classes/BridgeConnection").connect(SensorBridge,
	{options:{version:SensorVersion}});
bridge.on("notifyfail",
	(e=>{bridge.pauseNotifications()&&Log.info(`Bridge notifications paused. (Reason: ${JSON.stringify(e)})`)}));
const handleDiscovery=e=>{e.location||(e.location={path:"/",
	line:0,
	stack:""}),
	bridge.notify(e),
	process.env.DumpSensorIO?process.stderr.write(JSON.stringify(e)+"\n"):Log.debug(e.event,
	e.data)};
si.create({nodeExecutable:process.argv[0],
	scriptPath:"../server.js",
	scriptArgs:Array.from(process.argv).splice(3)}).then((e=>{e.on("discovery",
	(({type:e,
	data:s,
	location:o,
	additional:r})=>{handleDiscovery({event:e,
	location:o,
	data:s,
	additional:r})})),
	e.on("scanid",
	(e=>{bridge.setScanId(e)})),
	e.on("sensorpassword",
	(e=>{SensorBridge.endsWith(e)||(Log.warn("Sensor token mismatch"),
	bridge.resetScanId())})),
	e.on("sensorrequest",
	(()=>{bridge.resumeNotifications()&&Log.info("Bridge notifications resumed.")})),
	e.on("sensorquery",
	(s=>{switch(s){case"filelist":const s=e.getDiscoveredPaths();
handleDiscovery({event:"File_List",
	data:s});
break;
case"packages":const o=[],
	r=Array.from(e.getDiscoveredModules()),
	n=Array.from(e.getDeclaredModules());
r.forEach((e=>{o.push(e)})),
	n.forEach((e=>{if(o.includes(e))return!1;
o.push(e)})),
	handleDiscovery({event:"Packages",
	data:o,
	additional:["npm"]});
break;
case"aspectalerts":{const s=e.getDiscoveredConfig();
handleDiscovery({event:"Aspect_Alerts",
	data:s});
break}case"sysinfo":{const s=[];
"function"==typeof os.arch&&s.push(`os.arch=${os.arch()}`),
	"function"==typeof os.release&&s.push(`os.version=${os.release()}`),
	"function"==typeof os.type&&s.push(`os.name=${os.type()}`);
const o=Array.from(e.getDeclaredModules()),
	r=e.getKnownWebServers();
let n=null;
for(let e=0;
e<r.length;
e++){const s=r[e];
for(let e=0;
e<o.length;
e++){const r=o[e];
if(r.startsWith(`${s}@`)){n=r;
break}}if(n)break}if(s.push(`webserver.info=${n||"unknown"}`),
	"string"==typeof process.version){let e=process.version.split(".")[0];
e.startsWith("v")&&(e=e.substr(1)),
	s.push(`framework.version=${e}`)}handleDiscovery({event:"Sys_Info",
	data:s});
break}case"routes":Object.entries(e.getGroupedRoutes()).forEach((([e,
	s])=>{handleDiscovery({event:"Routes",
	data:s,
	additional:[e]})}))}})),
	e.on("moduleloaded",
	(({name:e,
	version:s},
	o)=>{Log.debug(`Loaded dependency ${e}@${s}`)}))}));
