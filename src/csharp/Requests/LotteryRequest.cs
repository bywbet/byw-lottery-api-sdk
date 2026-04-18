using System;

namespace BywLottery.SDK.Requests
{
    /// <summary>
    /// 彩票数据请求参数
    /// 
    /// 用于封装API请求参数
    /// </summary>
    public class LotteryRequest
    {
        /// <summary>
        /// API接口密钥（必填）
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// 彩种代码（必填）
        /// 如: cqssc(重庆时时彩), gd11x5(广东11选5)
        /// </summary>
        public string LotteryType { get; set; }

        /// <summary>
        /// 返回条数（1-20，默认1）
        /// </summary>
        public int Limit { get; set; } = 1;

        /// <summary>
        /// 是否返回下一期开奖时间
        /// </summary>
        public bool IncludeNextTime { get; set; }

        /// <summary>
        /// 指定日期查询（格式：yyyyMMdd）
        /// </summary>
        public DateTime? Date { get; set; }

        /// <summary>
        /// 返回数据格式: json, xml, json2, jsonp
        /// </summary>
        public string Format { get; set; } = "json";
    }
}
