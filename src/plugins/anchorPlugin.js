/**
 * Anchor/Bookmark Plugin - Insert named anchors for linking
 */

const AnchorPlugin = {
    name: 'anchor',

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
        this.createDialog();
    },

    createButton() {
        const unlinkBtn = document.querySelector('[data-command="unlink"]');
        if (!unlinkBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'anchorBtn';
        btn.title = 'Insert Anchor';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDialog();
        });

        unlinkBtn.after(btn);
    },

    createDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'anchorDialog';
        dialog.className = 'plugin-dialog';
        dialog.style.display = 'none';

        dialog.innerHTML = `
            <div class="plugin-dialog-content anchor-dialog">
                <h3>Insert Anchor</h3>
                <p>Create a named anchor that can be linked to from elsewhere in the document.</p>
                <div class="form-group">
                    <label>Anchor Name:</label>
                    <input type="text" id="anchorName" placeholder="section-1" />
                    <small>Use lowercase letters, numbers, and hyphens only</small>
                </div>
                <div class="form-group">
                    <label>Display Text (optional):</label>
                    <input type="text" id="anchorText" placeholder="Section 1" />
                    <small>Leave empty for invisible anchor</small>
                </div>
                <div class="dialog-buttons">
                    <button class="action-btn" id="insertAnchor">Insert Anchor</button>
                    <button class="action-btn secondary" id="closeAnchor">Cancel</button>
                </div>
                <hr style="margin: 20px 0;">
                <h4>Existing Anchors</h4>
                <div id="anchorList" class="anchor-list"></div>
            </div>
        `;

        document.body.appendChild(dialog);

        document.getElementById('insertAnchor').addEventListener('click', () => this.insertAnchor());
        document.getElementById('closeAnchor').addEventListener('click', () => this.hideDialog());

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hideDialog();
            }
        });
    },

    showDialog() {
        document.getElementById('anchorDialog').style.display = 'flex';
        document.getElementById('anchorName').value = '';
        document.getElementById('anchorText').value = '';
        this.updateAnchorList();
        document.getElementById('anchorName').focus();
    },

    hideDialog() {
        document.getElementById('anchorDialog').style.display = 'none';
    },

    insertAnchor() {
        const name = document.getElementById('anchorName').value.trim();
        const text = document.getElementById('anchorText').value.trim();

        if (!name) {
            alert('Please enter an anchor name.');
            return;
        }

        // Validate anchor name
        if (!/^[a-z0-9-]+$/.test(name)) {
            alert('Anchor name must contain only lowercase letters, numbers, and hyphens.');
            return;
        }

        // Check if anchor already exists
        const existing = this.editor.content.querySelector(`[id="${name}"]`);
        if (existing) {
            alert('An anchor with this name already exists. Please choose a different name.');
            return;
        }

        // Create anchor
        let html;
        if (text) {
            html = `<a id="${name}" name="${name}" class="anchor-point">${text}</a>`;
        } else {
            html = `<a id="${name}" name="${name}" class="anchor-point"></a>`;
        }

        document.execCommand('insertHTML', false, html);
        this.editor.saveHistory();
        this.hideDialog();
    },

    updateAnchorList() {
        const list = document.getElementById('anchorList');
        const anchors = this.editor.content.querySelectorAll('[id]');

        if (anchors.length === 0) {
            list.innerHTML = '<p style="color: #6c757d; font-style: italic;">No anchors found in document</p>';
            return;
        }

        let html = '<ul style="list-style: none; padding: 0;">';
        anchors.forEach(anchor => {
            const id = anchor.getAttribute('id');
            const text = anchor.textContent || '(invisible)';
            html += `
                <li style="padding: 5px; border-bottom: 1px solid #dee2e6;">
                    <strong>${id}</strong>
                    <span style="color: #6c757d;"> - ${text}</span>
                    <button class="link-to-anchor" data-anchor="${id}" style="margin-left: 10px; font-size: 0.85em;">Copy Link</button>
                </li>
            `;
        });
        html += '</ul>';

        list.innerHTML = html;

        // Add event listeners to copy link buttons
        document.querySelectorAll('.link-to-anchor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const anchor = e.target.dataset.anchor;
                const link = `#${anchor}`;
                navigator.clipboard.writeText(link).then(() => {
                    const original = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = original;
                    }, 2000);
                });
            });
        });
    },

    destroy() {
        const btn = document.getElementById('anchorBtn');
        const dialog = document.getElementById('anchorDialog');
        if (btn) btn.remove();
        if (dialog) dialog.remove();
    }
};
