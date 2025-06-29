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
  // Initialize all terminals
  initializeTerminal('about');
  initializeTerminal('education');
  initializeTerminal('projects');
  initializeTerminal('contact');
  
  // Auto-load content for each tab
  setTimeout(() => {
    handleCommandInput('cat resume/about.txt', 'about');
    handleCommandInput('cat resume/education.txt', 'education');
    handleCommandInput('cat resume/projects.txt', 'projects');
    handleCommandInput('cat resume/contact.txt', 'contact');
  }, 100);
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

function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  document.querySelector(`.tab[onclick*="${id}"]`).classList.add('active');
  document.getElementById(id).classList.add('active');
  
  currentTab = id;
  
  // Focus on the current tab's input
  setTimeout(() => {
    const terminalInput = document.getElementById(`terminal-input-${id}`);
    if (terminalInput) {
      terminalInput.focus();
      updateBlockCursor(terminalInput, id);
    }
  }, 100);
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

// Add a user input line (command or password prompt) - for completed inputs
function addUserInputLine(prompt, inputValue, tabName) {
  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  if (terminalOutput) {
    const inputLine = document.createElement('div');
    inputLine.className = 'user-input-line';
    
    if (inputValue) {
      // Show completed command/password
      inputLine.innerHTML = `<span class="prompt">${prompt}</span> <span class="input-text">${inputValue}</span>`;
    } else {
      // Show just the prompt
      inputLine.innerHTML = `<span class="prompt">${prompt}</span>`;
    }
    
    terminalOutput.appendChild(inputLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

// Add an output line
function addOutputLine(text, type, tabName) {
  const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
  if (terminalOutput) {
    const outputLine = document.createElement('div');
    outputLine.className = `output-line ${type}`;
    outputLine.textContent = text;
    terminalOutput.appendChild(outputLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

// Handle command input
function handleCommandInput(command, tabName) {
  // Show the command that was entered
  addUserInputLine('user@portfolio:~$', command, tabName);
  
  // Add command to history (only if it's not empty and not a password)
  if (command.trim() !== '') {
    addToHistory(command, tabName);
  }
  
  // Check if command needs password
  if (commandNeedsPassword(command)) {
    // Set state to waiting for password
    terminalStates[tabName].isWaitingForPassword = true;
    terminalStates[tabName].currentCommand = command;
    
    // Show password prompt
    showPasswordPrompt(tabName);
  } else {
    // Process command immediately
    processCommand(command, tabName);
    // Show next console command
    showConsoleCommand(tabName);
  }
}

// Show password prompt in the input line
function showPasswordPrompt(tabName) {
  const terminalInputLine = document.querySelector(`#${tabName} .terminal-input-line`);
  if (terminalInputLine) {
    // Clear any existing prompt
    const existingPrompt = terminalInputLine.querySelector('.prompt');
    if (existingPrompt) {
      existingPrompt.remove();
    }
    
    // Add password prompt
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = '[sudo] password for user:';
    terminalInputLine.insertBefore(promptSpan, terminalInputLine.firstChild);
    
    // Clear the input field and disable typing
    const terminalInput = document.getElementById(`terminal-input-${tabName}`);
    if (terminalInput) {
      terminalInput.value = '';
      terminalInput.placeholder = '';
      terminalInput.style.color = 'transparent';
    }
  }
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
  
  // Show next console command (don't show the attempted command again)
  showConsoleCommand(tabName);
  
  // Clear current command
  terminalStates[tabName].currentCommand = null;
  
  // Reset input field
  const terminalInput = document.getElementById(`terminal-input-${tabName}`);
  if (terminalInput) {
    terminalInput.style.color = '#00ff00';
    terminalInput.placeholder = 'Type a command...';
  }
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

// Process command and show output
function processCommand(command, tabName) {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand === 'cat resume/education.txt' || lowerCommand === 'cat education.txt') {
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
  } else if (lowerCommand === 'clear') {
    // Clear the terminal output
    const terminalOutput = document.getElementById(`terminal-output-${tabName}`);
    if (terminalOutput) {
      terminalOutput.innerHTML = '';
    }
  } else if (command.trim() !== '') {
    // Unknown command
    addOutputLine(`bash: ${command}: command not found`, 'error', tabName);
  }
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
  const terminalInput = document.getElementById(`terminal-input-${tabName}`);
  if (!terminalInput || terminalStates[tabName].isWaitingForPassword) {
    return;
  }
  
  if (direction === 'up') {
    // Navigate up in history
    if (terminalStates[tabName].historyIndex === -1) {
      // First time pressing up, save current input
      terminalStates[tabName].currentInput = terminalInput.value;
    }
    
    if (terminalStates[tabName].historyIndex < terminalStates[tabName].commandHistory.length - 1) {
      terminalStates[tabName].historyIndex++;
      const command = terminalStates[tabName].commandHistory[terminalStates[tabName].commandHistory.length - 1 - terminalStates[tabName].historyIndex];
      terminalInput.value = command;
      terminalInput.setSelectionRange(command.length, command.length);
    }
  } else if (direction === 'down') {
    // Navigate down in history
    if (terminalStates[tabName].historyIndex > 0) {
      terminalStates[tabName].historyIndex--;
      const command = terminalStates[tabName].commandHistory[terminalStates[tabName].commandHistory.length - 1 - terminalStates[tabName].historyIndex];
      terminalInput.value = command;
      terminalInput.setSelectionRange(command.length, command.length);
    } else if (terminalStates[tabName].historyIndex === 0) {
      // Back to original input
      terminalStates[tabName].historyIndex = -1;
      terminalInput.value = terminalStates[tabName].currentInput;
      terminalInput.setSelectionRange(terminalStates[tabName].currentInput.length, terminalStates[tabName].currentInput.length);
    }
  }
  
  updateBlockCursor(terminalInput, tabName);
}
