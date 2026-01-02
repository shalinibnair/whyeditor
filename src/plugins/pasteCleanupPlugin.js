/**
 * Paste Cleanup Plugin - Clean pasted content from Word, Google Docs, etc.
 */

const PasteCleanupPlugin = {
    name: 'pasteCleanup',

    init(editor, config = {}) {
        this.editor = editor;
        this.config = {
            removeStyles: config.removeStyles !== false,
            removeClasses: config.removeClasses !== false,
            removeIds: config.removeIds !== false,
            removeFontTags: config.removeFontTags !== false,
            removeComments: config.removeComments !== false
        };

        this.setupPasteHandler();
    },

    setupPasteHandler() {
        this.editor.content.addEventListener('paste', (e) => {
            e.preventDefault();

            // Get pasted data
            const clipboardData = e.clipboardData || window.clipboardData;
            let pastedHTML = clipboardData.getData('text/html');
            const pastedText = clipboardData.getData('text/plain');

            // If no HTML, use plain text
            if (!pastedHTML) {
                const cleaned = this.cleanPlainText(pastedText);
                document.execCommand('insertHTML', false, cleaned);
                return;
            }

            // Clean HTML
            const cleaned = this.cleanHTML(pastedHTML);
            document.execCommand('insertHTML', false, cleaned);

            this.editor.saveHistory();
        });
    },

    cleanPlainText(text) {
        // Convert plain text to HTML paragraphs
        return text
            .split('\n\n')
            .map(para => para.trim())
            .filter(para => para.length > 0)
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');
    },

    cleanHTML(html) {
        // Create a temporary div to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove Microsoft Word specific tags
        this.removeWordTags(temp);

        // Remove comments
        if (this.config.removeComments) {
            this.removeComments(temp);
        }

        // Clean attributes
        this.cleanAttributes(temp);

        // Remove empty elements
        this.removeEmptyElements(temp);

        // Clean font tags
        if (this.config.removeFontTags) {
            this.removeFontTags(temp);
        }

        return temp.innerHTML;
    },

    removeWordTags(element) {
        // Remove Word-specific elements
        const wordTags = ['o:p', 'w:sdt', 'w:sdtpr', 'w:sdtcontent'];
        wordTags.forEach(tag => {
            const elements = element.querySelectorAll(tag);
            elements.forEach(el => el.remove());
        });

        // Remove Word XML
        const xmlElements = element.querySelectorAll('xml');
        xmlElements.forEach(el => el.remove());

        // Remove style and script tags
        element.querySelectorAll('style, script').forEach(el => el.remove());
    },

    removeComments(element) {
        const iterator = document.createNodeIterator(
            element,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        const comments = [];
        let currentNode;
        while (currentNode = iterator.nextNode()) {
            comments.push(currentNode);
        }

        comments.forEach(comment => comment.remove());
    },

    cleanAttributes(element) {
        const allElements = element.querySelectorAll('*');

        allElements.forEach(el => {
            // Remove classes
            if (this.config.removeClasses) {
                el.removeAttribute('class');
            }

            // Remove IDs
            if (this.config.removeIds) {
                el.removeAttribute('id');
            }

            // Remove or clean style attribute
            if (this.config.removeStyles) {
                el.removeAttribute('style');
            } else {
                // Keep only safe styles
                this.cleanStyleAttribute(el);
            }

            // Remove data attributes
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('data-') ||
                    attr.name.startsWith('xmlns') ||
                    attr.name.startsWith('v:') ||
                    attr.name.startsWith('o:')) {
                    el.removeAttribute(attr.name);
                }
            });

            // Remove lang attributes
            el.removeAttribute('lang');
        });
    },

    cleanStyleAttribute(element) {
        const style = element.getAttribute('style');
        if (!style) return;

        // Allowed CSS properties
        const allowed = ['color', 'background-color', 'font-weight', 'font-style', 'text-decoration'];

        const styles = style.split(';').filter(s => s.trim());
        const cleaned = styles.filter(s => {
            const prop = s.split(':')[0].trim();
            return allowed.includes(prop);
        }).join('; ');

        if (cleaned) {
            element.setAttribute('style', cleaned);
        } else {
            element.removeAttribute('style');
        }
    },

    removeFontTags(element) {
        const fontTags = element.querySelectorAll('font');
        fontTags.forEach(font => {
            // Replace font tag with its content
            const parent = font.parentNode;
            while (font.firstChild) {
                parent.insertBefore(font.firstChild, font);
            }
            parent.removeChild(font);
        });
    },

    removeEmptyElements(element) {
        const allElements = element.querySelectorAll('*');

        allElements.forEach(el => {
            // Don't remove br, hr, img, etc.
            if (['BR', 'HR', 'IMG', 'INPUT'].includes(el.tagName)) {
                return;
            }

            // Remove if empty
            if (!el.textContent.trim() && el.children.length === 0) {
                el.remove();
            }
        });
    },

    destroy() {
        // Paste handler is on the editor content, would need reference to remove
        // For now, it will remain active
    }
};
