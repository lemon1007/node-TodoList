#!/usr/bin/env node
const program = require('commander');
const api = require("./index")

program
    .option('-x, --xxx', 'what is x');


program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0, args.length - 1).join(' ')
        api.add(words).then(() => {
            console.log("添加成功")
        }, () => {
            console.log("添加失败")
        });

    })
program
    .command('clear')
    .description('clear all tasks')
    .action((...args) => {
        api.clear().then(() => {
            console.log("清除成功")
        }, () => {
            console.log("清除失败")
        });
    })


program.parse(process.argv);

if (process.argv.length === 2) {
    api.showAll().then(() => {
        console.log("展示成功")
    }, () => {
        console.log("展示失败")
    });
}

