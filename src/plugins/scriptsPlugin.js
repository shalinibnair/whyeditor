/**
 * Scripts Plugin - Subscript and Superscript
 */

const ScriptsPlugin = {
    name: 'scripts',

    init(editor, config = {}) {
        this.editor = editor;
        this.createButtons();
    },

    createButtons() {
        const toolbar = document.getElementById('toolbar');

        // Find the strikethrough button
        const strikeBtn = document.querySelector('[data-command="strikeThrough"]');
        if (!strikeBtn || !strikeBtn.parentElement) return;

        // Create subscript button
        const subBtn = document.createElement('button');
        subBtn.className = 'toolbar-btn';
        subBtn.setAttribute('data-command', 'subscript');
        subBtn.title = 'Subscript';
        subBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <text x="2" y="10" font-size="10" font-weight="bold">X</text>
                <text x="9" y="14" font-size="6">2</text>
            </svg>
        `;
        subBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.execCommand('subscript', false, null);
            this.editor.updateToolbarState();
            this.editor.saveHistory();
        });

        // Create superscript button
        const supBtn = document.createElement('button');
        supBtn.className = 'toolbar-btn';
        supBtn.setAttribute('data-command', 'superscript');
        supBtn.title = 'Superscript';
        supBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <text x="2" y="12" font-size="10" font-weight="bold">X</text>
                <text x="9" y="6" font-size="6">2</text>
            </svg>
        `;
        supBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.execCommand('superscript', false, null);
            this.editor.updateToolbarState();
            this.editor.saveHistory();
        });

        // Insert after strikethrough
        strikeBtn.after(supBtn);
        strikeBtn.after(subBtn);
    },

    destroy() {
        const subBtn = document.querySelector('[data-command="subscript"]');
        const supBtn = document.querySelector('[data-command="superscript"]');
        if (subBtn) subBtn.remove();
        if (supBtn) supBtn.remove();
    }
};
