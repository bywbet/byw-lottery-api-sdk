/**
 * BywLottery SDK - 博易网彩票开奖数据SDK
 * 
 * 官方文档: https://www.byw.bet
 * GitHub: https://github.com/your-repo/byw-lottery-api-sdk
 * 
 * 核心关键词: 彩票API接口 | 实时开奖数据API | 彩票数据SDK | 开奖数据接口平台
 */

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using BywLottery.SDK.Models;
using BywLottery.SDK.Requests;
using BywLottery.SDK.Responses;

namespace BywLottery.SDK
{
    /// <summary>
    /// 博易网彩票开奖数据API客户端
    /// 
    /// 彩票API接口 - 官方授权SDK
    /// 支持: 实时开奖数据 | 历史开奖查询 | 多彩种支持 | JSON/XML格式
    /// </summary>
    public class BywClient : IDisposable
    {
        private readonly string _apiToken;
        private readonly string _baseUrl;
        private readonly HttpClient _httpClient;
        private bool _disposed;

        /// <summary>
        /// API基础地址
        /// </summary>
        public const string DefaultBaseUrl = "http://api.byw.bet:868/api";

        /// <summary>
        /// 初始化SDK客户端
        /// </summary>
        /// <param name="token">API接口密钥</param>
        /// <param name="baseUrl">API基础地址（可选）</param>
        public BywClient(string token, string baseUrl = DefaultBaseUrl)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentNullException(nameof(token), "API Token不能为空");

            _apiToken = token;
            _baseUrl = baseUrl.TrimEnd('/');
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30)
            };
        }

        /// <summary>
        /// 获取最新一期开奖数据
        /// </summary>
        /// <param name="lotteryType">彩种代码（如：cqssc重庆时时彩, ssc重庆时时彩）</param>
        /// <param name="includeNextTime">是否包含下一期开奖时间</param>
        /// <returns>最新开奖结果</returns>
        public async Task<LotteryResult> GetLatestAsync(string lotteryType, bool includeNextTime = false)
        {
            var request = new LotteryRequest
            {
                Token = _apiToken,
                LotteryType = lotteryType,
                Limit = 1,
                IncludeNextTime = includeNextTime
            };

            var response = await ExecuteAsync(request);
            return response?.Data?.Count > 0 ? response.Data[0] : null;
        }

        /// <summary>
        /// 获取最新多期开奖数据
        /// </summary>
        /// <param name="lotteryType">彩种代码</param>
        /// <param name="limit">返回条数（1-20）</param>
        /// <param name="includeNextTime">是否包含下一期开奖时间</param>
        /// <returns>开奖结果列表</returns>
        public async Task<List<LotteryResult>> GetLatestMultiAsync(string lotteryType, int limit = 5, bool includeNextTime = false)
        {
            if (limit < 1 || limit > 20)
                throw new ArgumentOutOfRangeException(nameof(limit), "limit必须在1-20之间");

            var request = new LotteryRequest
            {
                Token = _apiToken,
                LotteryType = lotteryType,
                Limit = limit,
                IncludeNextTime = includeNextTime
            };

            var response = await ExecuteAsync(request);
            return response?.Data ?? new List<LotteryResult>();
        }

        /// <summary>
        /// 获取指定日期的历史开奖数据
        /// </summary>
        /// <param name="lotteryType">彩种代码</param>
        /// <param name="date">查询日期（格式：YYYYMMDD）</param>
        /// <returns>开奖结果列表</returns>
        public async Task<List<LotteryResult>> GetHistoryByDateAsync(string lotteryType, DateTime date)
        {
            var request = new LotteryRequest
            {
                Token = _apiToken,
                LotteryType = lotteryType,
                Date = date
            };

            var response = await ExecuteAsync(request);
            return response?.Data ?? new List<LotteryResult>();
        }

        /// <summary>
        /// 获取历史开奖数据（最近N期）
        /// </summary>
        /// <param name="lotteryType">彩种代码</param>
        /// <param name="limit">返回条数</param>
        /// <returns>开奖结果列表</returns>
        public async Task<List<LotteryResult>> GetHistoryAsync(string lotteryType, int limit = 10)
        {
            var request = new LotteryRequest
            {
                Token = _apiToken,
                LotteryType = lotteryType,
                Limit = Math.Min(limit, 20)
            };

            var response = await ExecuteAsync(request);
            return response?.Data ?? new List<LotteryResult>();
        }

        /// <summary>
        /// 执行API请求
        /// </summary>
        private async Task<LotteryResponse> ExecuteAsync(LotteryRequest request)
        {
            var url = BuildRequestUrl(request);
            var json = await _httpClient.GetStringAsync(url);
            
            var serializer = new JavaScriptSerializer();
            var response = serializer.Deserialize<LotteryResponse>(json);

            if (response == null)
                throw new HttpRequestException("API返回数据解析失败");

            return response;
        }

        /// <summary>
        /// 构建请求URL
        /// </summary>
        private string BuildRequestUrl(LotteryRequest request)
        {
            var format = "json2"; // 推荐使用JSON2格式
            var url = $"{_baseUrl}?token={_apiToken}&t={request.LotteryType}&p={format}";

            if (request.Limit > 0)
                url += $"&limit={request.Limit}";

            if (request.IncludeNextTime)
                url += "&nexttime=1";

            if (request.Date.HasValue)
                url += $"&date={request.Date.Value:yyyyMMdd}";

            return url;
        }

        /// <summary>
        /// 获取支持的彩种列表
        /// 
        /// 支持 cstatus=1 的全部彩种（共109个）
        /// 使用数据库 lotteryid 字段作为彩种代码
        /// </summary>
        public static Dictionary<string, string> GetSupportedLotteries()
        {
            return new Dictionary<string, string>
            {
                // ==================== 时时彩系列 ====================
                { "1", "黑龙江时时彩" },
                { "2", "内蒙古时时彩" },
                { "3", "天津时时彩" },
                { "4", "重庆时时彩(欢乐生肖)" },
                { "5", "新疆时时彩" },
                { "6", "云南时时彩" },
                { "7", "上海时时乐" },

                // ==================== PK10/赛车系列 ====================
                { "8", "北京赛车(PK10)" },
                { "9", "北京快中彩" },
                { "112", "幸运飞艇" },

                // ==================== 快乐12系列 ====================
                { "11", "辽宁快乐12" },
                { "12", "浙江快乐12" },
                { "13", "四川快乐12" },
                { "14", "河南泳坛夺金(481)" },
                { "15", "山西泳坛夺金(481)" },
                { "16", "新疆喜乐彩" },
                { "17", "四川金七乐" },
                { "19", "湖南幸运赛车" },
                { "20", "山东群英会" },

                // ==================== 11选5系列 ====================
                { "52", "江苏11选5" },
                { "53", "湖北11选5" },
                { "54", "浙江11选5" },
                { "55", "江西11选5" },
                { "56", "新疆11选5" },
                { "57", "安徽11选5" },
                { "58", "广西11选5" },
                { "59", "广东11选5" },
                { "60", "山东11选5" },

                // ==================== 快三系列 ====================
                { "78", "江苏快三" },
                { "79", "广西快三" },
                { "80", "北京快三" },
                { "81", "福建快三" },
                { "82", "河北快三" },
                { "83", "上海快三" },
                { "84", "湖北快三" },
                { "85", "安徽快三" },
                { "86", "吉林快三" },

                // ==================== 快乐十分系列 ====================
                { "93", "广东快乐十分" },
                { "94", "广西快乐十分" },
                { "95", "天津快乐十分" },
                { "96", "湖南快乐十分" },
                { "97", "重庆幸运农场" },
                { "98", "陕西快乐十分" },
                { "99", "山西快乐十分" },
                { "100", "云南快乐十分" },
                { "101", "黑龙江快乐十分" },

                // ==================== 168极速系列 ====================
                { "102", "168极速赛车(PK10)" },
                { "103", "168极速时时彩" },
                { "104", "168极速飞艇" },
                { "105", "168极速快乐十分" },
                { "106", "168极速⑥合彩" },
                { "107", "168极速11选5" },
                { "108", "168极速快三" },
                { "109", "168极速快乐8" },
                { "110", "168极速28(PC蛋蛋)" },

                // ==================== 澳洲彩票 ====================
                { "113", "澳洲幸运5(时时彩)" },
                { "114", "澳洲幸运8(快乐十分)" },
                { "115", "澳洲幸运10(PK10)" },
                { "116", "澳洲幸运20(快乐8)" },

                // ==================== 台湾彩票 ====================
                { "117", "台湾賓果(BINGO)" },
                { "135", "台湾五分彩" },

                // ==================== 越南/印尼彩票 ====================
                { "118", "越南河内5分彩" },
                { "119", "越南河内1分彩" },
                { "120", "印尼5分彩" },
                { "121", "印尼1分彩" },

                // ==================== 加拿大彩票 ====================
                { "122", "加拿大卑诗快乐8" },
                { "123", "加拿大西部快乐8" },
                { "140", "加拿大卑诗3.5分彩" },

                // ==================== 快乐8/Keno系列 ====================
                { "10", "北京快乐8" },
                { "127", "斯洛伐克快乐8" },
                { "162", "俄勒冈快乐8" },
                { "164", "肯塔基快乐8" },

                // ==================== 28/PC蛋蛋系列 ====================
                { "129", "PC蛋蛋(北京28)" },
                { "130", "加拿大28" },
                { "131", "斯洛伐克28" },
                { "134", "澳洲28" },
                { "136", "台湾⑥合彩28" },
                { "137", "俄勒冈28" },
                { "138", "肯塔基28" },

                // ==================== 腾讯/QQ彩票 ====================
                { "132", "腾讯分分彩(奇趣)" },
                { "133", "QQ分分彩(奇趣)" },

                // ==================== 波场彩票 ====================
                { "163", "波场哈希分分彩" },

                // ==================== 传统彩票 - 福彩 ====================
                { "21", "（福彩）福彩3D" },
                { "22", "（体彩）双色球" },
                { "23", "（体彩）七乐彩" },
                { "31", "福彩15选5" },
                { "32", "福彩东方6+1" },
                { "39", "黑龙江福彩22选5" },
                { "40", "黑龙江福彩36选7" },
                { "41", "黑龙江福彩P62" },
                { "43", "上海天天彩选4" },
                { "38", "广西福彩快乐双彩" },
                { "47", "河北燕赵20选5" },
                { "48", "河北燕赵好运2" },
                { "49", "河北燕赵好运3" },
                { "50", "河北燕赵排列5" },
                { "51", "河北燕赵排列7" },

                // ==================== 传统彩票 - 体彩 ====================
                { "24", "（体彩）大乐透" },
                { "25", "（体彩）排列三" },
                { "26", "（体彩）排列五" },
                { "27", "（体彩）七星彩" },
                { "28", "足彩胜负(任九)" },
                { "29", "四场进球彩" },
                { "30", "六场半全场" },
                { "35", "福建体彩22选5" },
                { "36", "福建体彩31选7" },
                { "37", "福建体彩36选7" },
                { "42", "江苏体彩7位数" },
                { "159", "海南4+1" },

                // ==================== 香港/国际彩票 ====================
                { "111", "香港⑥合彩" },
                { "160", "美国强力球" },
                { "161", "美国超级百万" }
            };
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _httpClient?.Dispose();
                }
                _disposed = true;
            }
        }
    }
}
