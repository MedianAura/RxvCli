const debug = require('debug')('rxvcli:generate:page');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const mkdirp = require('mkdirp');
const path = require('path');
const chalk = require('chalk');
const {fill} = require('lodash');

const cwd = process.cwd();
const resolvePath = path.resolve;
const store = memFs.create();
const fs = editor.create(store);

const cmdTemplatePath = resolvePath(__dirname, "../..", "templates");

function generatePage(options) {
    let aDest = options.dest.split("/");
    let name = aDest.pop();
    let dest = aDest.join("/");

    let srcPath = resolvePath(cwd, "src");
    let currentPath = resolvePath(srcPath, "pages", dest, name);
    mkdirp.sync(currentPath);

    let aModifiedFiles = [];

    aModifiedFiles.push(createIndex(cwd, dest, name));
    aModifiedFiles.push(createModuleConfig(currentPath, dest, name));
    aModifiedFiles.push(createCoreController(currentPath, dest, name));
    aModifiedFiles.push(createAppStore(currentPath, dest, name));

    fs.commit(function () {
        for (let i = 0; i < aModifiedFiles.length; i++) {
            console.log(aModifiedFiles[i]);
        }
    });
}

function createCoreController(currentPath, dest, name) {
    let destinationPath = resolvePath(currentPath, "coreController.js");
    let destinationRelPath = path.join("src", "pages", dest, name).replace(/\\/gmi, "/");
    debug(`Destination du component : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "boilerplate-controller.js"),
        destinationPath,
        {"namespace": name, "namespacePath": "text!" + destinationRelPath + "/templates"}
    );

    return chalk`{green.bold ADDED NEW FILE} ${destinationRelPath + "/coreController.js"}`
}

function createModuleConfig(currentPath, dest, name) {
    let destinationPath = resolvePath(currentPath, name + "-main.js");
    let destinationRelPath = path.join("src", "pages", dest, name).replace(/\\/gmi, "/");
    debug(`Destination du component : ${destinationPath}`);

    const relPath = fill(Array(destinationRelPath.split("/").length + 1), "..").join("/") + "/";

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "boilerplate-main.js"),
        destinationPath,
        {
            "storePath": destinationRelPath + "/stores/app.store.js",
            "corePath": destinationRelPath + "/coreController.js",
            "rootDir": relPath
        }
    );

    return chalk`{green.bold ADDED NEW FILE} ${destinationRelPath + "/" + name + "-main.js"}`
}

function createAppStore(currentPath, dest, name) {
    let destinationPath = resolvePath(currentPath, "stores", "app.store.js");
    let destinationRelPath = path.join("src", "pages", dest, name, "stores").replace(/\\/gmi, "/");
    debug(`Destination du component : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "store/main.js"),
        destinationPath
    );

    return chalk`{green.bold ADDED NEW FILE} ${destinationRelPath + "/app.store.js"}`
}

function createIndex(currentPath, dest, name) {
    let destinationRelPath = path.join().replace(/\\/gmi, "/");
    let destinationPath = resolvePath(currentPath, name + "-ndx.html");
    let moduleConfigRelPath = path.join("src", "pages", dest, name, name + "-main.js").replace(/\\/gmi, "/");

    debug(`Destination du component : ${destinationPath}`);

    mkdirp.sync(path.dirname(destinationPath));
    fs.copyTpl(
        resolvePath(cmdTemplatePath, "index.html"),
        destinationPath,
        {"mainConfigPath": moduleConfigRelPath}
    );

    return chalk`{green.bold ADDED NEW FILE} ${destinationRelPath + "/" + name + "-ndx.html"}`
}

module.exports = generatePage;