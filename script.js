const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

let level = Number(localStorage.getItem("level")) || 1;
let trace = 0;
let currentPassword = "";
let hacking = false;
let timer;

// Password pools
const words = ["ACCESS", "LOGIN", "SERVER", "ADMIN"];
const hacker = ["A7X9Q", "Z3R0D", "9KLM2"];

// Typing effect
function type(text, speed = 20) {
return new Promise(resolve => {
let i = 0;
let line = document.createElement("div");
terminal.appendChild(line);

```
function typing() {
  if (i < text.length) {
    line.innerHTML += text[i];
    i++;
    setTimeout(typing, speed);
  } else {
    resolve();
  }
}
typing();
```

});
}

function scroll() {
terminal.scrollTop = terminal.scrollHeight;
}

// Trace system
function updateTrace(amount) {
trace += amount;
if (trace > 100) trace = 100;

traceText.innerText = trace + "%";
progress.style.width = trace + "%";

if (trace >= 100) {
type("!!! TRACE COMPLETE — ACCESS DENIED !!!");
input.disabled = true;
clearInterval(timer);
}
}

// Timer pressure
function startTimer() {
timer = setInterval(() => {
updateTrace(2);
}, 2000);
}

// Set password
function setPassword() {
if (level < 4) {
currentPassword = words[Math.floor(Math.random() * words.length)];
} else {
currentPassword = hacker[Math.floor(Math.random() * hacker.length)];
}
}

// Hint system
function getHint(guess) {
let result = "";
for (let i = 0; i < currentPassword.length; i++) {
if (guess[i] === currentPassword[i]) {
result += "✔ ";
} else if (currentPassword.includes(guess[i])) {
result += "~ ";
} else {
result += "✖ ";
}
}
return result;
}

// Commands
async function handleCommand(cmd) {
if (cmd === "help") {
await type("Commands: help, scan, breach");
}

else if (cmd === "scan") {
await type("Scanning target...");
await type("Open ports found");
await type("Vulnerability detected");
}

else if (cmd === "breach") {
hacking = true;
setPassword();
await type("Initiating breach...");
await type("Enter password (" + currentPassword.length + " chars)");
startTimer();
}

else if (hacking) {
if (cmd === currentPassword) {
await type("ACCESS GRANTED ✅");
level++;
localStorage.setItem("level", level);
hacking = false;
trace = 0;
updateTrace(0);
clearInterval(timer);
await type("Level Up → " + level);
} else {
await type("ACCESS DENIED ❌");
await type(getHint(cmd));
updateTrace(15);
}
}

else {
await type("Unknown command");
}

scroll();
}

// Input listener
input.addEventListener("keydown", async (e) => {
if (e.key === "Enter") {
const cmd = input.value.toUpperCase();
terminal.innerHTML += "> " + cmd + "<br>";
input.value = "";
await handleCommand(cmd);
}
});

// Boot sequence
async function boot() {
await type("Booting CYRITO.exe...");
await type("[OK] Core modules loaded");
await type("[OK] Trace system active");
await type("Type 'help' to begin");
}

boot();

