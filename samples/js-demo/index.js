/**
 * JavaScript/Node.js 彩票API调用示例
 * 
 * 官方文档: https://www.byw.bet
 * 
 * 核心功能: JavaScript实时开奖数据获取 | 历史开奖查询 | Node.js SDK
 */

const BywClient = require('../src/javascript/index.js');

// =============================================
// 示例1: 获取最新开奖数据
// =============================================
async function example1() {
    console.log("=== 获取最新开奖数据 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const result = await client.latest('4');
        
        if (result) {
            console.log(`期号: ${result.Expect}`);
            console.log(`开奖号码: ${result.Opencode}`);
            console.log(`开奖时间: ${result.Opentime}`);
        }
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例2: 获取多期开奖数据
// =============================================
async function example2() {
    console.log("\n=== 获取最近5期开奖数据 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const results = await client.latestMulti('4', 5);
        
        results.forEach(item => {
            console.log(`${item.Expect} - ${item.Opencode}`);
        });
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例3: 获取指定日期历史数据
// =============================================
async function example3() {
    console.log("\n=== 查询指定日期开奖数据 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const results = await client.byDate('4', '2026-04-18');
        
        results.forEach(item => {
            console.log(`${item.Expect} - ${item.Opencode}`);
        });
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例4: 获取历史开奖记录
// =============================================
async function example4() {
    console.log("\n=== 获取历史开奖数据 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const results = await client.history('4', 10);
        
        results.forEach(item => {
            console.log(`${item.Expect} - ${item.Opencode}`);
        });
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例5: 获取下一期开奖时间
// =============================================
async function example5() {
    console.log("\n=== 获取下一期开奖时间 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const nextTime = await client.nextDrawTime('4');
        
        if (nextTime) {
            console.log(`下一期开奖时间: ${nextTime}`);
        }
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例6: 广东11选5开奖查询
// =============================================
async function example6() {
    console.log("\n=== 广东11选5开奖查询 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // lotteryid: 59
        const result = await client.latest('59');
        
        if (result) {
            console.log(`期号: ${result.Expect}`);
            console.log(`开奖号码: ${result.Opencode}`);
        }
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例7: 批量查询多个彩种
// =============================================
async function example7() {
    console.log("\n=== 批量查询多个彩种 ===");
    
    const client = new BywClient('YOUR_API_TOKEN');
    // 批量查询多个彩种 (使用 lotteryid)
    const lotteryTypes = ['4', '59', '85', '21']; // 重庆时时彩、广东11选5、安徽快三、福彩3D
    
    try {
        for (const type of lotteryTypes) {
            const result = await client.latest(type);
            if (result) {
                const name = BywClient.SUPPORTED_LOTTERIES[type] || type;
                console.log(`${name}: ${result.Opencode}`);
            }
        }
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例8: 获取支持的彩种列表
// =============================================
function example8() {
    console.log("\n=== 支持的彩种列表 ===");
    
    const lotteries = BywClient.SUPPORTED_LOTTERIES;
    
    for (const [code, name] of Object.entries(lotteries)) {
        console.log(`${code}: ${name}`);
    }
}

// =============================================
// 示例9: 自定义配置
// =============================================
async function example9() {
    console.log("\n=== 自定义配置示例 ===");
    
    const client = new BywClient('YOUR_API_TOKEN', {
        timeout: 60000,  // 60秒超时
        format: 'json2'   // 使用JSON2格式
    });
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const result = await client.latest('4');
        console.log(result);
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// =============================================
// 示例10: 封装为Promise（实际项目参考）
// =============================================
async function example10() {
    console.log("\n=== Promise封装示例 ===");
    
    /**
     * 获取彩票开奖数据（Promise封装）
     * @param {string} lotteryType 彩种代码(lotteryid)
     * @param {number} limit 数量
     * @returns {Promise}
     */
    function getLotteryData(lotteryType, limit = 5) {
        const client = new BywClient('YOUR_API_TOKEN');
        
        return new Promise((resolve, reject) => {
            client.latestMulti(lotteryType, limit)
                .then(data => {
                    resolve({
                        code: 0,
                        message: 'success',
                        data: data
                    });
                })
                .catch(reject);
        });
    }
    
    try {
        // lotteryid: 4 (重庆时时彩)
        const result = await getLotteryData('4', 5);
        console.log(result);
    } catch (e) {
        console.error("错误:", e.message);
    }
}

// 运行所有示例
async function runAll() {
    await example1();
    await example2();
    await example3();
    await example4();
    await example5();
    await example6();
    await example7();
    example8();
    await example9();
    await example10();
    
    console.log("\n=== 完成! ===");
}

runAll();
