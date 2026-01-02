/**
 * Special Characters Plugin
 */

const SpecialCharsPlugin = {
    name: 'specialChars',

    characters: [
        // Common
        { char: '©', name: 'Copyright' },
        { char: '®', name: 'Registered' },
        { char: '™', name: 'Trademark' },
        { char: '€', name: 'Euro' },
        { char: '£', name: 'Pound' },
        { char: '¥', name: 'Yen' },
        { char: '$', name: 'Dollar' },
        { char: '¢', name: 'Cent' },
        // Math
        { char: '±', name: 'Plus-minus' },
        { char: '×', name: 'Multiplication' },
        { char: '÷', name: 'Division' },
        { char: '≠', name: 'Not equal' },
        { char: '≈', name: 'Approximately' },
        { char: '≤', name: 'Less than or equal' },
        { char: '≥', name: 'Greater than or equal' },
        { char: '∞', name: 'Infinity' },
        { char: '√', name: 'Square root' },
        { char: '∑', name: 'Sum' },
        { char: '∏', name: 'Product' },
        { char: '∫', name: 'Integral' },
        // Arrows
        { char: '←', name: 'Left arrow' },
        { char: '→', name: 'Right arrow' },
        { char: '↑', name: 'Up arrow' },
        { char: '↓', name: 'Down arrow' },
        { char: '↔', name: 'Left-right arrow' },
        { char: '⇐', name: 'Left double arrow' },
        { char: '⇒', name: 'Right double arrow' },
        { char: '⇔', name: 'Left-right double arrow' },
        // Symbols
        { char: '•', name: 'Bullet' },
        { char: '◦', name: 'White bullet' },
        { char: '‣', name: 'Triangle bullet' },
        { char: '⁃', name: 'Hyphen bullet' },
        { char: '★', name: 'Star' },
        { char: '☆', name: 'White star' },
        { char: '♠', name: 'Spade' },
        { char: '♣', name: 'Club' },
        { char: '♥', name: 'Heart' },
        { char: '♦', name: 'Diamond' },
        { char: '§', name: 'Section' },
        { char: '¶', name: 'Paragraph' },
        { char: '†', name: 'Dagger' },
        { char: '‡', name: 'Double dagger' },
        // Punctuation
        { char: '…', name: 'Ellipsis' },
        { char: '—', name: 'Em dash' },
        { char: '–', name: 'En dash' },
        { char: '"', name: 'Left double quote' },
        { char: '"', name: 'Right double quote' },
        { char: ''', name: 'Left single quote' },
        { char: ''', name: 'Right single quote' },
        { char: '«', name: 'Left guillemet' },
        { char: '»', name: 'Right guillemet' },
        // Latin
        { char: 'á', name: 'a acute' },
        { char: 'é', name: 'e acute' },
        { char: 'í', name: 'i acute' },
        { char: 'ó', name: 'o acute' },
        { char: 'ú', name: 'u acute' },
        { char: 'ñ', name: 'n tilde' },
        { char: 'ä', name: 'a umlaut' },
        { char: 'ö', name: 'o umlaut' },
        { char: 'ü', name: 'u umlaut' },
        { char: 'ß', name: 'sharp s' },
        { char: 'à', name: 'a grave' },
        { char: 'è', name: 'e grave' },
        { char: 'ì', name: 'i grave' },
        { char: 'ò', name: 'o grave' },
        { char: 'ù', name: 'u grave' },
        { char: 'â', name: 'a circumflex' },
        { char: 'ê', name: 'e circumflex' },
        { char: 'î', name: 'i circumflex' },
        { char: 'ô', name: 'o circumflex' },
        { char: 'û', name: 'u circumflex' }
    ],

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
        this.createDialog();
    },

    createButton() {
        const toolbar = document.getElementById('toolbar');
        const emojiBtn = document.getElementById('emojiBtn');
        if (!emojiBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'specialCharsBtn';
        btn.title = 'Special Characters';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z"/>
                <path d="M6.354 8.854a.5.5 0 0 1-.708 0L4 7.207 2.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDialog();
        });

        emojiBtn.after(btn);
    },

    createDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'specialCharsDialog';
        dialog.className = 'plugin-dialog';
        dialog.style.display = 'none';

        dialog.innerHTML = `
            <div class="plugin-dialog-content special-chars-dialog">
                <h3>Insert Special Character</h3>
                <div class="special-chars-grid" id="specialCharsGrid"></div>
                <div class="dialog-buttons">
                    <button class="action-btn secondary" id="closeSpecialChars">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const grid = document.getElementById('specialCharsGrid');
        this.characters.forEach(item => {
            const charDiv = document.createElement('div');
            charDiv.className = 'special-char-item';
            charDiv.title = item.name;
            charDiv.innerHTML = `
                <span class="char">${item.char}</span>
                <span class="char-name">${item.name}</span>
            `;
            charDiv.addEventListener('click', () => {
                this.insertCharacter(item.char);
            });
            grid.appendChild(charDiv);
        });

        document.getElementById('closeSpecialChars').addEventListener('click', () => {
            this.hideDialog();
        });

        // Close on overlay click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hideDialog();
            }
        });
    },

    showDialog() {
        document.getElementById('specialCharsDialog').style.display = 'flex';
    },

    hideDialog() {
        document.getElementById('specialCharsDialog').style.display = 'none';
    },

    insertCharacter(char) {
        document.execCommand('insertText', false, char);
        this.editor.saveHistory();
        this.hideDialog();
        this.editor.content.focus();
    },

    destroy() {
        const btn = document.getElementById('specialCharsBtn');
        const dialog = document.getElementById('specialCharsDialog');
        if (btn) btn.remove();
        if (dialog) dialog.remove();
    }
};
