module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ["module:react-native-dotenv", {
                moduleName: "@env",
                path: ".env",
                safe: true, // Verifica que todas existan en .env.example
                allowUndefined: false // Falla si falta una → más seguro
            }]
        ]
    };
};
