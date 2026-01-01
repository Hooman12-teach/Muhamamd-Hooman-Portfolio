// Projects Data Management System
// This file manages all project data

class ProjectManager {
    constructor() {
        this.storageKey = 'portfolio_projects';
        this.projects = this.loadProjects();
        this.init();
    }

    // Initialize default projects if none exist
    init() {
        if (this.projects.length === 0) {
            this.projects = this.getDefaultProjects();
            this.saveProjects();
        }
    }

    // Get default projects
    getDefaultProjects() {
        return [
            {
                id: 1,
                title: "E-Commerce Dashboard",
                description: "Modern Interface Design with Advanced Analytics",
                category: "ui web",
                tags: ["Figma", "React", "UI/UX"],
                imageType: "purple",                imageData: null,                link: "#",
                featured: true
            },
            {
                id: 2,
                title: "FinTech Mobile App",
                description: "User Experience Design for Banking Platform",
                category: "ux web",
                tags: ["Adobe XD", "Prototyping", "Research"],
                imageType: "laptop",
                imageData: null,
                link: "#",
                featured: true
            },
            {
                id: 3,
                title: "Fitness Tracker App",
                description: "iOS & Android UI Design",
                category: "ui",
                tags: ["Sketch", "Swift", "Material"],
                imageType: "mobile",
                imageData: null,
                link: "#",
                featured: true
            },
            {
                id: 4,
                title: "Portfolio Website",
                description: "Creative Portfolio with 3D Elements",
                category: "web ui",
                tags: ["Three.js", "GSAP", "CSS3"],
                imageType: "web",
                imageData: null,
                link: "#",
                featured: true
            },
            {
                id: 5,
                title: "Analytics Dashboard",
                description: "Data Visualization & UI Design",
                category: "ux ui",
                tags: ["D3.js", "Vue.js", "Charts"],
                imageType: "dashboard",
                imageData: null,
                link: "#",
                featured: true
            },
            {
                id: 6,
                title: "Product Landing Page",
                description: "High-Converting Landing Page Design",
                category: "web",
                tags: ["Webflow", "A/B Testing", "SEO"],
                imageType: "landing",
                imageData: null,
                link: "#",
                featured: true
            }
        ];
    }

    // Load projects from localStorage
    loadProjects() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading projects:', e);
            return [];
        }
    }

    // Save projects to localStorage
    saveProjects() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
            return true;
        } catch (e) {
            console.error('Error saving projects:', e);
            return false;
        }
    }

    // Get all projects
    getAllProjects() {
        return this.projects;
    }

    // Get featured projects
    getFeaturedProjects() {
        return this.projects.filter(p => p.featured);
    }

    // Get project by ID
    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }

    // Add new project
    addProject(projectData) {
        const newId = this.projects.length > 0 
            ? Math.max(...this.projects.map(p => p.id)) + 1 
            : 1;
        
        const newProject = {
            id: newId,
            title: projectData.title || 'Untitled Project',
            description: projectData.description || '',
            category: projectData.category || 'all',
            tags: projectData.tags || [],
            imageType: projectData.imageType || 'purple',
            imageData: projectData.imageData || null,
            link: projectData.link || '#',
            featured: projectData.featured !== undefined ? projectData.featured : true,
            createdAt: new Date().toISOString()
        };

        this.projects.push(newProject);
        this.saveProjects();
        return newProject;
    }

    // Update project
    updateProject(id, projectData) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.projects[index] = {
            ...this.projects[index],
            ...projectData,
            id: this.projects[index].id, // Preserve ID
            updatedAt: new Date().toISOString()
        };

        this.saveProjects();
        return true;
    }

    // Delete project
    deleteProject(id) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.projects.splice(index, 1);
        this.saveProjects();
        return true;
    }

    // Filter projects by category
    filterProjects(category) {
        if (category === 'all') return this.projects;
        return this.projects.filter(p => p.category.includes(category));
    }
}

// Initialize global project manager
window.projectManager = new ProjectManager();

