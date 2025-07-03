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

// Interactive terminal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize only the 'about' terminal
  initializeTerminal('about');

  // Only auto-load content for the default tab (about)
  setTimeout(() => {
    handleCommandInput('cat resume/about.txt', 'about');
  }, 100);

  // Add event listeners for left nav
  document.querySelectorAll('.vertical-nav li').forEach(item => {
    item.addEventListener('click', function() {
      // Remove active from all
      document.querySelectorAll('.vertical-nav li').forEach(li => li.classList.remove('active'));
      this.classList.add('active');
      // Always use the 'about' terminal
      let cmd = this.getAttribute('data-command');
      let commandToRun = '';
      if (cmd === 'about') {
        commandToRun = 'cat resume/about.txt';
      } else if (cmd === 'experience') {
        commandToRun = 'cat resume/education.txt';
      } else if (cmd === 'projects') {
        commandToRun = 'cat resume/projects.txt';
      }
      if (commandToRun) {
        handleCommandInput(commandToRun, 'about');
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
  const terminalInput = document.getElementById(`terminal-input-${tabName}`);
  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  
  if (terminalInput && terminalOutput) {
    // Create block cursor
    createBlockCursor(terminalInput, tabName);
    
    // Show initial console command
    showConsoleCommand(tabName);
    
    // Handle Enter key press
    terminalInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const input = this.value.trim();
        this.value = '';
        
        if (terminalStates[tabName].isWaitingForPassword) {
          // Handle password input - just accept Enter, don't show text
          handlePasswordInput(input, tabName);
        } else {
          // Handle command input
          handleCommandInput(input, tabName);
        }
      }
    });
    
    // Handle arrow keys for command history
    terminalInput.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory('up', tabName);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory('down', tabName);
      }
    });
    
    // Prevent typing during password input
    terminalInput.addEventListener('input', function(e) {
      if (terminalStates[tabName].isWaitingForPassword) {
        // Clear any input during password mode
        this.value = '';
      } else {
        // Save current input for history navigation
        terminalStates[tabName].currentInput = this.value;
      }
      updateBlockCursor(this, tabName);
    });
    
    // Update cursor position on click and key events
    terminalInput.addEventListener('click', function() {
      updateBlockCursor(this, tabName);
    });
    
    terminalInput.addEventListener('keyup', function() {
      updateBlockCursor(this, tabName);
    });
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
  const terminalInputLine = document.querySelector(`#${tabName} .terminal-input-line`);
  if (terminalInputLine) {
    // Clear any existing prompt
    const existingPrompt = terminalInputLine.querySelector('.prompt');
    if (existingPrompt) {
      existingPrompt.remove();
    }
    
    // Add new prompt
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = 'user@portfolio:~$';
    terminalInputLine.insertBefore(promptSpan, terminalInputLine.firstChild);
  }
}

// Utility to check and update terminal centering
function updateTerminalCentering() {
  const terminalOutput = document.getElementById('terminal-output-about');
  if (!terminalOutput) return;
  // If content height fits, center; if it overflows, scroll up
  if (terminalOutput.scrollHeight <= terminalOutput.clientHeight + 2) {
    terminalOutput.classList.add('centered');
  } else {
    terminalOutput.classList.remove('centered');
  }
}

// Call after every output/input change
function handleCommandInput(command, tabName) {
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
    outputLine.textContent = text;
    terminalOutput.appendChild(outputLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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
      updateTerminalCentering();
    }
    // Reset password and command state BEFORE creating new input line
    terminalStates[tabName].isWaitingForPassword = false;
    terminalStates[tabName].currentCommand = null;
    // Immediately create a new input line after clear (always normal prompt)
    createInputLine(true); // pass true to force normal prompt
    return; // Prevent further output after clear
  } else if (lowerCommand === 'cat resume/education.txt' || lowerCommand === 'cat education.txt') {
    // Display education content from external file
    addOutputLine(formatEducationContent(), 'normal', tabName);
  } else if (lowerCommand === 'cat about.txt' || lowerCommand === 'cat resume/about.txt') {
    // Display about content from external file
    const about = terminalContent.about;
    addOutputLine(`${about.asciiArt}\n\n${about.welcome}`, 'normal', tabName);
  } else if (lowerCommand === 'cat projects.txt' || lowerCommand === 'cat resume/projects.txt') {
    // Display projects content from external file
    addOutputLine(formatProjectsContent(), 'normal', tabName);
  } else if (lowerCommand === 'cat contact.txt' || lowerCommand === 'cat resume/contact.txt') {
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
          !lowerCommand.includes('resume/education.txt') && 
          !lowerCommand.includes('education.txt') &&
          !lowerCommand.includes('resume/about.txt') &&
          !lowerCommand.includes('about.txt') &&
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
  inputLine.innerHTML = '<span class="prompt">user@portfolio:~$</span> <input type="text" class="terminal-input" placeholder="Type a command..." autocomplete="off">';
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
      const input = this.value.trim();
      this.value = '';
      handleCommandInput(input, 'about');
    }
  });

  // Handle arrow keys for command history
  terminalInput.addEventListener('keydown', function(e) {
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
    terminalStates['about'].currentInput = this.value;
    updateBlockCursor(this, 'about');
  });

  terminalInput.addEventListener('click', function() {
    updateBlockCursor(this, 'about');
  });
  terminalInput.addEventListener('keyup', function() {
    updateBlockCursor(this, 'about');
  });
}
