#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const utils = require('../lib/utils.js');

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
    try {
        config = require(path.resolve(CONFIG_NAME));
    } catch (e) {
        utils.error(`缺少配置文件${path.resolve(CONFIG_NAME)}`);
        process.exit(1);
    }
    
    // 配置检查
    if (!config.url) {
        utils.error('缺少配置项url');
        process.exit(1);
    }

    if (!config.api_key) {
        utils.error('缺少配置项api_url');
        process.exit(1);
    }

    if (!config.api_token) {
        utils.error('缺少配置项api_token');
        process.exit(1);
    }

    // todo: 添加指定扫描路径和忽略路径的功能
    // 根据配置扫描目录上传api
    scan(process.cwd());
}

/**
 * 打印提示
 */
function tip() {
    let usage = fs.readFileSync(path.resolve(__dirname, '../lib/usage.txt'), 'utf8');
    utils.info(usage);
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
            // utils.infoPending(`正在上传文件${fileList[i]}`);
            for (let j = 0; j < contentList.length; j++) {
                // 上传
                pushAPI(contentList[j]);
            }
        }
    }
    // 显示扫描完成
    utils.infoPending();
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
    // utils.infoPending(`正在扫描文件${file}`);
    let content = fs.readFileSync(file, 'utf8');
    let list = content.match(/\/\*\*[\s\S]*?\*\//g);
    if (!list) return list;
    let result = [];
    for (let i = 0; i < list.length; i++) {
        if (/showdoc/.test(list[i])) result.push(list[i]);
    }

    return result;
}

/**
 * 上传API
 */
function pushAPI(content) {
    let url = new URL(config.url);
    let req = http.request({
        method: 'POST',
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}?s=/api/open/fromComments`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }, 
    });
    req.write(Buffer.from(`from=shell&api_key=${config.api_key}&api_token=${config.api_token}&content=${content}`));
    req.end();
}
