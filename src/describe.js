#!/usr/bin/env node
const cli = require('commander');
const path = require('path');
const fs = require('fs-promise');
const readDir = require('fs-readdir-recursive');

const cwd = process.cwd();

// Read the package.json file
const packageJSON = JSON.parse(fs.readFileSync(path.join(`${__dirname}/../package.json`), 'utf-8'));
cli
  .version(packageJSON.version)
  .parse(process.argv);


// Get the file or directory name
const lookUpPath = path.join(`${cwd}/${cli.args[0]}`);

function coreCheck(content, fileName) {
    if (fileName.endsWith('.js')) {
        // Is a JS file
        const describeSyntax = new RegExp(/\/\*([\s\S]*?)\*\//igm);
        if (content.match(describeSyntax)) {
            // Get the describe context
            console.log(`\n${fileName}:`);
            // Get the context
            const context = content.match(describeSyntax);
            context.forEach((describeSyntaxContext) => {
                console.log(`\n${describeSyntaxContext}\n`);
            });
        } else {
            throw new Error(`${path.join(`${lookUpPath}/${fileName}/ `)}do not contain describe syntax`);
        }
    }
}


// Check if the user input is a single file or a director
fs.lstat(lookUpPath)
    .then((stats) => {
        if (stats.isDirectory()) {
            // Is a directory

            // check each files

            const files = readDir(lookUpPath);
            files.forEach((fileName) => {
                fs.readFile(path.join(`${lookUpPath}/${fileName}`), 'utf-8')
                .then((content) => {
                    coreCheck(content, fileName);
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        } else {
            return fs.readFile(lookUpPath, 'utf-8')
                    .then(content => coreCheck(content, cli.args[0]));
        }
        return true;
    })
    .catch((error) => {
        console.log(error);
    });

