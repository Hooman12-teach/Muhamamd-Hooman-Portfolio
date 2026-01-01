// Project Admin Panel - Easy Project Management System

class ProjectAdmin {
    constructor() {
        this.isAdminMode = false;
        this.currentEditingId = null;
        // Holds base64/data URL for uploaded image when adding/editing a project
        this.currentImageData = null;
        this.init();
    }

    init() {
        // Create admin panel HTML
        this.createAdminPanel();
        // Add keyboard shortcut to open admin (Ctrl + Shift + A)
        this.setupKeyboardShortcut();
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.requestAdminAccess();
            }
        });
    }

    createAdminPanel() {
        const adminHTML = `
            <div id="adminPanel" class="admin-panel" style="display: none;">
                <div class="admin-overlay"></div>
                <div class="admin-content">
                    <div class="admin-header">
                        <h2><i class='bx bx-cog'></i> Project Manager</h2>
                        <button class="admin-close" onclick="projectAdmin.closeAdmin()">
                            <i class='bx bx-x'></i>
                        </button>
                    </div>
                    
                    <div class="admin-tabs">
                        <button class="admin-tab active" data-tab="list">All Projects</button>
                        <button class="admin-tab" data-tab="add">Add New</button>
                    </div>

                    <div class="admin-body">
                        <!-- Projects List Tab -->
                        <div class="admin-tab-content active" id="tab-list">
                            <div class="projects-list-header">
                                <h3>Your Projects (<span id="projectCount">0</span>)</h3>
                                <button class="btn-add-project" onclick="projectAdmin.showAddForm()">
                                    <i class='bx bx-plus'></i> Add Project
                                </button>
                            </div>
                            <div id="projectsList" class="projects-list"></div>
                        </div>

                        <!-- Add/Edit Project Tab -->
                        <div class="admin-tab-content" id="tab-add">
                            <form id="projectForm" class="project-form">
                                <input type="hidden" id="projectId" name="id">
                                
                                <div class="form-group">
                                    <label for="projectTitle">Project Title *</label>
                                    <input type="text" id="projectTitle" name="title" required 
                                           placeholder="e.g., E-Commerce Dashboard">
                                </div>

                                <div class="form-group">
                                    <label for="projectDescription">Description *</label>
                                    <textarea id="projectDescription" name="description" rows="3" required
                                              placeholder="Brief description of your project"></textarea>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="projectCategory">Category *</label>
                                        <select id="projectCategory" name="category" required>
                                            <option value="ui">UI</option>
                                            <option value="ux">UX</option>
                                            <option value="web">Web Design</option>
                                            <option value="ui web">UI + Web</option>
                                            <option value="ux web">UX + Web</option>
                                            <option value="ux ui">UX + UI</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="projectImageType">Image Style *</label>
                                        <select id="projectImageType" name="imageType" required>
                                            <option value="purple">Purple UI</option>
                                            <option value="laptop">Laptop</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="web">Web Browser</option>
                                            <option value="dashboard">Dashboard</option>
                                            <option value="landing">Landing Page</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="projectTags">Tags (comma separated)</label>
                                    <input type="text" id="projectTags" name="tags" 
                                           placeholder="e.g., React, Figma, UI/UX">
                                    <small>Separate tags with commas</small>
                                </div>

                                <div class="form-group">
                                    <label for="projectLink">Project Link</label>
                                    <input type="url" id="projectLink" name="link" 
                                           placeholder="https://your-project.com">
                                </div>

                                <div class="form-group checkbox-group">
                                    <label>
                                        <input type="checkbox" id="projectFeatured" name="featured" checked>
                                        <span>Featured Project</span>
                                    </label>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">
                                        <i class='bx bx-save'></i> Save Project
                                    </button>
                                    <button type="button" class="btn btn-secondary" onclick="projectAdmin.resetForm()">
                                        <i class='bx bx-reset'></i> Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Admin Toggle Button -->
            <button id="adminToggle" class="admin-toggle" onclick="projectAdmin.requestAdminAccess()" title="Open Admin Panel (Ctrl+Shift+A)">
                <i class='bx bx-cog'></i>
            </button>

            <!-- Admin Password Modal (hidden until needed) -->
            <div id="adminPasswordModal" class="admin-password-modal" style="display: none;">
                <div class="admin-password-content">
                    <h3>Enter Admin Password</h3>
                    <input id="adminPasswordInput" type="password" placeholder="Password" autocomplete="current-password">
                    <div class="modal-actions">
                        <button id="adminPasswordSubmit" class="btn btn-primary">Open</button>
                        <button id="adminPasswordCancel" class="btn btn-secondary">Cancel</button>
                    </div>
                    <p id="adminPasswordError" class="admin-password-error" style="display:none;">Incorrect password</p>
                </div>
            </div>
        `; 

        document.body.insertAdjacentHTML('beforeend', adminHTML);
        // Store the SHA-256 hash of the admin password (password provided by owner). This is never stored in plaintext.
        this.ADMIN_PASSWORD_HASH = 'c8ea5e953875ce9a8f894e86d2e9d3a87dadd6272231405ae8441d2cb29f2536';

        this.setupEventListeners();
        this.setupPasswordModal();
        this.loadProjectsList();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Form submission
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        // Image source selection (preset vs upload)
        document.querySelectorAll('input[name="imageSource"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const uploadGroup = document.querySelector('.image-upload');
                if (e.target.value === 'upload') {
                    uploadGroup.style.display = 'block';
                } else {
                    uploadGroup.style.display = 'none';
                    // clear any pending uploaded image when switching back
                    this.currentImageData = null;
                    const preview = document.getElementById('projectImagePreview');
                    const previewContainer = document.getElementById('projectImagePreviewContainer');
                    if (preview) { preview.src = ''; previewContainer.style.display = 'none'; }
                    const fileInput = document.getElementById('projectImageFile');
                    if (fileInput) fileInput.value = null;
                }
            });
        });

        // File input change -> read file as data URL
        const fileInput = document.getElementById('projectImageFile');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    this.currentImageData = ev.target.result;
                    const preview = document.getElementById('projectImagePreview');
                    const previewContainer = document.getElementById('projectImagePreviewContainer');
                    preview.src = this.currentImageData;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            });
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');

        if (tabName === 'list') {
            this.loadProjectsList();
        }
    }

    showAddForm() {
        this.switchTab('add');
        this.resetForm();
    }

    // Request admin access by showing the password modal
    requestAdminAccess() {
        // If already open, just close it
        if (this.isAdminMode) return this.toggleAdminPanel();
        this.showPasswordModal();
    }

    setupPasswordModal() {
        this.passwordModal = document.getElementById('adminPasswordModal');
        this.passwordInput = document.getElementById('adminPasswordInput');
        this.passwordError = document.getElementById('adminPasswordError');
        const submitBtn = document.getElementById('adminPasswordSubmit');
        const cancelBtn = document.getElementById('adminPasswordCancel');

        submitBtn.addEventListener('click', () => {
            const val = this.passwordInput.value || '';
            this.verifyPassword(val).then(valid => {
                if (valid) {
                    this.hidePasswordModal();
                    this.passwordInput.value = '';
                    this.toggleAdminPanel();
                } else {
                    this.passwordError.style.display = 'block';
                }
            });
        });

        cancelBtn.addEventListener('click', () => {
            this.hidePasswordModal();
            this.passwordInput.value = '';
            this.passwordError.style.display = 'none';
        });

        // allow Enter key to submit
        this.passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('adminPasswordSubmit').click();
            }
        });
    }

    showPasswordModal() {
        this.passwordError.style.display = 'none';
        this.passwordModal.style.display = 'flex';
        this.passwordInput.focus();
    }

    hidePasswordModal() {
        this.passwordModal.style.display = 'none';
    }

    async verifyPassword(password) {
        if (!password) return false;
        try {
            const enc = new TextEncoder().encode(password);
            const digest = await crypto.subtle.digest('SHA-256', enc);
            const hashArray = Array.from(new Uint8Array(digest));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex === this.ADMIN_PASSWORD_HASH;
        } catch (e) {
            console.error('Password verification error', e);
            return false;
        }
    }

    toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        this.isAdminMode = !this.isAdminMode;
        panel.style.display = this.isAdminMode ? 'block' : 'none';
        
        if (this.isAdminMode) {
            this.loadProjectsList();
        }
    }

    closeAdmin() {
        this.isAdminMode = false;
        document.getElementById('adminPanel').style.display = 'none';
        this.resetForm();
    }

    loadProjectsList() {
        const projects = window.projectManager.getAllProjects();
        const listContainer = document.getElementById('projectsList');
        const countElement = document.getElementById('projectCount');

        countElement.textContent = projects.length;

        if (projects.length === 0) {
            listContainer.innerHTML = '<p class="no-projects">No projects yet. Add your first project!</p>';
            return;
        }

        listContainer.innerHTML = projects.map(project => `
            <div class="project-item" data-id="${project.id}">
                <div class="project-item-info">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="project-item-meta">
                        <span class="project-category">${project.category}</span>
                        ${project.featured ? '<span class="project-featured">Featured</span>' : ''}
                    </div>
                </div>
                <div class="project-item-actions">
                    <button class="btn-edit" onclick="projectAdmin.editProject(${project.id})" title="Edit">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="btn-delete" onclick="projectAdmin.deleteProject(${project.id})" title="Delete">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    editProject(id) {
        const project = window.projectManager.getProjectById(id);
        if (!project) return;

        this.currentEditingId = id;
        this.switchTab('add');

        document.getElementById('projectId').value = project.id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectImageType').value = project.imageType === 'custom' ? 'purple' : project.imageType;
        document.getElementById('projectTags').value = project.tags.join(', ');
        document.getElementById('projectLink').value = project.link;
        document.getElementById('projectFeatured').checked = project.featured;
        
        // Populate image source and preview if project has custom image data
        if (project.imageData) {
            this.currentImageData = project.imageData;
            // switch to upload mode
            const uploadRadio = document.querySelector('input[name="imageSource"][value="upload"]');
            const presetRadio = document.querySelector('input[name="imageSource"][value="preset"]');
            if (uploadRadio && presetRadio) {
                uploadRadio.checked = true;
                presetRadio.checked = false;
                document.querySelector('.image-upload').style.display = 'block';
                const preview = document.getElementById('projectImagePreview');
                const previewContainer = document.getElementById('projectImagePreviewContainer');
                preview.src = this.currentImageData;
                previewContainer.style.display = 'block';
            }
        } else {
            // ensure preset is selected when no custom image exists
            const uploadRadio = document.querySelector('input[name="imageSource"][value="upload"]');
            const presetRadio = document.querySelector('input[name="imageSource"][value="preset"]');
            if (uploadRadio && presetRadio) {
                uploadRadio.checked = false;
                presetRadio.checked = true;
                document.querySelector('.image-upload').style.display = 'none';
            }
        }
    }

    saveProject() {
        const formData = {
            title: document.getElementById('projectTitle').value.trim(),
            description: document.getElementById('projectDescription').value.trim(),
            category: document.getElementById('projectCategory').value,
            imageType: document.getElementById('projectImageType').value,
            tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
            link: document.getElementById('projectLink').value.trim() || '#',
            featured: document.getElementById('projectFeatured').checked
        };

        // If a custom image was uploaded, include it (and mark imageType as 'custom')
        if (this.currentImageData) {
            formData.imageData = this.currentImageData;
            formData.imageType = 'custom';
        } else {
            formData.imageData = null;
        }

        if (!formData.title || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        const id = document.getElementById('projectId').value;
        let result;

        if (id) {
            // Update existing
            result = window.projectManager.updateProject(parseInt(id), formData);
            if (result) {
                showToast('Project updated successfully!', 'success');
            }
        } else {
            // Add new
            result = window.projectManager.addProject(formData);
            if (result) {
                showToast('Project added successfully!', 'success');
            }
        }

        if (result) {
            this.resetForm();
            this.switchTab('list');
            this.loadProjectsList();
            // Refresh projects on main page
            if (window.renderProjects) {
                window.renderProjects();
            }
        }
    }

    deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const result = window.projectManager.deleteProject(id);
        if (result) {
            showToast('Project deleted successfully!', 'success');
            this.loadProjectsList();
            // Refresh projects on main page
            if (window.renderProjects) {
                window.renderProjects();
            }
        }
    }

    resetForm() {
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        this.currentEditingId = null;
        this.currentImageData = null;
        // Clear file input + preview
        const fileInput = document.getElementById('projectImageFile'); if (fileInput) fileInput.value = null;
        const preview = document.getElementById('projectImagePreview'); const previewContainer = document.getElementById('projectImagePreviewContainer'); if (preview) { preview.src = ''; previewContainer.style.display = 'none'; }
        // Reset image source radio to preset
        const uploadRadio = document.querySelector('input[name="imageSource"][value="upload"]');
        const presetRadio = document.querySelector('input[name="imageSource"][value="preset"]');
        if (uploadRadio && presetRadio) { uploadRadio.checked = false; presetRadio.checked = true; document.querySelector('.image-upload').style.display = 'none'; }
    }
}

// Initialize admin panel
const projectAdmin = new ProjectAdmin();
window.projectAdmin = projectAdmin;

