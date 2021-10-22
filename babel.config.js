module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        'babel-preset-expo'
    ],
    plugins: [
        ["@babel/plugin-proposal-private-property-in-object", {"loose": true}],
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
    ]
}