// Terminal state management
let terminalStates = {
  about: {
    isWaitingForPassword: false,
    currentCommand: null,
    commandHistory: [],
    historyIndex: -1,
    currentInput: ''
  },
  education: {
    isWaitingForPassword: false,
    currentCommand: null,
    commandHistory: [],
    historyIndex: -1,
    currentInput: ''
  },
  projects: {
    isWaitingForPassword: false,
    currentCommand: null,
    commandHistory: [],
    historyIndex: -1,
    currentInput: ''
  },
  contact: {
    isWaitingForPassword: false,
    currentCommand: null,
    commandHistory: [],
    historyIndex: -1,
    currentInput: ''
  }
};

let currentTab = 'about';
let isTyping = false; // Flag to prevent multiple typing animations

// Typewriter effect function
function typeCommand(command, tabName, callback) {
  if (isTyping) return; // Prevent multiple typing animations
  
  isTyping = true;
  
  // Find the current input element (it's dynamically created)
  const terminalInput = document.querySelector('.terminal-input-line .terminal-input');
  if (!terminalInput) {
    isTyping = false;
    return;
  }
  
  let currentIndex = 0;
  const typeSpeed = 15; // milliseconds per character (faster typing)
  
  function typeNextChar() {
    if (currentIndex < command.length) {
      terminalInput.value = command.substring(0, currentIndex + 1);
      updateBlockCursor(terminalInput, tabName);
      currentIndex++;
      setTimeout(typeNextChar, typeSpeed);
    } else {
      // Typing complete, execute command after a short pause
      setTimeout(() => {
        isTyping = false;
        if (callback) callback();
      }, 300); // Small pause before executing
    }
  }
  
  // Start typing
  terminalInput.value = '';
  typeNextChar();
}

// Interactive terminal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize only the 'about' terminal
  initializeTerminal('about');

  // Terminal starts empty - no auto-loading

  // Add event listeners for left nav
  document.querySelectorAll('.vertical-nav li').forEach(item => {
    item.addEventListener('click', function() {
      // Remove active from all
      document.querySelectorAll('.vertical-nav li').forEach(li => li.classList.remove('active'));
      this.classList.add('active');
      // Always use the 'about' terminal
      let cmd = this.getAttribute('data-command');
      let commandToRun = '';
      if (cmd === 'experience') {
        commandToRun = 'cat resume/experience.txt';
      } else if (cmd === 'education') {
        commandToRun = 'cat resume/education.txt';
      } else if (cmd === 'skills') {
        commandToRun = 'cat resume/skills.txt';
      } else if (cmd === 'contact') {
        commandToRun = 'cat resume/contact.txt';
      }
      if (commandToRun) {
        // Use typewriter effect instead of direct execution
        typeCommand(commandToRun, 'about', () => {
          handleCommandInput(commandToRun, 'about');
        });
      }
      // Focus input
      setTimeout(() => {
        const terminalInput = document.getElementById('terminal-input-about');
        if (terminalInput) {
          terminalInput.focus();
          updateBlockCursor(terminalInput, 'about');
        }
      }, 100);
    });
  });
});

function initializeTerminal(tabName) {
  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  
  if (terminalOutput) {
    // Show initial console command
    showConsoleCommand(tabName);
    
    // Create initial input line
    createInputLine();
  }
}

// Create block cursor element
function createBlockCursor(inputElement, tabName) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-block';
  cursor.id = `block-cursor-${tabName}`;
  inputElement.parentElement.style.position = 'relative';
  inputElement.parentElement.appendChild(cursor);
  updateBlockCursor(inputElement, tabName);
}

// Update block cursor position
function updateBlockCursor(inputElement, tabName) {
  const cursor = document.getElementById(`block-cursor-${tabName}`);
  if (cursor && inputElement) {
    // Get the prompt element to measure its width
    const promptElement = inputElement.parentElement.querySelector('.prompt');
    const promptWidth = promptElement ? promptElement.offsetWidth : 0;
    
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.font = window.getComputedStyle(inputElement).font;
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.textContent = inputElement.value.substring(0, inputElement.selectionStart);
    
    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    
    // Position the cursor after the prompt and text
    cursor.style.left = (promptWidth + textWidth + 8) + 'px';
    cursor.style.top = '0px';
  }
}

// Show console command prompt
function showConsoleCommand(tabName) {
  // This function is now handled by createInputLine
  // The prompt is created when the input line is created
}

// Utility to check and update terminal centering
function updateTerminalCentering() {
  const terminalOutput = document.getElementById('terminal-output-about');
  if (!terminalOutput) return;
  
  // Remove any existing centering spacers first
  const existingSpacers = terminalOutput.querySelectorAll('.centering-spacer');
  existingSpacers.forEach(spacer => spacer.remove());
  
  // Force a reflow to get accurate measurements
  terminalOutput.offsetHeight;
  
  // Only center if the ONLY child is a .terminal-input-line and it is NOT a password prompt
  const children = Array.from(terminalOutput.children);
  const hasOnlyInputLine =
    children.length === 1 &&
    children[0].classList.contains('terminal-input-line') &&
    !children[0].innerHTML.includes('[sudo] password for user:');
  
  if (hasOnlyInputLine) {
    terminalOutput.style.transition = 'none';
    terminalOutput.classList.add('centered');
    setTimeout(() => {
      terminalOutput.style.transition = '';
    }, 50);
  } else {
    terminalOutput.classList.remove('centered');
  }
}

// Call after every output/input change
function handleCommandInput(command, tabName) {
  if (isTyping) return; // Prevent execution during typing animation
  
  addUserInputLine('user@portfolio:~$', command, tabName);
  if (command.trim() !== '') {
    addToHistory(command, tabName);
  }
  if (commandNeedsPassword(command)) {
    terminalStates[tabName].isWaitingForPassword = true;
    terminalStates[tabName].currentCommand = command;
    showPasswordPrompt(tabName);
  } else {
    processCommand(command, tabName);
    createInputLine();
  }
  updateTerminalCentering();
}

function addOutputLine(text, type, tabName) {
  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  if (terminalOutput) {
    const outputLine = document.createElement('div');
    outputLine.className = `output-line ${type}`;
    outputLine.innerHTML = text;
    terminalOutput.appendChild(outputLine);
    setTimeout(() => {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 0);
    updateTerminalCentering();
  }
}

function addUserInputLine(prompt, inputValue, tabName) {
  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  if (terminalOutput) {
    const inputLine = document.createElement('div');
    inputLine.className = 'user-input-line';
    if (inputValue) {
      inputLine.innerHTML = `<span class="prompt">${prompt}</span> <span class="input-text">${inputValue}</span>`;
    } else {
      inputLine.innerHTML = `<span class="prompt">${prompt}</span>`;
    }
    terminalOutput.appendChild(inputLine);
    setTimeout(() => {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 0);
    updateTerminalCentering();
  }
}

// On clear, immediately create a new input line after clear
function processCommand(command, tabName) {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand === 'clear') {
    const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
    if (terminalOutput) {
      terminalOutput.innerHTML = '';
    }
    // Reset password and command state BEFORE creating new input line
    terminalStates[tabName].isWaitingForPassword = false;
    terminalStates[tabName].currentCommand = null;
    // Immediately create a new input line after clear (always normal prompt)
    createInputLine(true); // pass true to force normal prompt
    return; // Prevent further output after clear
  } else if (lowerCommand === 'cat resume/experience.txt' || lowerCommand === 'cat experience.txt') {
    // Display experience content from external file
    addOutputLine(formatExperienceContent(), 'normal', tabName);
  } else if (lowerCommand === 'cat resume/education.txt' || lowerCommand === 'cat education.txt') {
    // Display education content from external file
    addOutputLine(formatEducationContent(), 'normal', tabName);
  } else if (lowerCommand === 'cat resume/skills.txt' || lowerCommand === 'cat skills.txt') {
    // Display skills content from external file
    addOutputLine(formatSkillsContent(), 'normal', tabName);
  } else if (lowerCommand === 'cat resume/projects.txt' || lowerCommand === 'cat projects.txt') {
    // Display projects content from external file
    addOutputLine(formatProjectsContent(), 'normal', tabName);
  } else if (lowerCommand === 'cat resume/contact.txt' || lowerCommand === 'cat contact.txt') {
    // Display contact content from external file
    addOutputLine(formatContactContent(), 'normal', tabName);
  } else if (command.trim() !== '') {
    // Unknown command
    addOutputLine(`bash: ${command}: command not found`, 'error', tabName);
  }
}

// Show password prompt in the input line
function showPasswordPrompt(tabName) {
  // Remove any existing input line
  const oldInputLine = document.querySelector('.terminal-input-line');
  if (oldInputLine) oldInputLine.remove();

  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  const inputLine = document.createElement('div');
  inputLine.className = 'terminal-input-line';
  inputLine.innerHTML = '<span class="prompt">[sudo] password for user:</span> <input type="password" class="terminal-input" placeholder="" autocomplete="off">';
  terminalOutput.appendChild(inputLine);

  const terminalInput = inputLine.querySelector('.terminal-input');
  terminalInput.focus();

  terminalInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const input = this.value.trim();
      this.value = '';
      handlePasswordInput(input, tabName);
    }
  });
}

// Handle password input
function handlePasswordInput(password, tabName) {
  // Show the password that was entered (as asterisks)
  const asterisks = '*'.repeat(password.length);
  addUserInputLine('[sudo] password for user:', asterisks, tabName);
  // Show incorrect password message
  addOutputLine('Incorrect Password', 'error', tabName);
  // Reset state
  terminalStates[tabName].isWaitingForPassword = false;
  terminalStates[tabName].currentCommand = null;
  // After password attempt, always create a new normal input line
  createInputLine(true);
}

// Check if command needs password
function commandNeedsPassword(command) {
  const lowerCommand = command.toLowerCase();
  return lowerCommand.startsWith('sudo ') ||
         lowerCommand.startsWith('ls ') || 
         lowerCommand === 'ls' ||
         (lowerCommand.startsWith('cat ') && 
          !lowerCommand.includes('resume/experience.txt') && 
          !lowerCommand.includes('experience.txt') &&
          !lowerCommand.includes('resume/education.txt') && 
          !lowerCommand.includes('education.txt') &&
          !lowerCommand.includes('resume/skills.txt') && 
          !lowerCommand.includes('skills.txt') &&
          !lowerCommand.includes('resume/projects.txt') &&
          !lowerCommand.includes('projects.txt') &&
          !lowerCommand.includes('resume/contact.txt') &&
          !lowerCommand.includes('contact.txt')) ||
         lowerCommand.startsWith('cd ') ||
         lowerCommand.startsWith('vi ');
}

// Add command to history
function addToHistory(command, tabName) {
  // Don't add duplicate consecutive commands
  if (terminalStates[tabName].commandHistory.length === 0 || 
      terminalStates[tabName].commandHistory[terminalStates[tabName].commandHistory.length - 1] !== command) {
    terminalStates[tabName].commandHistory.push(command);
  }
  // Reset history index
  terminalStates[tabName].historyIndex = -1;
  terminalStates[tabName].currentInput = '';
}

// Navigate through command history
function navigateHistory(direction, tabName) {
  // Always select the current input field
  const terminalInput = document.querySelector('.terminal-input-line .terminal-input');
  if (!terminalInput || terminalStates[tabName].isWaitingForPassword) {
    return;
  }

  const state = terminalStates[tabName];
  const history = state.commandHistory;

  if (direction === 'up') {
    if (state.historyIndex === -1) {
      // First time pressing up, save current input
      state.currentInput = terminalInput.value;
    }
    if (state.historyIndex < history.length - 1) {
      state.historyIndex++;
      const command = history[history.length - 1 - state.historyIndex];
      terminalInput.value = command;
      terminalInput.setSelectionRange(command.length, command.length);
    }
  } else if (direction === 'down') {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      const command = history[history.length - 1 - state.historyIndex];
      terminalInput.value = command;
      terminalInput.setSelectionRange(command.length, command.length);
    } else if (state.historyIndex === 0) {
      // Back to original input
      state.historyIndex = -1;
      terminalInput.value = state.currentInput;
      terminalInput.setSelectionRange(state.currentInput.length, state.currentInput.length);
    }
  }
  updateBlockCursor(terminalInput, tabName);
}

// --- Utility to create a new input line at the end of the terminal output ---
function createInputLine(forceNormalPrompt) {
  // Remove any existing input line
  const oldInputLine = document.querySelector('.terminal-input-line');
  if (oldInputLine) oldInputLine.remove();

  const terminalOutput = document.getElementById('terminal-output-about');
  const inputLine = document.createElement('div');
  inputLine.className = 'terminal-input-line';
  // If forceNormalPrompt is true, always show normal prompt
  inputLine.innerHTML = '<span class="prompt">user@portfolio:~$</span> <input type="text" class="terminal-input" placeholder="Type a command. Try \'--help\' for a list of commands..." autocomplete="off">';
  terminalOutput.appendChild(inputLine);

  const terminalInput = inputLine.querySelector('.terminal-input');
  createBlockCursor(terminalInput, 'about');
  terminalInput.focus();

  // Reset history index and current input for new line
  terminalStates['about'].historyIndex = -1;
  terminalStates['about'].currentInput = '';

  // Handle Enter key press
  terminalInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      if (isTyping) return; // Prevent Enter during typewriter effect
      
      const input = this.value.trim();
      this.value = '';
      handleCommandInput(input, 'about');
    }
  });

  // Handle arrow keys for command history
  terminalInput.addEventListener('keydown', function(e) {
    if (isTyping) return; // Prevent arrow keys during typewriter effect
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up', 'about');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down', 'about');
    }
  });

  // Save current input for history navigation
  terminalInput.addEventListener('input', function(e) {
    if (isTyping) return; // Prevent input during typewriter effect
    
    terminalStates['about'].currentInput = this.value;
    updateBlockCursor(this, 'about');
  });

  terminalInput.addEventListener('click', function() {
    updateBlockCursor(this, 'about');
  });
  terminalInput.addEventListener('keyup', function() {
    updateBlockCursor(this, 'about');
  });

  // Update centering after creating the input line
  updateTerminalCentering();
}
