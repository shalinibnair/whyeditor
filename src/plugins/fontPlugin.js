/**
 * Font Plugin - Font Family and Font Size
 */

const FontPlugin = {
    name: 'font',

    init(editor, config = {}) {
        this.editor = editor;
        this.config = {
            fonts: config.fonts || [
                'Arial', 'Comic Sans MS', 'Courier New', 'Georgia',
                'Lucida Sans Unicode', 'Tahoma', 'Times New Roman',
                'Trebuchet MS', 'Verdana', 'Impact'
            ],
            sizes: config.sizes || ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72']
        };

        this.createFontFamilySelector();
        this.createFontSizeSelector();
    },

    createFontFamilySelector() {
        const toolbar = document.getElementById('toolbar');
        const group = document.createElement('div');
        group.className = 'toolbar-group';

        const select = document.createElement('select');
        select.className = 'toolbar-select';
        select.id = 'fontFamily';
        select.title = 'Font Family';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Font';
        select.appendChild(defaultOption);

        this.config.fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const font = e.target.value;
            if (font) {
                document.execCommand('fontName', false, font);
                this.editor.saveHistory();
            }
            e.target.value = '';
        });

        group.appendChild(select);

        // Insert after format block
        const formatBlock = document.getElementById('formatBlock');
        if (formatBlock && formatBlock.parentElement) {
            formatBlock.parentElement.after(group);
        }
    },

    createFontSizeSelector() {
        const toolbar = document.getElementById('toolbar');
        const group = document.createElement('div');
        group.className = 'toolbar-group';

        const select = document.createElement('select');
        select.className = 'toolbar-select';
        select.id = 'fontSize';
        select.title = 'Font Size';
        select.style.minWidth = '70px';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Size';
        select.appendChild(defaultOption);

        this.config.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size + 'px';
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const size = e.target.value;
            if (size) {
                // Use CSS styling for more control
                document.execCommand('fontSize', false, '7'); // Temporary
                const fontElements = document.getElementsByTagName('font');
                for (let element of fontElements) {
                    element.removeAttribute('size');
                    element.style.fontSize = size + 'px';
                }
                this.editor.saveHistory();
            }
            e.target.value = '';
        });

        group.appendChild(select);

        const fontFamily = document.getElementById('fontFamily');
        if (fontFamily && fontFamily.parentElement) {
            fontFamily.parentElement.after(group);
        }
    },

    destroy() {
        const fontFamily = document.getElementById('fontFamily');
        const fontSize = document.getElementById('fontSize');
        if (fontFamily) fontFamily.parentElement.remove();
        if (fontSize) fontSize.parentElement.remove();
    }
};
