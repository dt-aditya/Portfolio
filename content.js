// Terminal content configuration
const terminalContent = {
  education: {
    asciiArt: `███████ ██████  ██    ██  ██████  █████  ████████ ██  ██████  ███    ██ 
██      ██   ██ ██    ██ ██      ██   ██    ██    ██ ██    ██ ████   ██ 
█████   ██   ██ ██    ██ ██      ███████    ██    ██ ██    ██ ██ ██  ██ 
██      ██   ██ ██    ██ ██      ██   ██    ██    ██ ██    ██ ██  ██ ██ 
███████ ██████   ██████   ██████ ██   ██    ██    ██  ██████  ██   ████`,
    
    separator: `##############################################################################`,
    
    summary: `TLDR: Masters from UC Riverside, CA -- Bachelor's from SRM University, Chennai`,
    
    masters: {
      school: 'University of California, Riverside',
      location: 'Riverside, CA, USA',
      degree: 'Master of Science, Computer Science',
      gpa: '3.96 / 4.00',
      coursework: 'Advanced Operating Systems, Machine Learning, Aritificial Intelligence, Big Data Systems'
    },
    
    bachelors: {
      school: 'SRM University, Chennai',
      location: 'Chennai, TN, India',
      degree: 'Bachelor of Technology, Computer Science',
      gpa: '4.00 / 4.00',
      coursework: 'Databases, Operating Systems, Machine Learning, Aritifical Intelligence, Python'
    }
  },
  
  about: {
    asciiArt: ` █████  ██████   ██████  ██    ██ ████████ 
██   ██ ██   ██ ██    ██ ██    ██    ██    
███████ ██████  ██    ██ ██    ██    ██    
██   ██ ██   ██ ██    ██ ██    ██    ██    
██   ██ ██████   ██████   ██████     ██`,
    
    welcome: 'Welcome to my terminal portfolio!'
  },
  
  projects: {
    title: 'My Projects',
    items: [
      {
        name: 'Project 1',
        description: 'Description of your first project...',
        link: '#'
      },
      {
        name: 'Project 2', 
        description: 'Description of your second project...',
        link: '#'
      },
      {
        name: 'Project 3',
        description: 'Description of your third project...',
        link: '#'
      }
    ]
  },
  
  contact: {
    title: 'Get In Touch',
    items: [
      { label: 'Email', value: 'your.email@example.com' },
      { label: 'GitHub', value: 'github.com/yourusername', link: 'https://github.com/yourusername' },
      { label: 'LinkedIn', value: 'linkedin.com/in/yourusername', link: 'https://linkedin.com/in/yourusername' },
      { label: 'Twitter', value: '@yourusername', link: 'https://twitter.com/yourusername' }
    ]
  }
};

// Helper function to format education content
function formatEducationContent() {
  const edu = terminalContent.education;
  return `${edu.asciiArt}
                                                                                   
${edu.separator}
${edu.summary}
${edu.separator}

School     - ${edu.masters.school}
Location   - ${edu.masters.location}
Degree     - ${edu.masters.degree}
GPA        - ${edu.masters.gpa}
Coursework - ${edu.masters.coursework}


School     - ${edu.bachelors.school}
Location   - ${edu.bachelors.location}
Degree     - ${edu.bachelors.degree}
GPA        - ${edu.bachelors.gpa}
Coursework - ${edu.bachelors.coursework}`;
}

// Helper function to format projects content
function formatProjectsContent() {
  const proj = terminalContent.projects;
  let content = `${proj.title}\n`;
  
  proj.items.forEach((item, index) => {
    content += `\n${index + 1}. ${item.name}\n`;
    content += `   ${item.description}\n`;
    content += `   Link: ${item.link}\n`;
  });
  
  return content;
}

// Helper function to format contact content
function formatContactContent() {
  const cont = terminalContent.contact;
  let content = `${cont.title}\n\n`;
  
  cont.items.forEach(item => {
    if (item.link) {
      content += `${item.label}: ${item.value}\n`;
    } else {
      content += `${item.label}: ${item.value}\n`;
    }
  });
  
  return content;
} 