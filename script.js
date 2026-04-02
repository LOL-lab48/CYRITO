// CYRITO – Ultimate Hacker Adventure ULTRA-MAX 2.0
// Mission-focused, trace slowed, input clears automatically, improved gameplay

const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

// ==========================
// GAME STATE
// ==========================
let trace = 0;
let traceTimer;
let panicTimer;
let hacking = false;
let breachInProgress = false;
let endMissionStarted = false;
let secretEndingFound = false;
let missionStage = 0;

let playerPassword = "";
let enemyGuessIndex = 0;
let enemyCurrentGuess = [];

const passwordLength = 7;
const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// ==========================
// MISSIONS
// ==========================
let missions = [
  {name: "INITIAL BREACH", objectives: ["SCAN target system", "UPLOAD payload"], completed: false},
  {name: "VIRUS ASSEMBLY", objectives: ["VIRUS component 1", "VIRUS component 2", "VIRUS component 3", "VIRUS component 4", "VIRUS component 5"], completed: false},
  {name: "DECRYPT LOGS", objectives: ["DECRYPT logs"], completed: false},
  {name: "FINAL UPLOAD", objectives: ["UPLOAD virus"], completed: false}
];

let currentMission = 0;

// ==========================
// COMMANDS
// ==========================
let visibleCommands = [
  "HELP","SCAN","FIREWALL","UPLOAD","DOWNLOAD",
  "TRACE","ENCRYPT","OVERRIDE","PORTSCAN","BREACH","VIRUS","DECRYPT"
];

let hiddenCommands = [];
for(let i=1;i<=500;i++) hiddenCommands.push("CMD_"+i);

const secretCommands = [
  "DECRYPT","TROJAN","SNIFFER","VIRUS","CYBERBOMB","MEMORYWIPE",
  "NETWORKMAP","BACKDOOR","OVERCLOCK","OVERRIDECORE","SNIPER","HACKTOOL",
  "SYNFLOOD","BRUTEFORCE","KEYGEN","EXPLOIT","MALWARE","PHISH","LOGICBOMB",
  "PACKETINJECT","ROOTACCESS","WIRETAP","PROXYBYPASS","FIREWALLDISABLE",
  "PACKETSPLOIT","DATASNIFFER","SYSTEMDRAIN","BOOTOVERRIDE","FIREWALLOVERRIDE"
];

const ultraSecretCommands = ["OMEGA_END","CYBERSTORM"];

// ==========================
// FIREWALL & VIRUS
// ==========================
const firewallLinesPool = [
  "system.mem[0] = ???","var x = 10","console.log('ACCESS')","let y = 5",
  "data.push(0)","fetch('/data')","if(flag){doSomething()}","var password = '?????'",
  "memory.clear()","trace.reset()","function hack(){return true}","let z = x + y",
  "console.warn('SECURE')","data[0]=42","init();","unlock.system();","log('ENEMY')",
  "temp = 0","delete record[0]","ping();","readMemory();","encryptPacket();",
  "firewall.check()","verifyConnection();","deployTrap();","overwriteBoot();"
];

const virusParts = ["Injector","Sniffer","Trojan","Keylogger","Worm","PacketBomb","Rootkit","Backdoor"];
let virusCreated = [];

// ==========================
// UTILITY
// ==========================
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
function scrollTerminal(){terminal.scrollTop = terminal.scrollHeight;}
async function type(text,speed=20){
  return new Promise(resolve=>{
    let i=0;
    const line=document.createElement("div");
    terminal.appendChild(line);
    function typing(){
      if(i<text.length){line.innerHTML+=text[i++];setTimeout(typing,speed);}
      else{scrollTerminal();resolve();}
    }
    typing();
  });
}

// ==========================
// TRACE SYSTEM (SLOW)
// ==========================
function updateTrace(amount){
  trace=Math.min(100,Math.max(0,trace+amount));
  traceText.innerText=trace+"%";
  progress.style.width=trace+"%";
}

function startTraceTimers(){
  clearInterval(traceTimer); clearInterval(panicTimer);
  traceTimer=setInterval(()=>updateTrace(1),5000); // slowed down
  panicTimer=setInterval(()=>{
    if(!hacking) return;
    const spike = Math.random()<0.15?Math.floor(Math.random()*5):0; // reduced panic
    if(spike){
      updateTrace(spike);
      terminal.classList.add("glitch");
      setTimeout(()=>terminal.classList.remove("glitch"),300);
      type("! TRACE DETECTED !",30);
    }
  },10000);
}

// ==========================
// PASSWORD SELECTION
// ==========================
async function selectPassword(){
  await type(`Create your ${passwordLength}-character password (letters A-Z and numbers 0-9):`);
  while(!playerPassword){
    const choice=await promptInput();
    if(choice.length!==passwordLength){await type("Password must be exactly 7 characters.");continue;}
    if(![...choice.toUpperCase()].every(c=>allowedChars.includes(c))){await type("Only letters A-Z and numbers 0-9 allowed.");continue;}
    playerPassword=choice.toUpperCase();
    await type(`Password set to: ${playerPassword}`);
  }
}

// ==========================
// PROMPT INPUT (CLEARS INPUT BAR)
// ==========================
function promptInput(){
  return new Promise(resolve=>{
    function enterHandler(e){
      if(e.key==="Enter"){
        const val=input.value.trim();
        input.value=""; // clears input for next command
        terminal.innerHTML+="> "+val+"<br>";
        input.removeEventListener("keydown",enterHandler);
        resolve(val);
      }
    }
    input.addEventListener("keydown",enterHandler);
  });
}

// ==========================
// COMMAND HANDLING
// ==========================
async function handleCommand(cmd){
  cmd=cmd.toUpperCase();
  const normalized=cmd.replace(/[^A-Z]/g,'');

  // Ultra-secret commands
  if(normalized==="OMEGAEND"){
    secretEndingFound=true;
    await type("[CYRITO]: You have discovered the hidden ultimate command.");
    await type("GAME COMPLETE — TRUE HACKER ENDING ACTIVATED");
    input.disabled=true;
    return;
  }
  if(normalized==="CYBERSTORM"){
    virusCreated = [...virusParts];
    updateTrace(0);
    await type("[CYRITO]: Cyberstorm unleashed! Chaos mode active!");
    return;
  }

  // Mission progression commands
  switch(normalized){
    case "HELP":
      await type("Visible commands: "+visibleCommands.join(", "));
      await type("Use mission objectives to guide your commands.");
      break;
    case "SCAN":
      await type("Scanning target system… Open ports: 22, 80, 443…");
      updateTrace(1);
      checkMission("SCAN target system");
      break;
    case "UPLOAD":
      await type("Upload executed.");
      updateTrace(1);
      checkMission("UPLOAD payload");
      if(endMissionStarted && virusCreated.length>=5) checkMission("UPLOAD virus");
      break;
    case "DOWNLOAD":
      await type("Download complete: sensitive_data.bin");
      updateTrace(0);
      break;
    case "TRACE":
      await type(`Current trace: ${trace}%`);
      break;
    case "ENCRYPT":
      await type("Encrypting system… Trace -1%");
      updateTrace(-1);
      break;
    case "OVERRIDE":
      await type("Overriding modules… Done.");
      break;
    case "PORTSCAN":
      await type("Port scan complete. Trace +2%");
      updateTrace(2);
      break;
    case "BREACH":
      await type("Attempting system breach…");
      startEndMission();
      break;
    case "FIREWALL":
      await startFirewall();
      break;
    case "VIRUS":
      if(endMissionStarted){
        virusCreated.push(virusParts[Math.floor(Math.random()*virusParts.length)]);
        await type("Virus component assembled: "+virusCreated[virusCreated.length-1]);
        await type(`Components assembled: ${virusCreated.length}/5`);
        checkMission("VIRUS component "+virusCreated.length);
      }
      break;
    case "DECRYPT":
      if(endMissionStarted){
        await type("Decrypting logs… Done.");
        checkMission("DECRYPT logs");
      }
      break;
    default:
      if(hiddenCommands.includes(cmd)) await type("Command recognized: "+cmd+" (hidden tool)");
      else if(secretCommands.includes(cmd)) await type("Command executed: "+cmd);
      else await type("Unknown command. Type HELP for guidance.");
  }
}

// ==========================
// MISSION HANDLER
// ==========================
function checkMission(objective){
  if(currentMission>=missions.length) return;
  const mission = missions[currentMission];
  const index = mission.objectives.indexOf(objective);
  if(index!==-1){
    mission.objectives.splice(index,1);
    type(`[MISSION]: Objective completed: ${objective}`);
    if(mission.objectives.length===0){
      mission.completed=true;
      type(`[MISSION]: ${mission.name} COMPLETED!`);
      currentMission++;
      if(currentMission<missions.length){
        type(`[MISSION]: Next mission: ${missions[currentMission].name}`);
      }
    }
  }
}

// ==========================
// FIREWALL MINI-GAME
// ==========================
async function startFirewall(){
  breachInProgress=true; hacking=true;
  clearInterval(traceTimer); clearInterval(panicTimer);
  const lines=[...firewallLinesPool].sort(()=>0.5-Math.random()).slice(0,4);
  await type("FIREWALL ENGAGED — Solve lines to purge trace.");
  for(const line of lines){
    await type(line);
    let solved=false;
    while(!solved){
      const inputText=await promptInput();
      if(inputText.trim()!==""){
        await type("Line fixed! Trace slightly reduced.");
        updateTrace(-2);
        solved=true;
      } else await type("Try again!");
    }
  }
  updateTrace(-5);
  await type("SYSTEM MEMORY PURGED — TRACE REDUCED");
  breachInProgress=false; hacking=false;
  startTraceTimers();
}

// ==========================
// END MISSION
// ==========================
async function startEndMission(){
  endMissionStarted=true;
  await type("\n=== END MISSION INITIATED ===");
  await type("Assemble virus, bypass firewall, decrypt logs.");
  startTraceTimers();
}

// ==========================
// BOOT SEQUENCE
// ==========================
async function boot(){
  await type("Booting CYRITO...");
  await type("[OK] Core modules loaded");
  await type("[OK] Trace system active");
  await selectPassword();
  await type("Type 'HELP' to begin. Focus on mission objectives!");
  startTraceTimers();
}

// ==========================
// EVENT LISTENER
// ==========================
input.addEventListener("keydown", async e=>{
  if(e.key==="Enter"){
    const cmd=input.value.trim();
    if(!cmd) return;
    await handleCommand(cmd);
  }
});

// ==========================
// START GAME
// ==========================
boot();
