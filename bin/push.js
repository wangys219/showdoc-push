#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONFIG_NAME = '.showdocrc.json';
let config;

/**
 * main
 */
function main() {
    let argv = process.argv[2] || '';
    switch(argv) {
        case 'init':
            genConfig();
            break;
        case '':
            run();
            break;
        case '-h':
        case 'help':
        default:
            tip();
            break;
    }
}

main();

/**
 * config文件生成
 * 利用用户输入生成配置文件
 * 交互式生成配置
 * 目前只是复制一个config
 */
function genConfig() {
    fs.copyFileSync(path.join(__dirname, '..' ,'config/config.template.json'), path.resolve(CONFIG_NAME));
}

/**
 * 根据配置上传文件
 * 
 */
function run() {
    // 获取配置
    let config;
    try {
        config = require(path.resolve(CONFIG_NAME));
    } catch (e) {
        console.log(`缺少配置文件${path.resolve(CONFIG_NAME)}`); // todo: 需要一个输出提示的工具方法
        process.exit();
    }
    
    // 配置检查
    if (!config.url) console.log('缺少配置项url');
    if (!config.api_key) config.log('缺少配置项api_url');
    if (!config.api_token) config.log('缺少配置项api_token');

    // todo: 添加指定扫描路径和忽略路径的功能
    // 根据配置扫描目录上传api
    scan(process.cwd());

    // 根据配置扫描数据库上传数据字典
}

/**
 * 打印提示
 */
function tip() {
    console.log();
    console.log('Usage:');
    console.log();
    console.log('    showdoc-push init   : 生成配置文件');
    console.log('    showdoc-push        : 按照配置文件同步showdoc文档'); 
    console.log();
    console.log(); 
}

/**
 * 扫描目录
 */
function scan(dir) {
    let fileList = getFileList(dir);

    for (let i = 0; i < fileList.length; i++) {
        // 扫描文件内容
        let contentList = scanFile(fileList[i]);
        if (contentList) {
            for (let j = 0; j < contentList.length; j++) {
                console.log(contentList[j]);
            }
        }
    }
}

/**
 * 扫描目录，将目录下的所有文件返回
 */
function getFileList(dir) {
    let dirList = [dir];
    let fileList = [];
    
    while(dirList.length) {
        let dir = dirList.shift();
        let list = fs.readdirSync(dir);
        for (let i = 0; i < list.length; i++) {
            let file = path.join(dir, list[i])
            let stat = fs.statSync(file);
            if (stat.isDirectory()) dirList.push(file);
            if (stat.isFile()) fileList.push(file);
        }
    }

    return fileList;
}

/**
 * 扫描文件内容
 */
function scanFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let list = content.match(/\/\*\*[\s\S]*?\*\//g);
    if (!list) return list;
    let result = [];
    for (let i = 0; i < list.length; i++) {
        if (/showdoc/.test(list[i])) result.push(list[i]);
    }

    return result;
}
