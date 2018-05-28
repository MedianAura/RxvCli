const get = require("lodash/get");
const generate = require('./command/generate');

module.exports = class Parser {
    constructor(options) {
        this.command = get(options, "subcommand", null);
        delete options.subcommand;
        this.options = options;

        // this.getCommand();
        generate(this.options);
    }

    getCommand() {
        switch (this.command) {
            case "new":
                break;
            case "init":
                break;
            case "generate":
                break;
            case "version":
                break;
            default:
                break;
        }
    }
};