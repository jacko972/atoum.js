"use strict";

require("..")(module);

var underscore = require("underscore"),
    Usage = require("./test/score/usage"),
    Coverage = require("./test/score/coverage"),
    score = module.exports = function score() {
        this.reset();
    };

score.prototype = {
    reset: function () {
        this.tests = {};
        this.passedTests = 0;
        this.failedTests = 0;

        this.methods = 0;
        this.failedMethods = 0;
        this.passedMethods = 0;

        this.failures = 0;
        this.errors = 0;
        this.exceptions = 0;
        this.skipped = 0;

        this.assertions = 0;
        this.duration = 0;
        this.runningDuration = 0;
        this.passed = true;

        this.usage = new Usage();
        this.coverage = new Coverage();
    },

    addTest: function (test) {
        this.tests[test.class] = test.score;
        this.failures += test.score.failures;
        this.errors += test.score.errors.length;
        this.exceptions += test.score.exceptions;
        this.methods += underscore.size(test.score.methods);
        this.failedMethods += test.score.failedMethods;
        this.passedMethods += test.score.passedMethods;
        this.duration += test.score.duration;
        this.skipped += test.score.skipped;
        this.assertions += test.score.assertions;

        if(false === test.score.passed) {
            this.failedTests += 1;
            this.passed = false;
        } else {
            this.passedTests += 1;
        }

        this.usage.addFromStat(test.score.usage.stat);
        this.coverage.merge(test.score.coverage);

        return this;
    }
};
