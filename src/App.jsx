import React, { useState } from 'react';

// --- SVG Icons (Heroicons, Lucide) ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
);

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 ml-1">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

// --- Data from your resume ---
const portfolioData = {
    name: "Vishal Raj",
    title: "Full Stack Web Developer",
    location: "Hyderabad, Telangana, India",
    email: "vishalrjpt0@gmail.com",
    phone: "9347984229",
    linkedin: "https://linkedin.com/in/vishal-raj-440576281",
    github: "https://github.com/vishal007-cool",
    objective: "Passionate and detail-oriented Full Stack Web Developer with hands-on experience in building responsive, scalable, and dynamic web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). Eager to apply technical expertise in both frontend and backend development.",
    education: {
        degree: "BCA (Bachelor of Computer Applications)",
        university: "Chaitanya (Deemed to be University)",
        location: "Hyderabad, India"
    },
    skills: {
        frontend: ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "Bootstrap", "Tailwind CSS"],
        backend: ["Node.js", "Express.js", "RESTful APIs", "JWT", "bcrypt"],
        database: ["MongoDB", "Mongoose", "Firebase (Basics)", "MySQL (Basics)"],
        tools: ["Git", "GitHub", "VS Code", "Postman", "Vercel", "npm"],
        concepts: ["SPA", "MVC Architecture", "State Management", "API Integration", "Version Control"],
        familiar: ["Redux", "Figma", "AWS Basics", "Socket.io"],
    },
    projects: [
        {
            title: "AI Chat Bot",
            description: "Developed an AI-powered chatbot interface with a clean and modern UI. Implemented dynamic user interactions using JavaScript and React.js to simulate real-time conversations.",
            liveDemo: "#", // Placeholder
        },
        {
            title: "Weather App",
            description: "Built a real-time weather app using OpenWeather API. It displays current conditions, temperature, and humidity based on location. Responsive design with Tailwind CSS.",
            liveDemo: "#", // Placeholder
        },
        {
            title: "PDF Merge Tool",
            description: "Created a web app to combine multiple PDFs easily. Built with a focus on user simplicity, it features file upload, preview, and merging functionality with a smooth UX.",
            liveDemo: "#", // Placeholder
        },
    ],
};

// --- Reusable Components ---
const Section = ({ title, children, id }) => (
    <section id={id} className="mb-12 md:mb-16 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 border-b-2 border-teal-400 pb-2">{title}</h2>
        {children}
    </section>
);

const SkillBadge = ({ skill }) => (
    <span className="inline-block bg-slate-700 text-teal-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">{skill}</span>
);

const ProjectCard = ({ project }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-teal-400/20 transform hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-xl font-bold text-slate-100 mb-2">{project.title}</h3>
        <p className="text-slate-400 mb-4">{project.description}</p>
        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-teal-400 font-semibold hover:text-teal-300 transition-colors">
            Live Demo <ExternalLinkIcon />
        </a>
    </div>
);

// --- Main App Component ---
export default function App() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans leading-relaxed">
            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
                
                {/* Header / Hero Section */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white">{portfolioData.name}</h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-teal-400 mt-1">{portfolioData.title}</h2>
                        <div className="mt-4 text-slate-400">
                            <div className="flex items-center mb-2"><MapPinIcon /> {portfolioData.location}</div>
                            <div className="flex items-center mb-2">
                                <MailIcon /> <a href={`mailto:${portfolioData.email}`} className="hover:text-teal-400">{portfolioData.email}</a>
                            </div>
                            <div className="flex items-center">
                                <PhoneIcon /> <a href={`tel:${portfolioData.phone}`} className="hover:text-teal-400">{portfolioData.phone}</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-6 md:mt-0">
                        <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">
                            <LinkedinIcon />
                        </a>
                        <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">
                            <GithubIcon />
                        </a>
                    </div>
                </header>

                <main>
                    {/* Objective Section */}
                    <Section title="Objective" id="objective">
                        <p className="text-lg text-slate-400">{portfolioData.objective}</p>
                    </Section>

                    {/* Skills Section */}
                    <Section title="Skills" id="skills">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-slate-300 text-lg mb-2">Frontend</h3>
                                {portfolioData.skills.frontend.map(skill => <SkillBadge key={skill} skill={skill} />)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-300 text-lg mb-2">Backend</h3>
                                {portfolioData.skills.backend.map(skill => <SkillBadge key={skill} skill={skill} />)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-300 text-lg mb-2">Database</h3>
                                {portfolioData.skills.database.map(skill => <SkillBadge key={skill} skill={skill} />)}
                            </div>
                             <div>
                                <h3 className="font-bold text-slate-300 text-lg mb-2">Tools & Platforms</h3>
                                {portfolioData.skills.tools.map(skill => <SkillBadge key={skill} skill={skill} />)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-300 text-lg mb-2">Concepts</h3>
                                {portfolioData.skills.concepts.map(skill => <SkillBadge key={skill} skill={skill} />)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-300 text-lg mb-2">Familiar With</h3>
                                {portfolioData.skills.familiar.map(skill => <SkillBadge key={skill} skill={skill} />)}
                            </div>
                        </div>
                    </Section>

                    {/* Projects Section */}
                    <Section title="Projects" id="projects">
                        <div className="grid md:grid-cols-2 gap-6">
                            {portfolioData.projects.map(project => <ProjectCard key={project.title} project={project} />)}
                        </div>
                    </Section>
                    
                    {/* Education Section */}
                    <Section title="Education" id="education">
                         <div className="bg-slate-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-slate-100">{portfolioData.education.degree}</h3>
                            <p className="text-teal-400 mt-1">{portfolioData.education.university}</p>
                            <p className="text-slate-400">{portfolioData.education.location}</p>
                        </div>
                    </Section>
                </main>
                
                <footer className="text-center mt-20 border-t border-slate-700 pt-6">
                    <p className="text-slate-500">© {new Date().getFullYear()} Vishal Raj. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
