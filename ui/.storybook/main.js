const path = require('path');

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        'storybook-tailwind-dark-mode',
        {
            name: '@storybook/addon-postcss',
            options: {
                postcssLoaderOptions: {
                    implementation: require('postcss')
                }
            }
        }
    ],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5'
    },
    typescript: { reactDocgen: false },
    webpackFinal: async (config, { configType }) => {
        (config.resolve.alias = {
            ...config.resolve.alias,
            '@components': path.resolve(__dirname, '../src/components'),
            '@config': path.resolve(__dirname, '../src/config'),
            '@layouts': path.resolve(__dirname, '../src/layouts'),
            '@assets': path.resolve(__dirname, '../src/assets'),
            '@mocks': path.resolve(__dirname, '../src/mocks'),
            '@stores': path.resolve(__dirname, '../src/stores'),
            '@interfaces': path.resolve(__dirname, '../src/lib/interfaces'),
            '@types': path.resolve(__dirname, '../src/lib/types'),
            '@helpers': path.resolve(__dirname, '../src/lib/helpers'),
            '@api': path.resolve(__dirname, '../src/lib/api'),
            '@documentation': path.resolve(__dirname, '../src/lib/documentation')
        }),
            (config.resolve.fallback = {
                stream: require.resolve('stream-browserify'),
                crypto: require.resolve('crypto-browserify')
            });

        return config;
    }
};
