/**
 * Find and Replace Plugin
 */

const FindReplacePlugin = {
    name: 'findReplace',

    currentIndex: 0,
    matches: [],

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
        this.createDialog();
    },

    createButton() {
        const toolbar = document.getElementById('toolbar');
        const specialCharsBtn = document.getElementById('specialCharsBtn');
        if (!specialCharsBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'findReplaceBtn';
        btn.title = 'Find and Replace';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDialog();
        });

        specialCharsBtn.after(btn);

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                this.showDialog();
            }
        });
    },

    createDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'findReplaceDialog';
        dialog.className = 'plugin-dialog';
        dialog.style.display = 'none';

        dialog.innerHTML = `
            <div class="plugin-dialog-content find-replace-dialog">
                <h3>Find and Replace</h3>
                <div class="find-replace-form">
                    <div class="form-group">
                        <label>Find:</label>
                        <input type="text" id="findText" placeholder="Enter text to find" />
                    </div>
                    <div class="form-group">
                        <label>Replace with:</label>
                        <input type="text" id="replaceText" placeholder="Enter replacement text" />
                    </div>
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" id="caseSensitive" />
                            <span>Case sensitive</span>
                        </label>
                        <label>
                            <input type="checkbox" id="wholeWord" />
                            <span>Whole words only</span>
                        </label>
                    </div>
                    <div class="find-status" id="findStatus"></div>
                </div>
                <div class="dialog-buttons">
                    <button class="action-btn" id="findNextBtn">Find Next</button>
                    <button class="action-btn" id="replaceCurrent">Replace</button>
                    <button class="action-btn" id="replaceAllBtn">Replace All</button>
                    <button class="action-btn secondary" id="closeFindReplace">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Event listeners
        document.getElementById('findNextBtn').addEventListener('click', () => this.findNext());
        document.getElementById('replaceCurrent').addEventListener('click', () => this.replaceCurrent());
        document.getElementById('replaceAllBtn').addEventListener('click', () => this.replaceAll());
        document.getElementById('closeFindReplace').addEventListener('click', () => this.hideDialog());

        document.getElementById('findText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.findNext();
            }
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hideDialog();
            }
        });
    },

    showDialog() {
        const dialog = document.getElementById('findReplaceDialog');
        dialog.style.display = 'flex';
        document.getElementById('findText').focus();
    },

    hideDialog() {
        document.getElementById('findReplaceDialog').style.display = 'none';
        this.clearHighlights();
    },

    findNext() {
        const findText = document.getElementById('findText').value;
        if (!findText) return;

        const caseSensitive = document.getElementById('caseSensitive').checked;
        const wholeWord = document.getElementById('wholeWord').checked;

        this.clearHighlights();

        const content = this.editor.content.textContent;
        const regex = this.buildRegex(findText, caseSensitive, wholeWord);
        const matches = [...content.matchAll(regex)];

        if (matches.length === 0) {
            document.getElementById('findStatus').textContent = 'No matches found';
            return;
        }

        this.matches = matches;
        this.currentIndex = (this.currentIndex + 1) % matches.length;

        document.getElementById('findStatus').textContent =
            `Match ${this.currentIndex + 1} of ${matches.length}`;

        this.highlightMatch(this.currentIndex);
    },

    replaceCurrent() {
        const replaceText = document.getElementById('replaceText').value;
        if (this.matches.length === 0) {
            this.findNext();
            return;
        }

        // Get current selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replaceText));
            this.editor.saveHistory();
        }

        this.matches = [];
        this.currentIndex = 0;
        this.findNext();
    },

    replaceAll() {
        const findText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;

        if (!findText) return;

        const caseSensitive = document.getElementById('caseSensitive').checked;
        const wholeWord = document.getElementById('wholeWord').checked;

        const regex = this.buildRegex(findText, caseSensitive, wholeWord);
        const html = this.editor.content.innerHTML;
        const newHtml = html.replace(regex, replaceText);

        this.editor.content.innerHTML = newHtml;
        this.editor.saveHistory();

        const count = (html.match(regex) || []).length;
        document.getElementById('findStatus').textContent = `Replaced ${count} occurrence(s)`;

        this.matches = [];
        this.currentIndex = 0;
    },

    buildRegex(text, caseSensitive, wholeWord) {
        let pattern = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
            pattern = `\\b${pattern}\\b`;
        }
        const flags = caseSensitive ? 'g' : 'gi';
        return new RegExp(pattern, flags);
    },

    highlightMatch(index) {
        // Simple implementation - scroll to and select the match
        // More sophisticated highlighting would require DOM manipulation
        const match = this.matches[index];
        const content = this.editor.content;

        const range = document.createRange();
        const selection = window.getSelection();

        const textNode = this.findTextNode(content, match.index);
        if (textNode) {
            const offset = match.index - this.getNodeOffset(content, textNode);
            range.setStart(textNode, offset);
            range.setEnd(textNode, offset + match[0].length);

            selection.removeAllRanges();
            selection.addRange(range);

            // Scroll into view
            const span = document.createElement('span');
            range.surroundContents(span);
            span.scrollIntoView({ behavior: 'smooth', block: 'center' });
            range.selectNodeContents(span);
            span.outerHTML = span.innerHTML;
        }
    },

    findTextNode(node, targetOffset) {
        let offset = 0;
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            const length = currentNode.textContent.length;
            if (offset + length > targetOffset) {
                return currentNode;
            }
            offset += length;
        }
        return null;
    },

    getNodeOffset(root, targetNode) {
        let offset = 0;
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            if (currentNode === targetNode) {
                return offset;
            }
            offset += currentNode.textContent.length;
        }
        return offset;
    },

    clearHighlights() {
        // Remove any highlighting
        const selection = window.getSelection();
        selection.removeAllRanges();
    },

    destroy() {
        const btn = document.getElementById('findReplaceBtn');
        const dialog = document.getElementById('findReplaceDialog');
        if (btn) btn.remove();
        if (dialog) dialog.remove();
    }
};
