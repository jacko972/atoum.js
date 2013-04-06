var util = require('util'),
    color = require('cli-color'),
    atoum = require('../../../../')(module),
    score = require('../../../../lib/score'),
    field = require('../../../../lib/report/field'),
    testedClass = require('../../../../lib/report/fields/test/success'),
    unit = module.exports = {
        testClass: function() {
            var object;

            this
                .object(object = new testedClass()).isInstanceOf(field)
                .array(object.events).isEqualTo([ 'testMethodSuccess' ])
            ;
        },

        testToString: function() {
            var object;

            this
                .if(run = new score())
                .and(object = new testedClass())
                .then()
                    .string(object.toString()).isEqualTo(color.green('S'))
            ;
        }
    };
