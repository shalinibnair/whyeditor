/**
 * Autosave Plugin - Saves content to localStorage
 */

const AutosavePlugin = {
    name: 'autosave',
    interval: null,
    storageKey: 'whyeditor_autosave',

    init(editor, config = {}) {
        this.editor = editor;
        this.config = {
            interval: config.interval || 30000, // Default 30 seconds
            showNotification: config.showNotification !== false
        };

        this.createIndicator();
        this.startAutosave();
        this.loadSaved();
    },

    createIndicator() {
        const footer = document.querySelector('.editor-footer .editor-stats');
        if (!footer) return;

        const indicator = document.createElement('span');
        indicator.id = 'autosaveIndicator';
        indicator.className = 'autosave-indicator';
        indicator.textContent = 'Autosave: Off';
        indicator.style.marginLeft = '10px';
        indicator.style.color = '#6c757d';

        footer.appendChild(indicator);
    },

    startAutosave() {
        this.interval = setInterval(() => {
            this.save();
        }, this.config.interval);

        // Also save on input
        this.editor.content.addEventListener('input', () => {
            this.debouncedSave();
        });
    },

    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.save();
        }, 2000);
    },

    save() {
        try {
            const content = this.editor.getHTML();
            const data = {
                content: content,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };

            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.updateIndicator('Saved', true);

            if (this.config.showNotification) {
                setTimeout(() => {
                    this.updateIndicator('Autosave: On', false);
                }, 2000);
            }
        } catch (error) {
            console.error('Autosave failed:', error);
            this.updateIndicator('Save Error', false);
        }
    },

    loadSaved() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                const timestamp = new Date(data.timestamp);
                const now = new Date();
                const diffMinutes = Math.floor((now - timestamp) / 60000);

                // Only prompt if content exists and was saved recently (within 24 hours)
                if (data.content && diffMinutes < 1440) {
                    const restore = confirm(
                        `Found autosaved content from ${diffMinutes} minute(s) ago. Restore it?`
                    );

                    if (restore) {
                        this.editor.setHTML(data.content);
                        this.updateIndicator('Restored', true);
                    } else {
                        this.clear();
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load autosaved content:', error);
        }
    },

    updateIndicator(text, highlight) {
        const indicator = document.getElementById('autosaveIndicator');
        if (indicator) {
            indicator.textContent = text;
            if (highlight) {
                indicator.style.color = '#28a745';
                indicator.style.fontWeight = 'bold';
            } else {
                indicator.style.color = '#6c757d';
                indicator.style.fontWeight = 'normal';
            }
        }
    },

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            this.updateIndicator('Autosave: On', false);
        } catch (error) {
            console.error('Failed to clear autosave:', error);
        }
    },

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        const indicator = document.getElementById('autosaveIndicator');
        if (indicator) indicator.remove();
    }
};
