/**
 * Plugin Manager for WhyEditor
 * Handles plugin registration, initialization, and management
 */

class PluginManager {
    constructor(editor) {
        this.editor = editor;
        this.plugins = new Map();
        this.activePlugins = new Set();
    }

    /**
     * Register a plugin
     */
    register(name, plugin) {
        if (this.plugins.has(name)) {
            console.warn(`Plugin ${name} is already registered`);
            return;
        }
        this.plugins.set(name, plugin);
    }

    /**
     * Initialize a plugin
     */
    init(name, config = {}) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            console.error(`Plugin ${name} not found`);
            return;
        }

        if (this.activePlugins.has(name)) {
            console.warn(`Plugin ${name} is already initialized`);
            return;
        }

        try {
            plugin.init(this.editor, config);
            this.activePlugins.add(name);
        } catch (error) {
            console.error(`Failed to initialize plugin ${name}:`, error);
        }
    }

    /**
     * Initialize multiple plugins
     */
    initPlugins(pluginConfigs) {
        Object.entries(pluginConfigs).forEach(([name, config]) => {
            this.init(name, config);
        });
    }

    /**
     * Get a plugin
     */
    get(name) {
        return this.plugins.get(name);
    }

    /**
     * Check if plugin is active
     */
    isActive(name) {
        return this.activePlugins.has(name);
    }

    /**
     * Destroy a plugin
     */
    destroy(name) {
        const plugin = this.plugins.get(name);
        if (plugin && plugin.destroy) {
            plugin.destroy();
        }
        this.activePlugins.delete(name);
    }

    /**
     * Destroy all plugins
     */
    destroyAll() {
        this.activePlugins.forEach(name => this.destroy(name));
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PluginManager;
}
