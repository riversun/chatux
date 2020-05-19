const packageJson = require('./package.json');
const version = packageJson.version;
const path = require("path");

const webpack = require('webpack');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',
        devServer: {
            open: true,
            openPage: 'index.html',
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            port: 8080,
            host: argv.mode === 'production' ? `0.0.0.0` : `localhost`,
            disableHostCheck: true
        },
        entry: {'chatux': './src/index.js'},
        output: {
            path: path.join(__dirname, "dist"),
            publicPath: '/js/',
            filename: argv.mode === 'production' ? `[name].min.js` : `[name].js`,
            library: '',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            'useBuiltIns': 'usage',
                                            'targets': '> 0.25%, not dead'
                                        }
                                    ]
                                ]
                            }
                        }
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    use: [
                        {loader: 'url-loader'},
                    ]
                },
            ],

        },
        resolve: {
            alias: {
                'vue': 'vue/dist/vue.min.js',
            }
        },
        plugins: [
            new webpack.BannerPlugin(`[name] v${version} Copyright (c) 2019 Tom Misawa, riversun.org@gmail.com, https://github.com/riversun`)
        ],
    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
    }

    return conf;

};