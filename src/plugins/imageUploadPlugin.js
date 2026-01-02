/**
 * Image Upload Plugin - Upload and resize images
 */

const ImageUploadPlugin = {
    name: 'imageUpload',

    init(editor, config = {}) {
        this.editor = editor;
        this.config = {
            maxSize: config.maxSize || 5 * 1024 * 1024, // 5MB default
            allowedTypes: config.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        };

        this.replaceImageButton();
        this.createDialog();
    },

    replaceImageButton() {
        // Replace the default insertImage button
        const insertImageBtn = document.querySelector('[data-command="insertImage"]');
        if (!insertImageBtn) return;

        insertImageBtn.removeAttribute('data-command');
        insertImageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDialog();
        });
    },

    createDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'imageUploadDialog';
        dialog.className = 'plugin-dialog';
        dialog.style.display = 'none';

        dialog.innerHTML = `
            <div class="plugin-dialog-content image-upload-dialog">
                <h3>Insert Image</h3>
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="upload">Upload</button>
                    <button class="tab-btn" data-tab="url">From URL</button>
                </div>

                <div class="tab-content" id="uploadTab">
                    <div class="upload-area" id="uploadArea">
                        <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                        <p>Click to upload or drag and drop</p>
                        <small>PNG, JPG, GIF, WebP (Max 5MB)</small>
                        <input type="file" id="imageFileInput" accept="image/*" style="display: none;" />
                    </div>
                    <div id="imagePreviewContainer" style="display: none;">
                        <img id="imagePreview" style="max-width: 100%; max-height: 300px;" />
                        <div class="form-group">
                            <label>Width (px):</label>
                            <input type="number" id="imageWidth" min="10" max="2000" />
                        </div>
                        <div class="form-group">
                            <label>Height (px):</label>
                            <input type="number" id="imageHeight" min="10" max="2000" />
                        </div>
                        <div class="form-group">
                            <label>Alt Text:</label>
                            <input type="text" id="imageAlt" placeholder="Describe the image" />
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="urlTab" style="display: none;">
                    <div class="form-group">
                        <label>Image URL:</label>
                        <input type="text" id="imageUrlInput" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="form-group">
                        <label>Alt Text:</label>
                        <input type="text" id="imageUrlAlt" placeholder="Describe the image" />
                    </div>
                </div>

                <div class="dialog-buttons">
                    <button class="action-btn" id="insertImageBtn">Insert Image</button>
                    <button class="action-btn secondary" id="closeImageUpload">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        this.setupEventListeners();
    },

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Upload area click
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('imageFileInput');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFile(file);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
            uploadArea.style.background = '#f0f3ff';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ced4da';
            uploadArea.style.background = '#f8f9fa';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ced4da';
            uploadArea.style.background = '#f8f9fa';

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFile(file);
            }
        });

        // Insert button
        document.getElementById('insertImageBtn').addEventListener('click', () => {
            this.insertImage();
        });

        // Close button
        document.getElementById('closeImageUpload').addEventListener('click', () => {
            this.hideDialog();
        });

        // Close on overlay click
        document.getElementById('imageUploadDialog').addEventListener('click', (e) => {
            if (e.target.id === 'imageUploadDialog') {
                this.hideDialog();
            }
        });
    },

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        document.getElementById('uploadTab').style.display = tab === 'upload' ? 'block' : 'none';
        document.getElementById('urlTab').style.display = tab === 'url' ? 'block' : 'none';
    },

    handleFile(file) {
        // Validate file type
        if (!this.config.allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please upload an image file (PNG, JPG, GIF, or WebP).');
            return;
        }

        // Validate file size
        if (file.size > this.config.maxSize) {
            alert(`File is too large. Maximum size is ${this.config.maxSize / 1024 / 1024}MB.`);
            return;
        }

        // Read and display the file
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('imagePreview');
            img.src = e.target.result;
            img.onload = () => {
                document.getElementById('imageWidth').value = img.naturalWidth;
                document.getElementById('imageHeight').value = img.naturalHeight;
                document.getElementById('uploadArea').style.display = 'none';
                document.getElementById('imagePreviewContainer').style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    },

    showDialog() {
        const dialog = document.getElementById('imageUploadDialog');
        dialog.style.display = 'flex';
        this.resetDialog();
    },

    hideDialog() {
        document.getElementById('imageUploadDialog').style.display = 'none';
        this.resetDialog();
    },

    resetDialog() {
        document.getElementById('imageFileInput').value = '';
        document.getElementById('imageUrlInput').value = '';
        document.getElementById('imageAlt').value = '';
        document.getElementById('imageUrlAlt').value = '';
        document.getElementById('uploadArea').style.display = 'flex';
        document.getElementById('imagePreviewContainer').style.display = 'none';
        this.switchTab('upload');
    },

    insertImage() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

        let src, alt, width = '', height = '';

        if (activeTab === 'upload') {
            const preview = document.getElementById('imagePreview');
            if (!preview.src || preview.src === window.location.href) {
                alert('Please select an image first.');
                return;
            }
            src = preview.src;
            alt = document.getElementById('imageAlt').value;
            width = document.getElementById('imageWidth').value;
            height = document.getElementById('imageHeight').value;
        } else {
            src = document.getElementById('imageUrlInput').value;
            alt = document.getElementById('imageUrlAlt').value;

            if (!src) {
                alert('Please enter an image URL.');
                return;
            }
        }

        let imgTag = `<img src="${src}" alt="${alt}"`;
        if (width) imgTag += ` width="${width}"`;
        if (height) imgTag += ` height="${height}"`;
        imgTag += ' style="max-width: 100%;" /><p><br></p>';

        document.execCommand('insertHTML', false, imgTag);
        this.editor.saveHistory();
        this.hideDialog();
    },

    destroy() {
        const dialog = document.getElementById('imageUploadDialog');
        if (dialog) dialog.remove();
    }
};
