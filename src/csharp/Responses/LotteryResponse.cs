using System.Collections.Generic;
using BywLottery.SDK.Models;

namespace BywLottery.SDK.Responses
{
    /// <summary>
    /// 彩票API响应结果
    /// 
    /// 统一响应数据结构
    /// </summary>
    public class LotteryResponse
    {
        /// <summary>
        /// 返回数据条数
        /// </summary>
        public int Rows { get; set; }

        /// <summary>
        /// 彩种代码
        /// </summary>
        public string T { get; set; }

        /// <summary>
        /// 下一期开奖时间（当请求包含nexttime=1时返回）
        /// </summary>
        public string Nexttime { get; set; }

        /// <summary>
        /// 开奖数据列表
        /// </summary>
        public List<LotteryResult> Data { get; set; }

        /// <summary>
        /// 响应是否成功
        /// </summary>
        public bool IsSuccess => Rows > 0 && Data != null;
    }

    /// <summary>
    /// API错误响应
    /// </summary>
    public class ErrorResponse
    {
        /// <summary>
        /// 错误代码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string Message { get; set; }
    }
}
