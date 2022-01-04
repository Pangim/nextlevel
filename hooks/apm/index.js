module.exports = strapi => {
    const hook = {
        /**
         * Default options
         */

        defaults: {
            // Add this to the VERY top of the first file loaded in your app
        },

        /**
         * Initialize the hook
         */

        async initialize() {}
    }

    return hook
}
