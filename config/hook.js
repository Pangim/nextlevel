module.exports = {
    timeout: 100,
    load: {
        before: ['apm'],
        order: [
            "Define the hooks' load order by putting their names in this array in the right order"
        ],
        after: []
    },
    settings: {
        apm: {
            enabled: true
        }
    }
}
