/**
 * Print Plugin
 */

const PrintPlugin = {
    name: 'print',

    init(editor, config = {}) {
        this.editor = editor;
        this.createButton();
    },

    createButton() {
        const maximizeBtn = document.getElementById('maximizeBtn');
        if (!maximizeBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'printBtn';
        btn.title = 'Print';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.print();
        });

        maximizeBtn.after(btn);

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.print();
            }
        });
    },

    print() {
        const content = this.editor.getHTML();

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print - WhyEditor</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        margin-top: 1em;
                        margin-bottom: 0.5em;
                    }
                    p {
                        margin: 0.5em 0;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 10px 0;
                    }
                    table td, table th {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    table th {
                        background: #f8f9fa;
                        font-weight: bold;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                    blockquote {
                        border-left: 4px solid #667eea;
                        padding-left: 15px;
                        margin: 10px 0;
                        color: #6c757d;
                        font-style: italic;
                    }
                    pre {
                        background: #f8f9fa;
                        border: 1px solid #dee2e6;
                        border-radius: 4px;
                        padding: 10px;
                        overflow-x: auto;
                        font-family: 'Courier New', monospace;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `);
        printWindow.document.close();

        // Wait for content to load, then print
        printWindow.onload = function() {
            printWindow.focus();
            printWindow.print();
            // Close after printing (user can cancel)
            setTimeout(() => {
                printWindow.close();
            }, 100);
        };
    },

    destroy() {
        const btn = document.getElementById('printBtn');
        if (btn) btn.remove();
    }
};
