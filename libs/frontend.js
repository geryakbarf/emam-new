const env = process.env.NODE_ENV;
module.exports = {
    vueDeps: [
        {src: env == 'production' ? "https://cdn.jsdelivr.net/npm/vue@2" : "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"}
    ]
}