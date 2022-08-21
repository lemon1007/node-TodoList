const db = require('./db.js')
const inquirer = require("inquirer");


module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 往里面添加 title 任务
    list.push({title: title, done: false})
    // 向文件里写入新的任务
    await db.write(list)
}

// 展示所有任务
module.exports.showAll = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 打印之前的任务
    printTask(list)
}

// 清除任务列表
module.exports.clear = async () => {
    await db.write([])
}


// 询问用户对选中任务的操作
function askForAction(list, index) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: '请选择您的的操作：',
                choices: [
                    {name: '退出', value: 'quit'},
                    {name: '已完成', value: 'finished'},
                    {name: '未完成', value: 'unfinished'},
                    {name: '修改', value: 'update'},
                    {name: '删除', value: 'remove'},
                ]
            }
        ]).then((answer2) => {
        // 根据要求对任务进行相应操作
        switch (answer2.action) {
            case 'quit':
                break;
            case 'finished':
                list[index].done = true;
                db.write(list);
                break;
            case 'unfinished':
                list[index].done = false;
                db.write(list);
                break;
            case 'update':
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: "请输入新的任务名：",
                    default: list[index].title
                }).then(answer => {
                    list[index].title = answer.title
                    db.write(list)
                    console.log('修改成功')
                })
                break;
            case 'remove':
                list.splice(index, 1)
                db.write(list)
                break;
        }
    })
}


// 询问用户创建新的任务
function askForCreateTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "请输入想要创建的任务：",
    }).then(answer => {
        list.push({title: answer.title, done: false})
        db.write(list)
        console.log('创建成功')
    })
}

// 打印任务列表
function printTask(list) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择你想要操作的任务：',
                choices: [...list.map((item, index) => {
                    return {
                        name: `${item.done ? '[√]' : '[x]'} ${index + 1}---${item.title}`,
                        value: (index).toString()
                    }
                }), {name: '+ 添加任务', value: '-2'}, {name: '退出', value: '-1'}]
            },
        ]).then((answers) => {
        const index = parseInt(answers.index)
        // 选中了一个任务
        if (index >= 0) {
            askForAction(list, index);
        } else if (index === -2) {
            // 创建一个任务
            askForCreateTask(list);
        }
    });
}




