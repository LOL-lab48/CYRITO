const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

let trace = 0;
let hacking = false;
let timer;
let panicInterval;
let enemyGuessing = false;
let enemyGuessIndex = 0;
let enemyCurrentGuess = "";
let playerPassword = "";
let breachInProgress = false;

const passwordOptions = ["CYRITO", "HACKER", "FIREWALL", "ADMIN", "SECURE"];

const breachPuzzles = [
  {
    prompt: "Fix the syntax to unlock the firewall:\nconsole.log('FIREWALL BREACHED')",
    solution: "console.log('FIREWALL BREACHED');",
  },
  {
    prompt: "Fix this simple code:\nlet x = 10\nlet y = 20\nconsole.log(x + y)",
    solution: "let x = 10; let y = 20; console.log(x + y);",
  },
];

// Typing effect
function type(text, speed = 20) {
  return new Promise(resolve => {
    let i = 0;
    let line = document.createElement("div");
    terminal.appendChild(line);

    function typing() {
      if (i < text.length) {
        line.innerHTML += text[i];
        i++;
        setTimeout(typing, speed);
      } else {
        scroll();
        resolve();
      }
    }
    typing();
  });
}

function scroll() {
  terminal.scrollTop = terminal.scrollHeight;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Trace bar
function updateTrace(amount) {
  trace += amount;
  if (trace > 100) trace = 100;
  if (trace < 0) trace = 0;

  traceText.innerText = trace + "%";
  progress.style.width = trace + "%";

  if (trace >= 100 && !enemyGuessing) {
    startEnemyGuessing();
  }
}

// Enemy guesses player password
async function startEnemyGuessing() {
  enemyGuessing = true;
  hacking = false;
  clearInterval(timer);
  clearInterval(panicInterval);
  await type("\n!!! TRACE COMPLETE — ENEMY HACKER STARTS GUESSING YOUR PASSWORD !!!\n");

  enemyGuessIndex = 0;
  enemyCurrentGuess = "";

  while (enemyGuessIndex < playerPassword.length) {
    const guessChar = playerPassword[enemyGuessIndex];
    enemyCurrentGuess += guessChar;

    const hint = getHintEnemy(enemyCurrentGuess);
    await type(`Enemy guess: ${enemyCurrentGuess}  Hint: ${hint}`);

    enemyGuessIndex++;

    if (enemyCurrentGuess === playerPassword) {
      await type("\n!!! ENEMY HACKER SUCCESS — YOUR PASSWORD COMPROMISED !!!");
      await type("GAME OVER — RELOAD TO TRY AGAIN");
      input.disabled = true;
      return;
    }

    await sleep(1500);
  }
}

// Hint system for enemy
function getHintEnemy(guess) {
  let result = "";
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === playerPassword[i]) result += "✔ ";
    else if (playerPassword.includes(guess[i])) result += "~ ";
    else result += "✖ ";
  }
  return result;
}

// Trace timer
function startTimer() {
  timer = setInterval(() => updateTrace(2), 2000);

  panicInterval = setInterval(() => {
    if (!hacking) return;
    const spike = Math.random() < 0.3 ? Math.floor(Math.random() * 10) : 0;
    if (spike) {
      updateTrace(spike);
      terminal.classList.add("glitch");
      setTimeout(() => terminal.classList.remove("glitch"), 300);
      type("! TRACE DETECTED !", 30);
    }
  }, 7000);
}

// Select player password at start
async function choosePlayerPassword() {
  await type("Select your password to protect your system:");
  for (let i = 0; i < passwordOptions.length; i++) {
    await type(`${i + 1}: ${passwordOptions[i]}`);
  }
  await type("Type the number of your choice:");

  while (!playerPassword) {
    const choice = await promptUserInput();
    const num = Number(choice);
    if (num >= 1 && num <= passwordOptions.length) {
      playerPassword = passwordOptions[num - 1];
      await type(`Password set to: ${playerPassword}`);
      break;
    } else {
      await type("Invalid choice. Try again:");
    }
  }
}

function promptUserInput() {
  return new Promise(resolve => {
    function onEnter(e) {
      if (e.key === "Enter") {
        const val = input.value.trim();
        input.value = "";
        terminal.innerHTML += "> " + val + "<br>";
        input.removeEventListener("keydown", onEnter);
        resolve(val);
      }
    }
    input.addEventListener("keydown", onEnter);
  });
}

// Handle commands
async function handleCommand(cmd) {
  if (enemyGuessing) {
    if (cmd === "FIREWALL") {
      await startFirewallMiniGame();
    } else {
      await type("Enemy is guessing your password! Type 'FIREWALL' to stop them temporarily.");
    }
    return;
  }

  if (breachInProgress) {
    await handleBreachInput(cmd);
    return;
  }

  switch (cmd) {
    case "HELP":
      await type("Commands: HELP, SCAN, FIREWALL");
      break;
    case "SCAN":
      await type("Scanning target...");
      await type("Open ports found");
      await type("Vulnerability detected");
      updateTrace(5);
      break;
    case "FIREWALL":
      await startFirewallMiniGame();
      break;
    default:
      await type("Unknown command");
  }
  scroll();
}

// Firewall mini-game (easy)
async function startFirewallMiniGame() {
  breachInProgress = true;
  hacking = true;
  clearInterval(timer);
  clearInterval(panicInterval);

  const puzzle = breachPuzzles[Math.floor(Math.random() * breachPuzzles.length)];
  await type("FIREWALL ENGAGED — Solve the puzzle to delete enemy memory!");
  await type(puzzle.prompt);
  await type("Type the corrected code:");
}

// Handle firewall puzzle input
async function handleBreachInput(inputText) {
  const puzzle = breachPuzzles.find(p => inputText.trim() === p.solution);
  if (puzzle) {
    await type("Memory deleted — Trace reset. Enemy stopped!");
    trace = 0;
    updateTrace(0);
    breachInProgress = false;
    hacking = false;
    enemyGuessing = false;
    startTimer();
  } else {
    await type("Incorrect code. Try again!");
    updateTrace(10);
  }
}

// Boot sequence
async function boot() {
  await type("Booting CYRITO.exe...");
  await type("[OK] Core modules loaded");
  await type("[OK] Trace system active");
  await choosePlayerPassword();
  await type("Type 'HELP' to begin. Warning: Enemy hacker may trace you!");
  startTimer();
}

input.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    if (!cmd) return;
    await handleCommand(cmd.toUpperCase());
  }
});

boot();
