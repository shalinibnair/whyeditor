/**
 * Blockquote Plugin
 */

const BlockquotePlugin = {
    name: 'blockquote',

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
    },

    createButton() {
        const toolbar = document.getElementById('toolbar');

        // Find insert table button
        const tableBtn = document.querySelector('[data-command="insertTable"]');
        if (!tableBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.setAttribute('data-command', 'formatBlock');
        btn.title = 'Blockquote';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.298z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleBlockquote();
        });

        tableBtn.after(btn);
    },

    toggleBlockquote() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        let node = selection.anchorNode;
        let blockquote = null;

        // Check if already in blockquote
        while (node && node !== this.editor.content) {
            if (node.tagName === 'BLOCKQUOTE') {
                blockquote = node;
                break;
            }
            node = node.parentNode;
        }

        if (blockquote) {
            // Remove blockquote
            const parent = blockquote.parentNode;
            while (blockquote.firstChild) {
                parent.insertBefore(blockquote.firstChild, blockquote);
            }
            parent.removeChild(blockquote);
        } else {
            // Add blockquote
            document.execCommand('formatBlock', false, 'blockquote');
        }

        this.editor.saveHistory();
    },

    destroy() {
        const btn = document.querySelector('[data-command="formatBlock"][title="Blockquote"]');
        if (btn) btn.remove();
    }
};
