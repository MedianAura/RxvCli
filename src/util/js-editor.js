const debug = require('debug')('rxvcli:js-editor');
const chalk = require('chalk');
const estraverse = require('estraverse');
const jetpack = require('fs-jetpack');
const path = require("path");
const recast = require("recast");
const {findIndex} = require('lodash');

function addToMainFile(configFile, typeName, typePath, nodeName) {
    let fileContent = jetpack.read(configFile);
    let ast = recast.parse(fileContent);

    let b = recast.types.builders;
    let nodeComponent = b.propertyPattern(b.identifier(typeName), b.literal(typePath));

    let isModified = true;
    estraverse.traverse(ast.program, {
        enter: function (node, parent) {
            if (node.type === "Property" && node.key.name === typeName) {
                debug(`La node ${typeName} existe déja dans le fichier de configuration.`);
                isModified = false;
                this.break();
            }

            if (node.type === "Property" && node.key.name === nodeName) {
                let t = findIndex(parent.properties, node);
                parent.properties.splice(t + 1, 0, nodeComponent);
            }
        }
    });

    if (!isModified) return false;

    let output = recast.print(ast).code;

    const esformatter = require('esformatter');
    output = esformatter.format(output, {
        "indent": {"value": '    '},
        "lineBreak": {"after": {"Property": 1}, "before": {"Property": 1}}
    });
    jetpack.write(configFile, output);
    return chalk`{yellow.bold UPDATED FILE} ${path.join("src/app", configFile).replace(/\\/gmi, "/")}`;
}

module.exports = addToMainFile;