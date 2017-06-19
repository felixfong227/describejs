#!/usr/bin/env node
const cli = require('commander');
const path = require('path');
const fs = require('fs-promise');
const readDir = require('fs-readdir-recursive');

const cwd = process.cwd();

const color = require('cli-color');

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
            console.log(color.blue(`\n${fileName}:`));
            // Get the context
            const context = content.match(describeSyntax);
            context.forEach((describeSyntaxContext) => {
                // Remove 2(tab) or 4(tab) space characters
                describeSyntaxContext = describeSyntaxContext.replace(/ {2}| {4}/igm, '');
                console.log(`\n${describeSyntaxContext}\n`);

                // Check for expecting return type => @return <type> # type is expect 1 to 8 characters
                const expectType = new RegExp(/@return.[a-z]{1,8}/i);
                if (describeSyntaxContext.match(expectType)) {
                    const returnType = describeSyntaxContext.match(expectType)[0].replace('@return ', '');
                    console.log(color.yellow(`Expect to return ${returnType}`));
                }
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

