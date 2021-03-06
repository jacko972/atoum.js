"use strict";

require("../..")(module);

var Light = require("./light"),
    fields = require("../report/fields"),
    cli = module.exports = function cli(output) {
        Light.call(this, output);

        this
            .addField(new fields.runner.node())
            .addField(new fields.test.header())
            .addField(new fields.test.footer())
        ;
    };

cli.prototype = new Light();
cli.prototype.constructor = cli;
