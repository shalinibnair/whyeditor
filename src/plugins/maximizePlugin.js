/**
 * Maximize/Fullscreen Plugin
 */

const MaximizePlugin = {
    name: 'maximize',
    isMaximized: false,

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
    },

    createButton() {
        const toolbar = document.getElementById('toolbar');
        const removeFormatBtn = document.querySelector('[data-command="removeFormat"]');
        if (!removeFormatBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'maximizeBtn';
        btn.title = 'Maximize Editor';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        removeFormatBtn.after(btn);

        // ESC key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMaximized) {
                this.toggle();
            }
        });
    },

    toggle() {
        const editorWrapper = document.querySelector('.editor-wrapper');
        const btn = document.getElementById('maximizeBtn');

        if (!this.isMaximized) {
            // Maximize
            editorWrapper.classList.add('maximized');
            document.body.style.overflow = 'hidden';
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
                </svg>
            `;
            btn.title = 'Exit Fullscreen';
            this.isMaximized = true;
        } else {
            // Restore
            editorWrapper.classList.remove('maximized');
            document.body.style.overflow = '';
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                </svg>
            `;
            btn.title = 'Maximize Editor';
            this.isMaximized = false;
        }
    },

    destroy() {
        const btn = document.getElementById('maximizeBtn');
        if (btn) btn.remove();

        if (this.isMaximized) {
            this.toggle();
        }
    }
};
