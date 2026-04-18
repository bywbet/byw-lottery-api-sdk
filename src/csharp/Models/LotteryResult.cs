using System;

namespace BywLottery.SDK.Models
{
    /// <summary>
    /// 彩票开奖结果模型
    /// 
    /// 用于承载开奖数据的核心数据结构
    /// </summary>
    public class LotteryResult
    {
        /// <summary>
        /// 期号
        /// </summary>
        public string Expect { get; set; }

        /// <summary>
        /// 开奖号码（逗号分隔）
        /// </summary>
        public string Opencode { get; set; }

        /// <summary>
        /// 开奖时间
        /// </summary>
        public string Opentime { get; set; }

        /// <summary>
        /// 将开奖号码解析为数字数组
        /// </summary>
        public int[] GetOpenCodesAsArray()
        {
            if (string.IsNullOrEmpty(Opencode))
                return Array.Empty<int>();

            var parts = Opencode.Split(',');
            var codes = new int[parts.Length];
            
            for (int i = 0; i < parts.Length; i++)
            {
                if (int.TryParse(parts[i].Trim(), out int code))
                    codes[i] = code;
            }

            return codes;
        }

        /// <summary>
        /// 获取开奖时间（DateTime类型）
        /// </summary>
        public DateTime? GetOpenTimeAsDateTime()
        {
            if (DateTime.TryParse(Opentime, out DateTime result))
                return result;
            return null;
        }

        /// <summary>
        /// 格式化输出
        /// </summary>
        public override string ToString()
        {
            return $"期号: {Expect}, 开奖号码: {Opencode}, 开奖时间: {Opentime}";
        }
    }
}
