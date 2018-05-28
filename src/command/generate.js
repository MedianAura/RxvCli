const debug = require('debug')('rxvcli:generate');
const addToMainFile = require('../util/js-editor');
const generator = require('./generator/generator');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const mkdirp = require('mkdirp');
const jetpack = require('fs-jetpack');
const path = require('path');
const chalk = require('chalk');
const {upperFirst, kebabCase, camelCase} = require('lodash');
const {sprintf} = require('sprintf-js');
const cwd = process.cwd();
const resolvePath = path.resolve;

const store = memFs.create();
const fs = editor.create(store);

const componentSpec = "src/app/%(page)s/components/%(dest)s/%(name)s.component%(ext)s";
const serviceSpec = "src/app/%(page)s/services/%(dest)s/%(name)s.service%(ext)s";
const storeSpec = "src/app/%(page)s/stores/%(dest)s/%(name)s.store%(ext)s";
const controllerSpec = "src/app/%(page)s/controllers/%(dest)s/%(name)s.controller%(ext)s";
const modelSpec = "src/app/%(page)s/models/%(dest)s/%(name)s.model%(ext)s";
const templateSpec = "src/app/%(page)s/templates/%(dest)s/%(name)s.html%(ext)s";
const cmdTemplatePath = resolvePath(__dirname, "..", "templates");

module.exports = function generate(options) {
    debug(options);
    if (options.page !== null && !isValidPage(options.page)) {
        console.log(chalk`{red.bold ERREUR} Impossible de trouver la page: ${options.page}`);
        console.log(chalk`{blueBright.bold INFO} Utiliser la commande 'rxvcli generate page ${options.page}' pour créer la page.`);
    }

    switch (options.type) {
        case "page":
            generator.page(options);
            break;
        case "component":
            generateComponent(options);
            break;
        case "controller":
            generateController(options);
            break;
        case "model":
            generateModel(options);
            break;
        case "service":
            generateService(options);
            break;
        case "store":
            generateStore(options);
            break;
        case "template":
            generateTemplate(options);
            break;
    }
};

function isValidPage(page) {
    let srcPath = resolvePath(cwd, "src");
    let currentPath = resolvePath(srcPath, "pages", page);
    return jetpack.exists(currentPath);
}

function getCorrectPath(spec, options) {
    return path.normalize(sprintf(spec, {
        page: options.page || "",
        dest: options.dest || "",
        ext: options.ext || "",
        name: options.name || "",
    })).replace(/\\/gmi, "/");
}

function getPathToSource(options){
    let aDest = options.dest.split("/");
    let name = kebabCase(aDest.pop());
    let dest = aDest.join("/");

    let srcPath = resolvePath(cwd, "src", "app");
    if (options.page !== null) {
        srcPath = resolvePath(cwd, "src", "pages", options.page);
    }

    return {
        dest: dest,
        name: name,
        srcPath: srcPath,
    }
}

function generateComponent(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let componentClass = camelCase(upperFirst(name)) + "Component";
    let componentName = getCorrectPath(componentSpec, {name: name, ext: ".js", "dest": dest, "page": options.page});
    let templatePath = getCorrectPath(templateSpec, {name: "component", "dest": dest + "/" + name, ext: ".twig", "page": options.page});

    mkdirp.sync(srcPath);
    process.chdir(srcPath);

    let aResult = jetpack.find(srcPath, {matching: ['*-main.js'], recursive: false});
    if (aResult.length !== 1) {
        console.log(chalk`{red.bold ERREUR} Une erreur est survenu pendant la recherche du fichier main.`);
        return false;
    }

    let configFile = aResult[0];

    let mainChanged = addToMainFile(configFile, componentClass, componentName, "Component");
    if (!mainChanged) return;

    let aModifiedFiles = [];

    aModifiedFiles.push(createComponent(componentName, templatePath));
    aModifiedFiles.push(createTemplate(templatePath));
    aModifiedFiles.push(mainChanged);

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function generateController(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let componentClass = camelCase(upperFirst(name)) + "Controller";
    let componentName = getCorrectPath(controllerSpec, {name: name, ext: ".js", "dest": dest, "page": options.page});

    mkdirp.sync(srcPath);
    process.chdir(srcPath);

    let aResult = jetpack.find(srcPath, {matching: ['*-main.js'], recursive: false});
    if (aResult.length !== 1) {
        console.log(chalk`{red.bold ERREUR} Une erreur est survenu pendant la recherche du fichier main.`);
        return false;
    }

    let configFile = aResult[0];

    let mainChanged = addToMainFile(configFile, componentClass, componentName, "coreController");
    if (!mainChanged) return;

    let aModifiedFiles = [];

    aModifiedFiles.push(createController(componentName));
    aModifiedFiles.push(mainChanged);

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function generateModel(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let componentClass = camelCase(upperFirst(name)) + "Model";
    let componentName = getCorrectPath(modelSpec, {name: name, ext: ".js", "dest": dest, "page": options.page});

    mkdirp.sync(srcPath);
    process.chdir(srcPath);

    let aResult = jetpack.find(srcPath, {matching: ['*-main.js'], recursive: false});
    if (aResult.length !== 1) {
        console.log(chalk`{red.bold ERREUR} Une erreur est survenu pendant la recherche du fichier main.`);
        return false;
    }

    let configFile = aResult[0];

    let mainChanged = addToMainFile(configFile, componentClass, componentName, "Model");
    if (!mainChanged) return;

    let aModifiedFiles = [];

    aModifiedFiles.push(createModel(componentName));
    aModifiedFiles.push(mainChanged);

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function generateService(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let componentClass = camelCase(upperFirst(name)) + "Service";
    let componentName = getCorrectPath(serviceSpec, {name: name, ext: ".js", "dest": dest, "page": options.page});

    mkdirp.sync(srcPath);
    process.chdir(srcPath);

    let aResult = jetpack.find(srcPath, {matching: ['*-main.js'], recursive: false});
    if (aResult.length !== 1) {
        console.log(chalk`{red.bold ERREUR} Une erreur est survenu pendant la recherche du fichier main.`);
        return false;
    }

    let configFile = aResult[0];

    let mainChanged = addToMainFile(configFile, componentClass, componentName, "Service");
    if (!mainChanged) return;

    let aModifiedFiles = [];

    aModifiedFiles.push(createService(componentName));
    aModifiedFiles.push(mainChanged);

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function generateStore(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let componentClass = camelCase(upperFirst(name)) + "Store";
    let componentName = getCorrectPath(storeSpec, {name: name, ext: ".js", "dest": dest, "page": options.page});

    mkdirp.sync(srcPath);
    process.chdir(srcPath);

    let aResult = jetpack.find(srcPath, {matching: ['*-main.js'], recursive: false});
    if (aResult.length !== 1) {
        console.log(chalk`{red.bold ERREUR} Une erreur est survenu pendant la recherche du fichier main.`);
        return false;
    }

    let configFile = aResult[0];

    let mainChanged = addToMainFile(configFile, componentClass, componentName, "AppStore");
    if (!mainChanged) return;

    let aModifiedFiles = [];

    aModifiedFiles.push(createStore(componentName));
    aModifiedFiles.push(mainChanged);

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function generateTemplate(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let templatePath = getCorrectPath(templateSpec, {name: name, ext: ".twig", "dest": dest, "page": options.page});

    mkdirp.sync(srcPath);
    process.chdir(srcPath);

    let aModifiedFiles = [];

    aModifiedFiles.push(createTemplate(templatePath));

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function createComponent(componentName, templatePath) {
    let destinationPath = resolvePath(cwd, componentName);
    templatePath = templatePath.split("/templates/")[1];
    templatePath = path.join(path.dirname(templatePath), path.basename(templatePath, ".twig")).replace(/\\/gmi, "/");

    debug(`Destination du component : ${destinationPath}`);
    debug(`Template ajouter dans le component : ${templatePath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "component", "boilerplate.js"),
        destinationPath,
        {"template": templatePath}
    );

    return chalk`{green.bold ADDED NEW FILE} ${componentName}`;
}

function createTemplate(templateName) {
    let destinationPath = resolvePath(cwd, templateName);
    debug(`Destination du template : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "template", "boilerplate.twig"),
        destinationPath
    );

    return chalk`{green.bold ADDED NEW FILE} ${templateName}`;
}

function createController(templateName) {
    let destinationPath = resolvePath(cwd, templateName);
    debug(`Destination du controller : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "controller", "boilerplate.js"),
        destinationPath
    );

    return chalk`{green.bold ADDED NEW FILE} ${templateName}`;
}

function createModel(templateName) {
    let destinationPath = resolvePath(cwd, templateName);
    debug(`Destination du model : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "model", "boilerplate.js"),
        destinationPath
    );

    return chalk`{green.bold ADDED NEW FILE} ${templateName}`;
}

function createService(templateName) {
    let destinationPath = resolvePath(cwd, templateName);
    debug(`Destination du service : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "service", "boilerplate.js"),
        destinationPath
    );

    return chalk`{green.bold ADDED NEW FILE} ${templateName}`;
}

function createStore(templateName) {
    let destinationPath = resolvePath(cwd, templateName);
    debug(`Destination du store : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "store", "boilerplate.js"),
        destinationPath
    );

    return chalk`{green.bold ADDED NEW FILE} ${templateName}`;
}