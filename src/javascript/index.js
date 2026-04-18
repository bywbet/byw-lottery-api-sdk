/**
 * BywLottery SDK - 博易网彩票开奖数据SDK
 * 
 * 官方文档: https://www.byw.bet
 * GitHub: https://github.com/your-repo/byw-lottery-api-sdk
 * 
 * 核心关键词: 彩票API接口 | 实时开奖数据API | JavaScript彩票SDK | 开奖数据接口平台
 */

const https = require('https');
const http = require('http');
const querystring = require('querystring');

/**
 * 博易网彩票开奖数据API客户端
 * 
 * 彩票API接口 - JavaScript/Node.js开发首选SDK
 * 支持: 实时开奖数据 | 历史开奖查询 | 多彩种支持 | JSON/XML格式
 */
class BywClient {
    /**
     * API基础地址
     */
    static BASE_URL = 'api.byw.bet:868';
    static DEFAULT_PATH = '/api';

    /**
     * 构造函数
     * @param {string} token API接口密钥
     * @param {Object} options 配置选项
     */
    constructor(token, options = {}) {
        if (!token) {
            throw new Error('API Token不能为空');
        }

        this.token = token;
        this.baseUrl = options.baseUrl || BywClient.BASE_URL;
        this.timeout = options.timeout || 30000;
        this.format = options.format || 'json';
    }

    /**
     * 获取最新一期开奖数据
     * @param {string} lotteryType 彩种代码（使用数据库 lotteryid）
     * @param {boolean} includeNextTime 是否包含下一期开奖时间
     * @returns {Promise<Object>}
     * 
     * @example
     * ```javascript
     * const client = new BywClient('YOUR_TOKEN');
     * const result = await client.latest('4'); // 重庆时时彩
     * console.log(result.Expect, result.Opencode);
     * ```
     */
    async latest(lotteryType, includeNextTime = false) {
        const data = await this._request({
            t: lotteryType,
            limit: 1,
            nexttime: includeNextTime ? 1 : 0
        });

        return data.Data && data.Data.length > 0 ? data.Data[0] : null;
    }

    /**
     * 获取最新多期开奖数据
     * @param {string} lotteryType 彩种代码（使用数据库 lotteryid）
     * @param {number} limit 返回条数（1-20）
     * @param {boolean} includeNextTime 是否包含下一期开奖时间
     * @returns {Promise<Array>}
     */
    async latestMulti(lotteryType, limit = 5, includeNextTime = false) {
        limit = Math.max(1, Math.min(20, limit));

        const data = await this._request({
            t: lotteryType,
            limit: limit,
            nexttime: includeNextTime ? 1 : 0
        });

        return data.Data || [];
    }

    /**
     * 获取历史开奖数据
     * @param {string} lotteryType 彩种代码（使用数据库 lotteryid）
     * @param {number} limit 返回条数
     * @returns {Promise<Array>}
     */
    async history(lotteryType, limit = 10) {
        limit = Math.max(1, Math.min(20, limit));

        const data = await this._request({
            t: lotteryType,
            limit: limit
        });

        return data.Data || [];
    }

    /**
     * 获取指定日期的历史开奖数据
     * @param {string} lotteryType 彩种代码（使用数据库 lotteryid）
     * @param {Date|string} date 日期
     * @returns {Promise<Array>}
     * 
     * @example
     * ```javascript
     * const results = await client.byDate('4', '2026-04-18'); // 重庆时时彩
     * ```
     */
    async byDate(lotteryType, date) {
        let dateStr;
        if (date instanceof Date) {
            dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        } else {
            dateStr = date.replace(/-/g, '');
        }

        const data = await this._request({
            t: lotteryType,
            date: dateStr
        });

        return data.Data || [];
    }

    /**
     * 获取下一期开奖时间
     * @param {string} lotteryType 彩种代码（使用数据库 lotteryid）
     * @returns {Promise<string|null>}
     */
    async nextDrawTime(lotteryType) {
        const data = await this._request({
            t: lotteryType,
            limit: 1,
            nexttime: 1
        });

        return data.Nexttime || null;
    }

    /**
     * 执行API请求
     * @private
     */
    _request(params) {
        return new Promise((resolve, reject) => {
            const queryParams = {
                token: this.token,
                p: this.format,
                ...params
            };

            const queryString = querystring.stringify(queryParams);
            const path = `${BywClient.DEFAULT_PATH}?${queryString}`;

            const options = {
                hostname: this.baseUrl,
                path: path,
                method: 'GET',
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'BywLottery-SDK/1.0',
                    'Accept': 'application/json'
                }
            };

            const protocol = this.baseUrl.includes('https') ? https : http;
            
            const req = protocol.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (this.format === 'json' || this.format === 'json2') {
                            const parsed = JSON.parse(data);
                            resolve(parsed);
                        } else {
                            resolve({ raw: data });
                        }
                    } catch (e) {
                        reject(new Error('JSON解析失败: ' + e.message));
                    }
                });
            });

            req.on('error', (e) => {
                reject(new Error('API请求失败: ' + e.message));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('请求超时'));
            });

            req.end();
        });
    }

    /**
     * 支持的彩种列表（共109个 cstatus=1 的彩种，使用数据库 lotteryid）
     */
    static get SUPPORTED_LOTTERIES() {
        return {
            // ==================== 时时彩系列 ====================
            '1': '黑龙江时时彩',
            '2': '内蒙古时时彩',
            '3': '天津时时彩',
            '4': '重庆时时彩(欢乐生肖)',
            '5': '新疆时时彩',
            '6': '云南时时彩',
            '7': '上海时时乐',

            // ==================== PK10/赛车系列 ====================
            '8': '北京赛车(PK10)',
            '9': '北京快中彩',
            '112': '幸运飞艇',

            // ==================== 快乐12系列 ====================
            '11': '辽宁快乐12',
            '12': '浙江快乐12',
            '13': '四川快乐12',
            '14': '河南泳坛夺金(481)',
            '15': '山西泳坛夺金(481)',
            '16': '新疆喜乐彩',
            '17': '四川金七乐',
            '19': '湖南幸运赛车',
            '20': '山东群英会',

            // ==================== 11选5系列 ====================
            '52': '江苏11选5',
            '53': '湖北11选5',
            '54': '浙江11选5',
            '55': '江西11选5',
            '56': '新疆11选5',
            '57': '安徽11选5',
            '58': '广西11选5',
            '59': '广东11选5',
            '60': '山东11选5',

            // ==================== 快三系列 ====================
            '78': '江苏快三',
            '79': '广西快三',
            '80': '北京快三',
            '81': '福建快三',
            '82': '河北快三',
            '83': '上海快三',
            '84': '湖北快三',
            '85': '安徽快三',
            '86': '吉林快三',

            // ==================== 快乐十分系列 ====================
            '93': '广东快乐十分',
            '94': '广西快乐十分',
            '95': '天津快乐十分',
            '96': '湖南快乐十分',
            '97': '重庆幸运农场',
            '98': '陕西快乐十分',
            '99': '山西快乐十分',
            '100': '云南快乐十分',
            '101': '黑龙江快乐十分',

            // ==================== 168极速系列 ====================
            '102': '168极速赛车(PK10)',
            '103': '168极速时时彩',
            '104': '168极速飞艇',
            '105': '168极速快乐十分',
            '106': '168极速⑥合彩',
            '107': '168极速11选5',
            '108': '168极速快三',
            '109': '168极速快乐8',
            '110': '168极速28(PC蛋蛋)',

            // ==================== 澳洲彩票 ====================
            '113': '澳洲幸运5(时时彩)',
            '114': '澳洲幸运8(快乐十分)',
            '115': '澳洲幸运10(PK10)',
            '116': '澳洲幸运20(快乐8)',

            // ==================== 台湾彩票 ====================
            '117': '台湾賓果(BINGO)',
            '135': '台湾五分彩',

            // ==================== 越南/印尼彩票 ====================
            '118': '越南河内5分彩',
            '119': '越南河内1分彩',
            '120': '印尼5分彩',
            '121': '印尼1分彩',

            // ==================== 加拿大彩票 ====================
            '122': '加拿大卑诗快乐8',
            '123': '加拿大西部快乐8',
            '140': '加拿大卑诗3.5分彩',

            // ==================== 快乐8/Keno系列 ====================
            '10': '北京快乐8',
            '127': '斯洛伐克快乐8',
            '162': '俄勒冈快乐8',
            '164': '肯塔基快乐8',

            // ==================== 28/PC蛋蛋系列 ====================
            '129': 'PC蛋蛋(北京28)',
            '130': '加拿大28',
            '131': '斯洛伐克28',
            '134': '澳洲28',
            '136': '台湾⑥合彩28',
            '137': '俄勒冈28',
            '138': '肯塔基28',

            // ==================== 腾讯/QQ彩票 ====================
            '132': '腾讯分分彩(奇趣)',
            '133': 'QQ分分彩(奇趣)',

            // ==================== 波场彩票 ====================
            '163': '波场哈希分分彩',

            // ==================== 传统彩票 - 福彩 ====================
            '21': '（福彩）福彩3D',
            '22': '（体彩）双色球',
            '23': '（体彩）七乐彩',
            '31': '福彩15选5',
            '32': '福彩东方6+1',
            '39': '黑龙江福彩22选5',
            '40': '黑龙江福彩36选7',
            '41': '黑龙江福彩P62',
            '43': '上海天天彩选4',
            '38': '广西福彩快乐双彩',
            '47': '河北燕赵20选5',
            '48': '河北燕赵好运2',
            '49': '河北燕赵好运3',
            '50': '河北燕赵排列5',
            '51': '河北燕赵排列7',

            // ==================== 传统彩票 - 体彩 ====================
            '24': '（体彩）大乐透',
            '25': '（体彩）排列三',
            '26': '（体彩）排列五',
            '27': '（体彩）七星彩',
            '28': '足彩胜负(任九)',
            '29': '四场进球彩',
            '30': '六场半全场',
            '35': '福建体彩22选5',
            '36': '福建体彩31选7',
            '37': '福建体彩36选7',
            '42': '江苏体彩7位数',
            '159': '海南4+1',

            // ==================== 香港/国际彩票 ====================
            '111': '香港⑥合彩',
            '160': '美国强力球',
            '161': '美国超级百万'
        };
    }

    /**
     * 验证彩种代码是否支持
     * @param {string} type 彩种代码
     * @returns {boolean}
     */
    static isSupported(type) {
        return type in BywClient.SUPPORTED_LOTTERIES;
    }
}

module.exports = BywClient;
