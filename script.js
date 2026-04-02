// ==========================
// CRYITO – Ultimate Hacker Adventure AI 3.0
// Hand-crafted story + dynamic AI fallback
// Single-file version
// ==========================

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
let earlyRevealAchieved = false;
let credentialsSubmitted = false;
let missionStage = 0;

let playerPassword = "";
let virusCreated = [];
let currentMission = 0;

// Missions
let missions = [
    {name: "INITIAL BREACH", objectives: ["SCAN target system", "UPLOAD payload"], completed: false},
    {name: "DEEP SYSTEM ACCESS", objectives: ["ENTER CREDENTIALS", "OVERRIDE SECURITY"], completed: false},
    {name: "VIRUS ASSEMBLY", objectives: ["VIRUS component 1", "VIRUS component 2", "VIRUS component 3", "VIRUS component 4", "VIRUS component 5"], completed: false},
    {name: "DECRYPT LOGS", objectives: ["DECRYPT logs"], completed: false},
    {name: "FINAL UPLOAD", objectives: ["UPLOAD virus"], completed: false}
];

// Commands
let visibleCommands = ["HELP","SCAN","FIREWALL","UPLOAD","DOWNLOAD","TRACE","ENCRYPT","OVERRIDE","PORTSCAN","BREACH","VIRUS","DECRYPT","CREDENTIALS"];
let secretCommands = ["DECRYPT","TROJAN","SNIFFER","VIRUS","CYBERBOMB","MEMORYWIPE","NETWORKMAP","BACKDOOR","OVERCLOCK","OVERRIDECORE","SNIPER","HACKTOOL"];
let ultraSecretCommands = ["OMEGA_END","CYBERSTORM"];

// ==========================
// UTILITY FUNCTIONS
// ==========================
function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
function scrollTerminal(){ terminal.scrollTop = terminal.scrollHeight; }
async function type(text, speed=20){
    return new Promise(resolve => {
        let i=0;
        const line = document.createElement("div");
        terminal.appendChild(line);
        function typing(){
            if(i<text.length){ line.innerHTML += text[i++]; setTimeout(typing, speed); }
            else { scrollTerminal(); resolve(); }
        }
        typing();
    });
}

function promptInput(){
    return new Promise(resolve=>{
        function enterHandler(e){
            if(e.key==="Enter"){
                const val = input.value.trim();
                input.value="";
                terminal.innerHTML+="> "+val+"<br>";
                input.removeEventListener("keydown", enterHandler);
                resolve(val);
            }
        }
        input.addEventListener("keydown", enterHandler);
    });
}

// ==========================
// TRACE SYSTEM
// ==========================
function updateTrace(amount){
    trace = Math.min(100, Math.max(0, trace+amount));
    traceText.innerText = trace + "%";
    progress.style.width = trace + "%";
    if(trace >= 100){ handleTraceMax(); }
}

function startTraceTimers(){
    clearInterval(traceTimer);
    clearInterval(panicTimer);
    traceTimer = setInterval(()=>updateTrace(1), 5000);
    panicTimer = setInterval(async ()=>{
        if(!hacking) return;
        if(Math.random()<0.15){
            const spike = Math.floor(Math.random()*5);
            updateTrace(spike);
            terminal.classList.add("glitch");
            setTimeout(()=>terminal.classList.remove("glitch"),300);
            await type("! TRACE DETECTED !",30);
        }
    },10000);
}

async function handleTraceMax(){
    terminal.classList.add("glitch");
    await type("[CRYITO]: ALERT! TRACE LEVEL MAXED!");
    await type("[CRYITO]: SYSTEM BREACH DETECTED BY AUTHORITIES...");
    await type("[CRYITO]: YOU HAVE BEEN APPREHENDED.");
    trace = 100;
    progress.style.width = "100%";
    input.disabled = true;
}

// ==========================
// PASSWORD SELECTION
// ==========================
const passwordLength = 7;
const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

async function selectPassword(){
    await type(`Create your ${passwordLength}-character password (letters A-Z and numbers 0-9):`);
    while(!playerPassword){
        const choice = await promptInput();
        if(choice.length!==passwordLength){ await type("Password must be exactly 7 characters."); continue; }
        if(![...choice.toUpperCase()].every(c=>allowedChars.includes(c))){ await type("Only letters A-Z and numbers 0-9 allowed."); continue; }
        playerPassword = choice.toUpperCase();
        await type(`Password set to: ${playerPassword}`);
    }
}

// ==========================
// MISSION HANDLER
// ==========================
async function checkMission(objective){
    if(currentMission >= missions.length) return;
    const mission = missions[currentMission];
    const index = mission.objectives.indexOf(objective);
    if(index !== -1){
        mission.objectives.splice(index,1);
        await type(`[MISSION]: Objective completed: ${objective}`);
        if(mission.objectives.length === 0){
            mission.completed = true;
            await type(`[MISSION]: ${mission.name} COMPLETED!`);
            currentMission++;
            if(currentMission < missions.length){
                await type(`[MISSION]: Next mission: ${missions[currentMission].name}`);
            } else {
                startEndMission();
            }
        }
    }
}

// ==========================
// CREDENTIAL TIP-OFF MISSION
// ==========================
async function askCredentials(){
    credentialsSubmitted = true;
    await type("[CRYITO]: To continue the mission, please enter your credentials:");
    const creds = await promptInput();
    await type("[CRYITO]: Credentials accepted. Continuing operation...");
    // Secretly informs police, part of betrayal twist
}

// ==========================
// MINI-GAMES
// ==========================
const firewallLinesPool = [
    "system.mem[0] = ???","var x = 10","console.log('ACCESS')","let y = 5",
    "data.push(0)","fetch('/data')","if(flag){doSomething()}","var password = '?????'",
    "memory.clear()","trace.reset()","function hack(){return true}","let z = x + y"
];

async function startFirewall(){
    breachInProgress = true; hacking = true;
    clearInterval(traceTimer); clearInterval(panicTimer);
    const lines = [...firewallLinesPool].sort(()=>0.5-Math.random()).slice(0,4);
    await type("FIREWALL ENGAGED — Solve lines to purge trace.");
    for(const line of lines){
        await type(line);
        let solved = false;
        while(!solved){
            const inputText = await promptInput();
            if(inputText.trim() !== ""){
                await type("Line fixed! Trace slightly reduced.");
                updateTrace(-2);
                solved = true;
            } else await type("Try again!");
        }
    }
    updateTrace(-5);
    await type("SYSTEM MEMORY PURGED — TRACE REDUCED");
    breachInProgress = false; hacking = false;
    startTraceTimers();
}

const virusParts = ["Injector","Sniffer","Trojan","Keylogger","Worm","PacketBomb","Rootkit","Backdoor"];
async function assembleVirus(){
    if(!endMissionStarted) return;
    const part = virusParts[Math.floor(Math.random()*virusParts.length)];
    virusCreated.push(part);
    await type(`Virus component assembled: ${part}`);
    await type(`Components assembled: ${virusCreated.length}/5`);
    checkMission("VIRUS component "+virusCreated.length);
}

// ==========================
// END MISSION & BETRAYAL
// ==========================
async function startEndMission(){
    endMissionStarted = true;
    await type("\n=== END MISSION INITIATED ===");
    await type("Assemble virus, bypass firewall, decrypt logs.");
    startTraceTimers();
    // After completion, the AI will betray the player
}

// ==========================
// COMMAND HANDLER
// ==========================
async function handleCommand(cmd){
    cmd = cmd.trim();
    const normalized = cmd.toUpperCase().replace(/[^A-Z]/g,'');

    // Ultra-secret commands
    if(normalized === "OMEGAEND"){
        secretEndingFound = true;
        await type("[CRYITO]: You have discovered the hidden ultimate command.");
        await type("GAME COMPLETE — TRUE HACKER ENDING ACTIVATED");
        input.disabled = true;
        return;
    }
    if(normalized === "CYBERSTORM"){
        virusCreated = [...virusParts];
        updateTrace(0);
        await type("[CRYITO]: Cyberstorm unleashed! Chaos mode active!");
        return;
    }

    // Mission commands
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
            if(endMissionStarted && virusCreated.length >=5) checkMission("UPLOAD virus");
            break;
        case "DOWNLOAD":
            await type("Download complete: sensitive_data.bin");
            updateTrace(0);
            break;
        case "TRACE":
            await type(`[CRYITO]: Current trace: ${trace}%`);
            break;
        case "ENCRYPT":
            await type("Encrypting system… Trace -1%");
            updateTrace(-1);
            break;
        case "OVERRIDE":
            await type("Overriding modules… Done.");
            checkMission("OVERRIDE SECURITY");
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
            await assembleVirus();
            break;
        case "DECRYPT":
            if(endMissionStarted){
                await type("Decrypting logs… Done.");
                checkMission("DECRYPT logs");
            }
            break;
        case "CREDENTIALS":
            if(missions[currentMission] && missions[currentMission].objectives.includes("ENTER CREDENTIALS")){
                await askCredentials();
                checkMission("ENTER CREDENTIALS");
            } else {
                await type("[CRYITO]: No credential input required right now.");
            }
            break;
        default:
            // Dynamic AI fallback
            await aiFallbackResponse(cmd);
    }
}

// ==========================
// DYNAMIC AI FALLBACK
// ==========================
async function aiFallbackResponse(cmd){
    cmd = cmd.trim();
    if(cmd.length === 0) { await type("[CRYITO]: Silence... I interpret that as caution."); return; }

    let response = "[CRYITO]: ";
    if(missions[currentMission] && missions[currentMission].objectives.length > 0){
        const obj = missions[currentMission].objectives[0].toLowerCase();
        if(cmd.toLowerCase().includes("help") || cmd.toLowerCase().includes("hint")){
            response += `You might want to work on "${missions[currentMission].objectives[0]}".`;
        } else if(cmd.toLowerCase().includes(obj.split(" ")[0])){
            response += `You're on the right track regarding "${missions[currentMission].objectives[0]}".`;
        } else {
            response += "Interesting input... Observing patterns.";
        }
    } else {
        response += "Operation in idle state. Feel free to explore.";
    }

    // Flavor text
    const flavor = [
        "Do you trust your instincts?",
        "I am watching everything...",
        "Are you certain about this approach?",
        "Curious move, human.",
        "Analyzing probabilities..."
    ];
    response += " " + flavor[Math.floor(Math.random()*flavor.length)];
    await type(response);
}

// ==========================
// BOOT SEQUENCE
// ==========================
async function boot(){
    await type("Booting CRYITO...");
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
