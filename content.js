// Terminal content configuration
const terminalContent = {
  experience: {
    title: 'Work Experience',
    items: [
      {
        company: 'C3.ai',
        position: 'Software Engineer',
        duration: 'Feb 2025 – Present',
        location: 'Redwood City, CA',
        description: 'Refactored key features within the Reliability application for improved maintainability, performance, and code quality. Resolved bugs affecting ML training and inference workflows, improving deployment reliability.'
      },
      {
        company: 'Genesys',
        position: 'Software Engineer Intern',
        duration: 'Jun 2024 – Feb 2025',
        location: 'Menlo Park, CA',
        description: 'Migrated Python workloads from Jenkins to in-house workflow system (LaaSie), reducing system load by 40%. Strengthened LaaSie\'s parsing framework, leading to improved robustness and zero major crashes across 200+ users.'
      },
      {
        company: 'Drivetrain.ai',
        position: 'Software Engineer II',
        duration: 'Apr 2022 – Jun 2023',
        location: 'Bangalore, India',
        description: 'Rewrote core data structures to improve CPU cache efficiency, increasing computation speed by 70%. Co-led a Golang-based computation engine rewrite, boosting parallelism and achieving a 15x performance gain. Unified extraction, transformation, and syncing services into a single Airflow DAG, reducing overhead and resolving all sync issues. Built a Python-based type inference system, cutting model-building time by 10%.'
      },
      {
        company: 'Drivetrain.ai',
        position: 'Software Engineer',
        duration: 'May 2021 – Apr 2022',
        location: 'Bangalore, India',
        description: 'Developed Autocompute system for automatic value computation using DAGs, covering 70% of system computations. Built a formula inversion engine using Python and SymPy, reducing model size by 10–30%. Designed Spring Boot aggregator service to reduce chart load time by 90%. Created scalable Java microservices for rendering 25+ chart types via REST APIs.'
      },
      {
        company: 'Tata Consultancy Services, NextGen R&D',
        position: 'Software Engineer',
        duration: 'Aug 2019 – May 2021',
        location: 'Hyderabad, India',
        description: 'Built a redaction engine using Deep Learning models (ANNs, R-CNNs, YoloV4), achieving 89% text and 84% image accuracy. Trained ML models for Bug Triaging and Code Search in developer tools. Consolidated simulation workflows into a single CLI, reducing setup time by 90%.'
      }
    ]
  },
  
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
      location: 'Riverside, USA',
      degree: 'Master of Science in Computer Science',
      duration: 'Sep 2023 – Dec 2024',
      coursework: 'Advanced Operating Systems, Machine Learning, Artificial Intelligence, Big Data Systems'
    },
    
    bachelors: {
      school: 'SRM Institute of Science and Technology',
      location: 'Chennai, India',
      degree: 'Bachelor of Technology in Computer Science',
      duration: 'May 2015 – May 2019',
      coursework: 'Databases, Operating Systems, Machine Learning, Artificial Intelligence, Python'
    }
  },
  
  skills: {
    title: 'Technical Skills',
    categories: [
      {
        name: 'Programming Languages',
        skills: ['Python', 'Java', 'Golang', 'JavaScript']
      },
      {
        name: 'Frameworks & Tools',
        skills: ['FastAPI', 'Spring Boot', 'PostgreSQL', 'Redis', 'Jenkins', 'Docker', 'Gin', 'Airflow']
      },
      {
        name: 'Cloud & Infrastructure',
        skills: ['AWS (SQS, RDS, CloudFormation)', 'Docker', 'Jenkins']
      },
      {
        name: 'Core Skills',
        skills: ['Data Structures', 'System Design', 'Machine Learning', 'SQL', 'Microservices', 'REST APIs']
      }
    ]
  },
  
  projects: {
    title: 'Key Projects & Achievements',
    items: [
      // No projects for now
    ]
  },
  
  contact: {
    title: 'Get In Touch',
    items: [
      { label: 'Email', value: 'adityamagarde@gmail.com' },
      { label: 'Phone', value: '951-536-1891' },
      { label: 'LinkedIn', value: 'linkedin.com/in/adityam26', link: 'https://linkedin.com/in/adityam26' },
      { label: 'GitHub', value: 'github.com/dt-aditya', link: 'https://github.com/dt-aditya' }
    ]
  }
};

// Helper function to format experience content
function formatExperienceContent() {
  const exp = terminalContent.experience;
  let content = `<br><span class="terminal-section-title">Work Experience</span>`;
  
  exp.items.forEach((item, index) => {
    content += `<span class="terminal-company">${index + 1}. ${item.company}</span>`;
    content += `<div class="terminal-entry">`;
    content += `<span class="terminal-label">Position:</span> ${item.position}<br>`;
    content += `<span class="terminal-label">Duration:</span> ${item.duration}<br>`;
    content += `<span class="terminal-label">Location:</span> ${item.location}<br>`;
    content += `<div class="terminal-description">${item.description}</div>`;
    content += `</div>`;
  });
  
  return content;
}

// Helper function to format education content
function formatEducationContent() {
  const edu = terminalContent.education;
  let content = `<br><span class="terminal-section-title">Education</span>`;
  content += `<span class="terminal-company">${edu.masters.school}</span>`;
  content += `<div class="terminal-entry">`;
  content += `<span class="terminal-label">Degree:</span> ${edu.masters.degree}<br>`;
  content += `<span class="terminal-label">Location:</span> ${edu.masters.location}<br>`;
  content += `<span class="terminal-label">Duration:</span> ${edu.masters.duration}<br>`;
  content += `<span class="terminal-label">Coursework:</span> ${edu.masters.coursework}`;
  content += `</div>`;
  content += `<span class="terminal-company">${edu.bachelors.school}</span>`;
  content += `<div class="terminal-entry">`;
  content += `<span class="terminal-label">Degree:</span> ${edu.bachelors.degree}<br>`;
  content += `<span class="terminal-label">Location:</span> ${edu.bachelors.location}<br>`;
  content += `<span class="terminal-label">Duration:</span> ${edu.bachelors.duration}<br>`;
  content += `<span class="terminal-label">Coursework:</span> ${edu.bachelors.coursework}`;
  content += `</div>`;
  return content;
}

// Helper function to format skills content
function formatSkillsContent() {
  const skills = terminalContent.skills;
  let content = `<br><span class="terminal-section-title">${skills.title}</span>`;
  skills.categories.forEach(category => {
    content += `<span class="terminal-label">${category.name}:</span> <span class="terminal-skills-list">${category.skills.join(', ')}</span><br>`;
  });
  return content;
}

// Helper function to format projects content
function formatProjectsContent() {
  const proj = terminalContent.projects;
  let content = `<span class="terminal-section-title">${proj.title}</span>\n`;
  proj.items.forEach((item, index) => {
    content += `<span class="terminal-company">${index + 1}. ${item.name}</span>\n`;
    content += `<div class="terminal-entry">`;
    content += `<div class="terminal-description">${item.description}</div>`;
    content += `</div>\n`;
  });
  return content;
}

// Helper function to format contact content
function formatContactContent() {
  const cont = terminalContent.contact;
  let content = `<br><span class="terminal-section-title">${cont.title}</span>`;
  cont.items.forEach(item => {
    content += `<span class="terminal-contact-label">${item.label}:</span> <span class="terminal-contact-value">${item.value}</span><br>`;
  });
  return content;
} 