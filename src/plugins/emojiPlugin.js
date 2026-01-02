/**
 * Emoji Plugin - Emoji Picker
 */

const EmojiPlugin = {
    name: 'emoji',

    emojis: {
        'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
        'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
        'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
        'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
        'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🥔', '🍠'],
        'Objects': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🎯', '⛳', '🎣', '🎮', '🎲', '🎭', '🎨', '🎪', '🎬', '🎤', '🎧', '🎼', '🎹', '🎺']
    },

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
        this.createPicker();
    },

    createButton() {
        const toolbar = document.getElementById('toolbar');
        const sourceBtn = document.querySelector('[data-command="sourceCode"]');
        if (!sourceBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'emojiBtn';
        btn.title = 'Insert Emoji';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePicker();
        });

        sourceBtn.before(btn);
    },

    createPicker() {
        const picker = document.createElement('div');
        picker.id = 'emojiPicker';
        picker.className = 'emoji-picker';
        picker.style.display = 'none';

        const categories = document.createElement('div');
        categories.className = 'emoji-categories';

        Object.entries(this.emojis).forEach(([category, emojis]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'emoji-category';

            const title = document.createElement('div');
            title.className = 'emoji-category-title';
            title.textContent = category;
            categoryDiv.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'emoji-grid';

            emojis.forEach(emoji => {
                const span = document.createElement('span');
                span.className = 'emoji-item';
                span.textContent = emoji;
                span.addEventListener('click', () => {
                    this.insertEmoji(emoji);
                });
                grid.appendChild(span);
            });

            categoryDiv.appendChild(grid);
            categories.appendChild(categoryDiv);
        });

        picker.appendChild(categories);
        document.body.appendChild(picker);

        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && e.target.id !== 'emojiBtn' && !e.target.closest('#emojiBtn')) {
                picker.style.display = 'none';
            }
        });
    },

    togglePicker() {
        const picker = document.getElementById('emojiPicker');
        const btn = document.getElementById('emojiBtn');

        if (picker.style.display === 'none') {
            const rect = btn.getBoundingClientRect();
            picker.style.display = 'block';
            picker.style.top = (rect.bottom + 5) + 'px';
            picker.style.left = rect.left + 'px';
        } else {
            picker.style.display = 'none';
        }
    },

    insertEmoji(emoji) {
        document.execCommand('insertText', false, emoji);
        this.editor.saveHistory();
        document.getElementById('emojiPicker').style.display = 'none';
    },

    destroy() {
        const btn = document.getElementById('emojiBtn');
        const picker = document.getElementById('emojiPicker');
        if (btn) btn.remove();
        if (picker) picker.remove();
    }
};
