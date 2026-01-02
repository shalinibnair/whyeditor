/**
 * WhyEditor - Rich Text Editor
 * A comprehensive WYSIWYG editor implementation
 */

class WhyEditor {
    constructor(contentElement, toolbarElement, config = {}) {
        this.content = contentElement;
        this.toolbar = toolbarElement;
        this.history = [];
        this.historyStep = -1;
        this.isSourceMode = false;
        this.config = config;

        // Initialize plugin manager
        this.pluginManager = new PluginManager(this);

        this.init();
    }

    init() {
        this.setupToolbar();
        this.setupContentArea();
        this.setupColorPickers();
        this.setupKeyboardShortcuts();
        this.setupHistory();
        this.initPlugins();
    }

    initPlugins() {
        // Register all plugins
        this.pluginManager.register('font', FontPlugin);
        this.pluginManager.register('scripts', ScriptsPlugin);
        this.pluginManager.register('blockquote', BlockquotePlugin);
        this.pluginManager.register('emoji', EmojiPlugin);
        this.pluginManager.register('specialChars', SpecialCharsPlugin);
        this.pluginManager.register('findReplace', FindReplacePlugin);
        this.pluginManager.register('mediaEmbed', MediaEmbedPlugin);
        this.pluginManager.register('maximize', MaximizePlugin);
        this.pluginManager.register('autosave', AutosavePlugin);
        this.pluginManager.register('print', PrintPlugin);
        this.pluginManager.register('imageUpload', ImageUploadPlugin);
        this.pluginManager.register('templates', TemplatesPlugin);
        this.pluginManager.register('anchor', AnchorPlugin);
        this.pluginManager.register('pasteCleanup', PasteCleanupPlugin);

        // Initialize plugins based on config
        const pluginsToInit = this.config.plugins || {
            font: {},
            scripts: {},
            blockquote: {},
            emoji: {},
            specialChars: {},
            findReplace: {},
            mediaEmbed: {},
            maximize: {},
            autosave: { interval: 30000 },
            print: {},
            imageUpload: {},
            templates: {},
            anchor: {},
            pasteCleanup: {}
        };

        this.pluginManager.initPlugins(pluginsToInit);
    }

    setupToolbar() {
        const buttons = this.toolbar.querySelectorAll('.toolbar-btn[data-command]');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const command = button.getAttribute('data-command');
                this.executeCommand(command);
            });
        });

        // Format block dropdown
        const formatBlock = document.getElementById('formatBlock');
        if (formatBlock) {
            formatBlock.addEventListener('change', (e) => {
                this.formatBlock(e.target.value);
                e.target.blur();
            });
        }

        // Update toolbar state on selection change
        document.addEventListener('selectionchange', () => {
            this.updateToolbarState();
        });
    }

    setupContentArea() {
        // Prevent default drag and drop for now
        this.content.addEventListener('drop', (e) => {
            e.preventDefault();
        });

        // Update stats on input
        this.content.addEventListener('input', () => {
            this.updateStats();
            this.saveHistory();
        });

        // Paste is handled by pasteCleanup plugin
    }

    setupColorPickers() {
        const textColorBtn = document.getElementById('textColorBtn');
        const textColorPicker = document.getElementById('textColorPicker');
        const textColorIndicator = document.getElementById('textColorIndicator');

        const bgColorBtn = document.getElementById('bgColorBtn');
        const bgColorPicker = document.getElementById('bgColorPicker');
        const bgColorIndicator = document.getElementById('bgColorIndicator');

        if (textColorBtn && textColorPicker) {
            textColorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                textColorPicker.click();
            });

            textColorPicker.addEventListener('input', (e) => {
                const color = e.target.value;
                textColorIndicator.style.background = color;
                this.executeCommand('foreColor', color);
            });
        }

        if (bgColorBtn && bgColorPicker) {
            bgColorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                bgColorPicker.click();
            });

            bgColorPicker.addEventListener('input', (e) => {
                const color = e.target.value;
                bgColorIndicator.style.background = color;
                this.executeCommand('backColor', color);
            });
        }
    }

    setupKeyboardShortcuts() {
        this.content.addEventListener('keydown', (e) => {
            // Ctrl/Cmd shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        this.executeCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.executeCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.executeCommand('underline');
                        break;
                    case 'z':
                        if (!e.shiftKey) {
                            e.preventDefault();
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                }
            }

            // Tab key for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.executeCommand('outdent');
                } else {
                    this.executeCommand('indent');
                }
            }
        });
    }

    setupHistory() {
        this.saveHistory();
    }

    executeCommand(command, value = null) {
        this.content.focus();

        switch (command) {
            case 'createLink':
                this.insertLink();
                break;
            case 'insertImage':
                this.insertImage();
                break;
            case 'insertTable':
                this.insertTable();
                break;
            case 'insertHorizontalRule':
                document.execCommand('insertHorizontalRule', false, null);
                break;
            case 'sourceCode':
                this.toggleSourceMode();
                break;
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'removeFormat':
                document.execCommand('removeFormat', false, null);
                document.execCommand('unlink', false, null);
                break;
            default:
                if (value !== null) {
                    document.execCommand(command, false, value);
                } else {
                    document.execCommand(command, false, null);
                }
        }

        this.updateToolbarState();
        this.saveHistory();
    }

    formatBlock(tag) {
        this.content.focus();
        document.execCommand('formatBlock', false, tag);
        this.saveHistory();
    }

    insertLink() {
        const url = prompt('Enter the URL:');
        if (url) {
            const selection = window.getSelection();
            if (selection.toString().length === 0) {
                const linkText = prompt('Enter link text:', url);
                if (linkText) {
                    const link = `<a href="${this.sanitizeUrl(url)}" target="_blank">${linkText}</a>`;
                    document.execCommand('insertHTML', false, link);
                }
            } else {
                document.execCommand('createLink', false, this.sanitizeUrl(url));
                // Set target to _blank
                const selection2 = window.getSelection();
                if (selection2.anchorNode && selection2.anchorNode.parentElement) {
                    const link = selection2.anchorNode.parentElement;
                    if (link.tagName === 'A') {
                        link.setAttribute('target', '_blank');
                    }
                }
            }
        }
    }

    insertImage() {
        const url = prompt('Enter image URL:');
        if (url) {
            const img = `<img src="${this.sanitizeUrl(url)}" alt="Image" style="max-width: 100%;">`;
            document.execCommand('insertHTML', false, img);
            this.saveHistory();
        }
    }

    insertTable() {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');

        if (rows && cols) {
            const numRows = parseInt(rows);
            const numCols = parseInt(cols);

            if (numRows > 0 && numCols > 0 && numRows <= 20 && numCols <= 20) {
                let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">';

                // Create header row
                tableHTML += '<thead><tr>';
                for (let j = 0; j < numCols; j++) {
                    tableHTML += '<th style="border: 1px solid #dee2e6; padding: 8px; background: #f8f9fa;">Header ' + (j + 1) + '</th>';
                }
                tableHTML += '</tr></thead>';

                // Create body rows
                tableHTML += '<tbody>';
                for (let i = 0; i < numRows - 1; i++) {
                    tableHTML += '<tr>';
                    for (let j = 0; j < numCols; j++) {
                        tableHTML += '<td style="border: 1px solid #dee2e6; padding: 8px;">Cell</td>';
                    }
                    tableHTML += '</tr>';
                }
                tableHTML += '</tbody></table><p><br></p>';

                document.execCommand('insertHTML', false, tableHTML);
                this.saveHistory();
            } else {
                alert('Please enter valid numbers between 1 and 20');
            }
        }
    }

    toggleSourceMode() {
        if (!this.isSourceMode) {
            // Switch to source mode
            const html = this.content.innerHTML;
            this.content.textContent = this.formatHTML(html);
            this.content.classList.add('source-view');
            this.content.contentEditable = 'true';
            this.isSourceMode = true;
        } else {
            // Switch back to visual mode
            const text = this.content.textContent;
            this.content.innerHTML = text;
            this.content.classList.remove('source-view');
            this.content.contentEditable = 'true';
            this.isSourceMode = false;
        }
    }

    formatHTML(html) {
        // Simple HTML formatting
        return html
            .replace(/></g, '>\n<')
            .replace(/\n\s*\n/g, '\n');
    }

    sanitizeUrl(url) {
        // Basic URL sanitization
        const trimmed = url.trim();
        if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
            return '';
        }
        return trimmed;
    }

    updateToolbarState() {
        if (this.isSourceMode) return;

        const buttons = this.toolbar.querySelectorAll('.toolbar-btn[data-command]');

        buttons.forEach(button => {
            const command = button.getAttribute('data-command');

            try {
                const isActive = document.queryCommandState(command);
                if (isActive) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } catch (e) {
                // Some commands don't support queryCommandState
                button.classList.remove('active');
            }
        });

        // Update format block dropdown
        const formatBlock = document.getElementById('formatBlock');
        if (formatBlock) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                let node = selection.anchorNode;
                while (node && node !== this.content) {
                    if (node.nodeType === 1) {
                        const tagName = node.tagName.toLowerCase();
                        if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre'].includes(tagName)) {
                            formatBlock.value = tagName;
                            break;
                        }
                    }
                    node = node.parentNode;
                }
            }
        }
    }

    updateStats() {
        const text = this.content.textContent || '';
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

        const charCountEl = document.getElementById('charCount');
        const wordCountEl = document.getElementById('wordCount');

        if (charCountEl) charCountEl.textContent = `Characters: ${charCount}`;
        if (wordCountEl) wordCountEl.textContent = `Words: ${wordCount}`;
    }

    saveHistory() {
        const html = this.content.innerHTML;

        // Don't save if content hasn't changed
        if (this.history[this.historyStep] === html) {
            return;
        }

        // Remove any history after current step
        this.history = this.history.slice(0, this.historyStep + 1);

        // Add new state
        this.history.push(html);
        this.historyStep++;

        // Limit history to 50 steps
        if (this.history.length > 50) {
            this.history.shift();
            this.historyStep--;
        }
    }

    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.content.innerHTML = this.history[this.historyStep];
            this.updateStats();
        }
    }

    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.content.innerHTML = this.history[this.historyStep];
            this.updateStats();
        }
    }

    cleanupContent() {
        // Remove unwanted styles and attributes from pasted content
        const elements = this.content.querySelectorAll('*');
        elements.forEach(el => {
            // Remove specific problematic attributes
            el.removeAttribute('class');
            el.removeAttribute('id');

            // Keep only specific safe inline styles
            const style = el.getAttribute('style');
            if (style) {
                // You could parse and filter styles here if needed
            }
        });
    }

    getHTML() {
        return this.content.innerHTML;
    }

    setHTML(html) {
        this.content.innerHTML = html;
        this.saveHistory();
        this.updateStats();
    }

    clear() {
        this.content.innerHTML = '<p>Start typing here...</p>';
        this.history = [];
        this.historyStep = -1;
        this.saveHistory();
        this.updateStats();
    }
}

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const editorContent = document.getElementById('editorContent');
    const toolbar = document.getElementById('toolbar');

    if (editorContent && toolbar) {
        const editor = new WhyEditor(editorContent, toolbar);

        // Get HTML button
        const getHtmlBtn = document.getElementById('getHtmlBtn');
        const htmlOutput = document.getElementById('htmlOutput');
        const htmlCode = document.getElementById('htmlCode');

        if (getHtmlBtn) {
            getHtmlBtn.addEventListener('click', () => {
                const html = editor.getHTML();
                htmlCode.textContent = html;
                htmlOutput.style.display = 'block';
                htmlOutput.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Copy HTML button
        const copyHtmlBtn = document.getElementById('copyHtmlBtn');
        if (copyHtmlBtn) {
            copyHtmlBtn.addEventListener('click', () => {
                const html = htmlCode.textContent;
                navigator.clipboard.writeText(html).then(() => {
                    const originalText = copyHtmlBtn.textContent;
                    copyHtmlBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyHtmlBtn.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy HTML. Please try again.');
                });
            });
        }

        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all content?')) {
                    editor.clear();
                    htmlOutput.style.display = 'none';
                }
            });
        }

        // Initialize stats
        editor.updateStats();

        // Make editor globally accessible for debugging
        window.editor = editor;
    }
});
