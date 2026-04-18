using System;

namespace BywLottery.SDK.Models
{
    /// <summary>
    /// 彩种类型枚举
    /// 
    /// 彩票数据SDK支持的彩种分类
    /// </summary>
    public enum LotteryCategory
    {
        /// <summary>时时彩系列</summary>
        SSC,
        
        /// <summary>11选5系列</summary>
        ElevenToFive,
        
        /// <summary>快三系列</summary>
        KuaiSan,
        
        /// <summary>排列彩系列</summary>
        PaiLie,
        
        /// <summary>福彩3D</summary>
        FC3D,
        
        /// <summary>双色球/七乐彩</summary>
        DoubleColor
    }

    /// <summary>
    /// 彩票类型信息
    /// </summary>
    public class LotteryInfo
    {
        /// <summary>
        /// 彩种代码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 彩种名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 彩种类别
        /// </summary>
        public LotteryCategory Category { get; set; }

        /// <summary>
        /// 开奖频率描述
        /// </summary>
        public string Frequency { get; set; }
    }
}
