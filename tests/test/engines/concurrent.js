require('../../..')(module);

var callback = require('../../../lib/test/callback'),
    Test = require('../../../lib/test'),
    Method = require('../../../lib/test/method'),
    testedClass = require('../../../lib/test/engines/concurrent'),
    unit = module.exports = {
        testClass: function() {
            var object, dispatcher;

            this
                .if(dispatcher = {})
                .then()
                    .object(object = new testedClass(dispatcher))
                    .object(object.dispatcher).isIdenticalTo(dispatcher)
            ;
        },

        testRun: function() {
            var object, dispatcher, test, method, child;

            this
                .if(dispatcher = { emit: callback() })
                .and(object = new testedClass(dispatcher))
                .and(test = new Test('test'))
                .and(test.getMethods = function() { return []; })
                .then()
                    .void(object.run(test))
                    .callback(dispatcher.emit).wasCalled()
                        .withArguments('testStart', test)
                        .withArguments('testStop', test)
                .if(dispatcher = { emit: callback() })
                .and(method = new Method('method', test, callback()))
                .and(child = {
                    exec: function(cmd, opts, cb) {
                        cb && cb(
                            false,
                            JSON.stringify({ score: method.score }),
                            ''
                        );

                        return { stdin: { write: function() {}, end: function() {} } };
                    }
                })
                .and(object = new testedClass(dispatcher, child))
                .and(test.getMethods = function() { return [ method ]; })
                .then()
                    .void(object.run(test, child))
                    .callback(dispatcher.emit).wasCalled()
                        .withArguments('testStart', test)
                        .withArguments('testMethodStart', method)
                        .withArguments('testMethodSuccess', method)
                        .withArguments('testMethodStop', method)
                        .withArguments('testStop', test)
                .if(dispatcher = { emit: callback() })
                .and(method = new Method('method', test, callback()))
                .and(test.getMethods = function() { return [ method ]; })
                .and(child = {
                    exec: function(cmd, opts, cb) {
                        cb(
                            false,
                            JSON.stringify({ score: method.score.addFailure(new Error()) }),
                            ''
                        );

                        return { stdin: { write: function() {}, end: function() {} } };
                    }
                })
                .and(object = new testedClass(dispatcher, child))
                .then()
                    .void(object.run(test, child))
                    .callback(dispatcher.emit).wasCalled()
                        .withArguments('testStart', test)
                        .withArguments('testMethodStart', method)
                        .withArguments('testMethodFailure', method)
                        .withArguments('testStop', test)
                .if(dispatcher = { emit: callback() })
                .and(method = new Method('method', test, callback()))
                .and(test.getMethods = function() { return [ method ]; })
                .and(child = {
                    exec: function(cmd, opts, cb) {
                        cb && cb(
                            false,
                            JSON.stringify({ score: method.score.addException(new Error()) }),
                            ''
                        );

                        return { stdin: { write: function() {}, end: function() {} } };
                    }
                })
                .and(object = new testedClass(dispatcher, child))
                .then()
                    .void(object.run(test, child))
                    .callback(dispatcher.emit).wasCalled()
                        .withArguments('testStart', test)
                        .withArguments('testMethodStart', method)
                        .withArguments('testMethodException', method)
                        .withArguments('testStop', test)
                .if(dispatcher = { emit: callback() })
                .and(method = new Method('method', test, callback()))
                .and(test.getMethods = function() { return [ method ]; })
                .and(child = {
                    exec: function(cmd, opts, cb) {
                        cb && cb(
                            false,
                            JSON.stringify({ score: method.score.addSkipped(new Error()) }),
                            ''
                        );

                        return { stdin: { write: function() {}, end: function() {} } };
                    }
                })
                .and(object = new testedClass(dispatcher, child))
                .then()
                    .void(object.run(test, child))
                    .callback(dispatcher.emit).wasCalled()
                        .withArguments('testStart', test)
                        .withArguments('testMethodStart', method)
                        .withArguments('testMethodSkipped', method)
                        .withArguments('testStop', test)
                .if(dispatcher = { emit: callback() })
                .and(method = new Method('method', test, callback()))
                .and(test.getMethods = function() { return [ method ]; })
                .and(child = {
                    exec: function(cmd, opts, cb) {
                        throw new Error()
                    }
                })
                .and(object = new testedClass(dispatcher, child))
                .then()
                    .void(object.run(test, child))
                    .callback(dispatcher.emit).wasCalled()
                    .withArguments('testStart', test)
                    .withArguments('testMethodStart', method)
                    .withArguments('testError', test)
                    .withArguments('testStop', test)
                .if(dispatcher = { emit: callback() })
                .and(method = new Method('method', test, callback()))
                .and(test.getMethods = function() { return [ method ]; })
                .and(child = {
                    exec: function(cmd, opts, cb) {
                        cb && cb(new Error(), '', '');

                        return { stdin: { write: function() {}, end: function() {} } };
                    }
                })
                .and(object = new testedClass(dispatcher, child))
                .then()
                    .void(object.run(test, child))
                    .callback(dispatcher.emit).wasCalled()
                    .withArguments('testStart', test)
                    .withArguments('testMethodStart', method)
                    .withArguments('testError', test)
                    .withArguments('testStop', test)
            ;
        },

        testGetTestMethodCode: function() {
            var object, method, req;

            this
                .if(method = {
                    name: 'foobar',
                    test: {
                        class: 'foobar'
                    }
                })
                .and(object = new testedClass({}))
                .and(req = {
                    resolve: function(m) {
                        return m;
                    }
                })
                .then()
                    .string(object.getTestMethodCode(method, req)).isEqualTo(
                        "var atoum = require(\"../../..\")(module),\n"
                            .concat("    Script = require(\"../../scripts/concurrent\"),\n")
                            .concat("    script = new Script(\"" + method.test.class + "\", [ \"" + method.name + "\" ]);\n")
                            .concat("\n")
                            .concat("script.run(process);\n")
                            .concat("\n")
                            .concat("process.exit();\n")
                    )
                .if(method = {
                    name: 'foobar',
                    test: {
                        class: 'foobar',
                        coverage: true
                    }
                })
                .then()
                    .string(object.getTestMethodCode(method, req)).isEqualTo(
                        "var atoum = require(\"../../..\")(module),\n"
                            .concat("    Script = require(\"../../scripts/concurrent\"),\n")
                            .concat("    Instrument = require(\"../../includer/instrument\")\n")
                            .concat("    script = new Script(\"" + method.test.class + "\", [ \"" + method.name + "\" ]);\n")
                            .concat("\n")
                            .concat("atoum.includer = new Instrument();\n")
                            .concat("script.run(process);\n")
                            .concat("\n")
                            .concat("process.exit();\n")
                    )
            ;
        }
    };
