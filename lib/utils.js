'use strict';

/**
 * 打印提示信息
 */
function info(input) {
    console.log(`\x1B[0;33m${input}\x1B[0m`);
};

/**
 * 打印错误信息
 */
function error(input) {
    console.log(`\x1B[0;31mERROR: ${input}\x1B[0m`);
};

/**
 * 打印正在扫描的文件
 */
let counter = 0;
function infoPending(input) {
    // const prefix = '\x1B[0;0H\x1B[K\x1B[0;33m';
    const prefix = '\x1B[0;33m';

    if (!input) {
        console.log(`${prefix}扫描完成.\x1B[0m`);
        return;
    }

    // todo: 如何优雅实现一个内部计数器
    counter %= 3;
    switch (counter) {
        case 0:
            console.log(`${prefix}${input}.\x1B[0m`);
            break;
        case 1:
            console.log(`${prefix}${input}..\x1B[0m`);
            break;
        case 2:
            console.log(`${prefix}${input}...\x1B[0m`);
            break;
    }
    counter++;
};


module.exports = {
    info: info,
    error: error,
    infoPending: infoPending,
};
