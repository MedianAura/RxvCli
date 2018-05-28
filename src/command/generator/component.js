function generateComponent(options) {
    let {dest, name, srcPath} = getPathToSource(options);

    let componentClass = upperFirst(name) + "Component";
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

    let mainChanged = addToMainFile(configFile, componentClass, componentName);
    if (!mainChanged) return;

    let aModifiedFiles = [];

    aModifiedFiles.push(createComponent(componentName, templatePath));
    aModifiedFiles.push(createTemplate(templatePath));
    aModifiedFiles.push(mainChanged);

    // fs.commit(function () {
    //     for (let i = 0; i < aModifiedFiles.length; i++) {
    //         console.log(aModifiedFiles[i]);
    //     }
    // });
}