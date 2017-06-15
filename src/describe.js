#!/usr/bin/env node
const cli = require('commander');
const path = require('path');
const fs = require('fs-promise');

const cwd = process.cwd();

cli
  .version('1.0.0')
  .parse(process.argv);


// Get the file or directory name
const lookUpPath = path.join(`${cwd}/${cli.args[0]}`);

function coreCheck(content, fileName) {
    if (fileName.endsWith('.js')) {
        // Is a JS file
        const describeSyntax = new RegExp(/\/\*\ndescribe:/);
        if (content.match(describeSyntax)) {
            // Get the describe context
            console.log(`\n${fileName}:`);
            // Get the context
            const context = content.match(/\/\*([\s\S]*?)\*\//igm);
            console.log(`${context}`);
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
            fs.readdir(lookUpPath)
                .then((files) => {
                    files.forEach((fileName) => {
                        fs.readFile(path.join(`${lookUpPath}/${fileName}`), 'utf-8')
                            .then((content) => {
                                coreCheck(content, fileName);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                })
                .catch((error) => {
                    console.log(error);
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

