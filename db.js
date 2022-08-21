const homedir = require('os').homedir(); // 获取系统的 home 目录
const home = process.env.HOME || homedir  // 先获取配置的 home variable 环境变量，如果没有配置，则获取系统的 home 目录
const fs = require('fs')
const dbPath = require('path').join(home, '.todo')


const db = {

    // 读取之前的任务
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => {
                if (error) return reject(error)
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (error2) {
                    list = []
                }
                resolve(list)
            })
        })
    },

    // 向文件里写入新的任务
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string + '\n', (error) => {
                if (error) return reject(error)
                resolve()
            })
        })
    }



}


module.exports = db