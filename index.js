#!/usr/bin/env node
'use strict';

const Parser = require("./src/parser");
const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse examples: sub-commands',
});

const subparsers = parser.addSubparsers({
    title: 'subcommands',
    dest: "subcommand"
});

let bar = subparsers.addParser('new', {addHelp: true,});
bar.addArgument('name', {action: 'store', type: 'string', help: 'Nom du project'});
bar.addArgument('type', {
    action: 'store',
    type: 'string',
    defaultValue: "Base",
    nargs: '?',
    help: 'Type du projet',
    choices: ["Base", "Document", "Index"]
});
bar.addArgument('dest', {action: 'store', type: 'string', help: 'Destination', nargs: '?'});

// bar = subparsers.addParser('init', {addHelp: true});
// bar.addArgument(
//     ['-b', '--bar'],
//     {
//         action: 'store',
//         type: 'int',
//         help: 'foo3 bar3'
//     }
// );
//
bar = subparsers.addParser('generate', {addHelp: true});
bar.addArgument('type', {
    action: 'store',
    type: 'string',
    help: 'Generer un article',
    choices: ["component", "controller", "model", "page", "service", "store", "template"]
});
bar.addArgument('dest', {action: 'store', type: 'string', help: 'Destination'});
bar.addArgument(['-p', '--page'], {action: 'store', type: 'string', help: 'Ajoute l\'element dans la page.'});

const args = parser.parseArgs();

new Parser(args);