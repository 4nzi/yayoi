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
                test: /.(vert|frag|glsl)$/,
                exclude: '/node_modules/',
                type: 'asset/source'
            },
            {
                test: /.(js|ts)$/,
                exclude: '/node_modules/',
                use: 'ts-loader',
            }
        ]
    }
}