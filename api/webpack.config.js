const path = require('path');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    resolve: {
        extensions: ['.ts', 'tsx', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: slsw.lib.webpack.isLocal ? './tsconfig.json' : './tsconfig-build.json'
            })
        ]
    },
    externals: ['_http_common', 'encoding', nodeExternals()],
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, '.webpack')
                    ]
                ]
            }
        ]
    },
    plugins: [new CopyPlugin({ patterns: [{ from: 'assets', to: 'assets' }] })]
};
