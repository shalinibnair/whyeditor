/**
 * Templates Plugin - Pre-defined content templates
 */

const TemplatesPlugin = {
    name: 'templates',

    templates: [
        {
            title: 'Business Letter',
            description: 'Formal business letter template',
            content: `
                <p>[Your Name]</p>
                <p>[Your Address]</p>
                <p>[City, State ZIP]</p>
                <p>[Date]</p>
                <p><br></p>
                <p>[Recipient Name]</p>
                <p>[Company Name]</p>
                <p>[Address]</p>
                <p>[City, State ZIP]</p>
                <p><br></p>
                <p>Dear [Recipient],</p>
                <p><br></p>
                <p>[Letter content goes here...]</p>
                <p><br></p>
                <p>Sincerely,</p>
                <p>[Your Name]</p>
            `
        },
        {
            title: 'Meeting Notes',
            description: 'Template for meeting notes',
            content: `
                <h2>Meeting Notes</h2>
                <p><strong>Date:</strong> [Date]</p>
                <p><strong>Time:</strong> [Time]</p>
                <p><strong>Attendees:</strong> [Names]</p>
                <p><br></p>
                <h3>Agenda</h3>
                <ol>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ol>
                <h3>Discussion Points</h3>
                <ul>
                    <li>Point 1</li>
                    <li>Point 2</li>
                </ul>
                <h3>Action Items</h3>
                <ul>
                    <li>[ ] Task 1 - Assigned to: [Name]</li>
                    <li>[ ] Task 2 - Assigned to: [Name]</li>
                </ul>
                <h3>Next Meeting</h3>
                <p><strong>Date:</strong> [Date]</p>
            `
        },
        {
            title: 'Blog Post',
            description: 'Blog post structure',
            content: `
                <h1>[Blog Post Title]</h1>
                <p><em>By [Author Name] | [Date]</em></p>
                <p><br></p>
                <p>[Introduction paragraph - Hook your readers...]</p>
                <p><br></p>
                <h2>Section 1</h2>
                <p>[Content for section 1...]</p>
                <p><br></p>
                <h2>Section 2</h2>
                <p>[Content for section 2...]</p>
                <p><br></p>
                <h2>Conclusion</h2>
                <p>[Wrap up your thoughts...]</p>
                <p><br></p>
                <hr>
                <p><em>Tags: [tag1], [tag2], [tag3]</em></p>
            `
        },
        {
            title: 'Product Description',
            description: 'E-commerce product description',
            content: `
                <h2>[Product Name]</h2>
                <p><strong>Price:</strong> $[XX.XX]</p>
                <p><br></p>
                <h3>Description</h3>
                <p>[Detailed product description...]</p>
                <p><br></p>
                <h3>Features</h3>
                <ul>
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                </ul>
                <h3>Specifications</h3>
                <table>
                    <tr><th>Property</th><th>Value</th></tr>
                    <tr><td>Dimensions</td><td>[Size]</td></tr>
                    <tr><td>Weight</td><td>[Weight]</td></tr>
                    <tr><td>Material</td><td>[Material]</td></tr>
                </table>
                <p><br></p>
                <p><strong>Availability:</strong> In Stock</p>
            `
        },
        {
            title: 'Resume/CV',
            description: 'Professional resume template',
            content: `
                <h1>[Your Name]</h1>
                <p>[Email] | [Phone] | [Location]</p>
                <hr>
                <h2>Professional Summary</h2>
                <p>[Brief overview of your experience and skills...]</p>
                <h2>Experience</h2>
                <h3>[Job Title] - [Company Name]</h3>
                <p><em>[Start Date] - [End Date]</em></p>
                <ul>
                    <li>Achievement or responsibility 1</li>
                    <li>Achievement or responsibility 2</li>
                    <li>Achievement or responsibility 3</li>
                </ul>
                <h2>Education</h2>
                <h3>[Degree] - [Institution]</h3>
                <p><em>[Graduation Year]</em></p>
                <h2>Skills</h2>
                <ul>
                    <li>Skill 1</li>
                    <li>Skill 2</li>
                    <li>Skill 3</li>
                </ul>
            `
        },
        {
            title: 'Press Release',
            description: 'Press release format',
            content: `
                <p><strong>FOR IMMEDIATE RELEASE</strong></p>
                <p><br></p>
                <h1>[Headline]</h1>
                <h2>[Subheadline]</h2>
                <p><br></p>
                <p><strong>[CITY, State] – [Date]</strong> – [Opening paragraph with the main news...]</p>
                <p><br></p>
                <p>[Supporting paragraph with additional details...]</p>
                <p><br></p>
                <p>[Quote from company spokesperson]: "[Quote text here]"</p>
                <p><br></p>
                <p>[Additional information and context...]</p>
                <p><br></p>
                <hr>
                <h3>About [Company Name]</h3>
                <p>[Company boilerplate...]</p>
                <p><br></p>
                <p><strong>Media Contact:</strong></p>
                <p>[Name]</p>
                <p>[Email]</p>
                <p>[Phone]</p>
            `
        }
    ],

    init(editor, config = {}) {
        this.editor = editor;
        if (config.templates) {
            this.templates = [...this.templates, ...config.templates];
        }
        this.createButton();
        this.createDialog();
    },

    createButton() {
        const printBtn = document.getElementById('printBtn');
        if (!printBtn) return;

        const btn = document.createElement('button');
        btn.className = 'toolbar-btn';
        btn.id = 'templatesBtn';
        btn.title = 'Insert Template';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                <path d="M5 7a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
            </svg>
        `;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDialog();
        });

        printBtn.after(btn);
    },

    createDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'templatesDialog';
        dialog.className = 'plugin-dialog';
        dialog.style.display = 'none';

        let templatesHTML = '';
        this.templates.forEach((template, index) => {
            templatesHTML += `
                <div class="template-item" data-index="${index}">
                    <h4>${template.title}</h4>
                    <p>${template.description}</p>
                </div>
            `;
        });

        dialog.innerHTML = `
            <div class="plugin-dialog-content templates-dialog">
                <h3>Choose a Template</h3>
                <div class="templates-list">
                    ${templatesHTML}
                </div>
                <div class="dialog-buttons">
                    <button class="action-btn secondary" id="closeTemplates">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Add click listeners to template items
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.insertTemplate(index);
            });
        });

        document.getElementById('closeTemplates').addEventListener('click', () => {
            this.hideDialog();
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hideDialog();
            }
        });
    },

    showDialog() {
        document.getElementById('templatesDialog').style.display = 'flex';
    },

    hideDialog() {
        document.getElementById('templatesDialog').style.display = 'none';
    },

    insertTemplate(index) {
        const template = this.templates[index];
        if (!template) return;

        const confirm = window.confirm(
            'This will replace all current content. Continue?'
        );

        if (confirm) {
            this.editor.setHTML(template.content);
            this.hideDialog();
        }
    },

    destroy() {
        const btn = document.getElementById('templatesBtn');
        const dialog = document.getElementById('templatesDialog');
        if (btn) btn.remove();
        if (dialog) dialog.remove();
    }
};
