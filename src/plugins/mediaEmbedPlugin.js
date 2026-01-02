/**
 * Media Embed Plugin - YouTube, Vimeo, etc.
 */

const MediaEmbedPlugin = {
    name: 'mediaEmbed',

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
        this.createDialog();
    },

    createButton() {
        const insertImageBtn = document.querySelector('[data-command="insertImage"]');
        if (!insertImageBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'mediaEmbedBtn';
        btn.title = 'Embed Media (Video)';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm11.5 5.5L6 7.4V12l5.5-2.5z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDialog();
        });

        insertImageBtn.after(btn);
    },

    createDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'mediaEmbedDialog';
        dialog.className = 'plugin-dialog';
        dialog.style.display = 'none';

        dialog.innerHTML = `
            <div class="plugin-dialog-content media-embed-dialog">
                <h3>Embed Media</h3>
                <div class="form-group">
                    <label>Media URL (YouTube, Vimeo, etc.):</label>
                    <input type="text" id="mediaUrl" placeholder="https://www.youtube.com/watch?v=..." />
                    <small>Supports YouTube, Vimeo, and direct video URLs</small>
                </div>
                <div class="form-group">
                    <label>Width:</label>
                    <input type="number" id="mediaWidth" value="560" min="100" max="1920" />
                </div>
                <div class="form-group">
                    <label>Height:</label>
                    <input type="number" id="mediaHeight" value="315" min="100" max="1080" />
                </div>
                <div id="mediaPreview" class="media-preview"></div>
                <div class="dialog-buttons">
                    <button class="action-btn" id="insertMedia">Insert</button>
                    <button class="action-btn secondary" id="closeMediaEmbed">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        document.getElementById('mediaUrl').addEventListener('input', () => this.updatePreview());
        document.getElementById('insertMedia').addEventListener('click', () => this.insertMedia());
        document.getElementById('closeMediaEmbed').addEventListener('click', () => this.hideDialog());

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hideDialog();
            }
        });
    },

    showDialog() {
        document.getElementById('mediaEmbedDialog').style.display = 'flex';
        document.getElementById('mediaUrl').value = '';
        document.getElementById('mediaPreview').innerHTML = '';
        document.getElementById('mediaUrl').focus();
    },

    hideDialog() {
        document.getElementById('mediaEmbedDialog').style.display = 'none';
    },

    updatePreview() {
        const url = document.getElementById('mediaUrl').value;
        const preview = document.getElementById('mediaPreview');

        if (!url) {
            preview.innerHTML = '';
            return;
        }

        const embedUrl = this.getEmbedUrl(url);
        if (embedUrl) {
            preview.innerHTML = `
                <iframe width="400" height="225" src="${embedUrl}"
                    frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            preview.innerHTML = '<p style="color: #dc3545;">Invalid or unsupported URL</p>';
        }
    },

    getEmbedUrl(url) {
        // YouTube
        let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }

        // Vimeo
        match = url.match(/vimeo\.com\/(\d+)/);
        if (match) {
            return `https://player.vimeo.com/video/${match[1]}`;
        }

        // Direct video URL
        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return url;
        }

        return null;
    },

    insertMedia() {
        const url = document.getElementById('mediaUrl').value;
        const width = document.getElementById('mediaWidth').value;
        const height = document.getElementById('mediaHeight').value;

        if (!url) return;

        const embedUrl = this.getEmbedUrl(url);
        if (!embedUrl) {
            alert('Invalid or unsupported URL. Please enter a YouTube, Vimeo, or direct video URL.');
            return;
        }

        let html;
        if (embedUrl.match(/\.(mp4|webm|ogg)$/i)) {
            // Direct video
            html = `<video width="${width}" height="${height}" controls><source src="${embedUrl}"></video>`;
        } else {
            // Iframe embed
            html = `<iframe width="${width}" height="${height}" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
        }

        html += '<p><br></p>';

        document.execCommand('insertHTML', false, html);
        this.editor.saveHistory();
        this.hideDialog();
    },

    destroy() {
        const btn = document.getElementById('mediaEmbedBtn');
        const dialog = document.getElementById('mediaEmbedDialog');
        if (btn) btn.remove();
        if (dialog) dialog.remove();
    }
};
