module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        library: {
            name: 'Yayoi',
            export: 'default',
            type: 'umd',
        },
        filename: "yayoi.js"
    },
    devServer: {
        static: "./dist",
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /.(vert|frag|glsl)$/,
                use: 'raw-loader'
            }
        ]
    }
}