const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        home: './src/entry_home.js',
        operation: './src/entry_operation.js',
        disinfector: './src/entry_disinfector.js',
        quality: './src/entry_quality.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            chunks: ['home']
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'operation.html',
            chunks: ['operation']
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'disinfector.html',
            chunks: ['disinfector']
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'quality.html',
            chunks: ['quality']
        })
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/nccloud': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
};
