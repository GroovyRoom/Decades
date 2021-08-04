
const DecadesGlobalHelpers = {
    IS_RUNNING_ON_GAE: function() {return process.env.NODE_ENV === "production"}
}

module.exports = DecadesGlobalHelpers