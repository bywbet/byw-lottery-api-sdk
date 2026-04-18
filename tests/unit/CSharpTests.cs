using System;
using System.Threading.Tasks;
using Xunit;
using BywLottery.SDK;

namespace BywLottery.Tests.Unit
{
    /// <summary>
    /// C# SDK 单元测试
    /// </summary>
    public class BywClientTests
    {
        private const string TestToken = "test_token";
        private readonly BywClient _client;

        public BywClientTests()
        {
            _client = new BywClient(TestToken);
        }

        [Fact]
        public void Constructor_WithValidToken_ShouldNotThrow()
        {
            // Arrange & Act
            var client = new BywClient(TestToken);

            // Assert
            Assert.NotNull(client);
        }

        [Fact]
        public void Constructor_WithEmptyToken_ShouldThrow()
        {
            // Arrange & Act & Assert
            Assert.Throws<ArgumentNullException>(() => new BywClient(""));
        }

        [Fact]
        public void Constructor_WithNullToken_ShouldThrow()
        {
            // Arrange & Act & Assert
            Assert.Throws<ArgumentNullException>(() => new BywClient(null));
        }

        [Theory]
        [InlineData("cqssc")]
        [InlineData("gd11x5")]
        [InlineData("ahk3")]
        public void GetSupportedLotteries_ShouldContainValidTypes(string lotteryType)
        {
            // Arrange
            var lotteries = BywClient.GetSupportedLotteries();

            // Assert
            Assert.Contains(lotteryType, lotteries.Keys);
        }

        [Fact]
        public void GetSupportedLotteries_ShouldReturnDictionary()
        {
            // Arrange & Act
            var lotteries = BywClient.GetSupportedLotteries();

            // Assert
            Assert.IsType<Dictionary<string, string>>(lotteries);
            Assert.NotEmpty(lotteries);
        }

        [Theory]
        [InlineData("cqssc", "重庆时时彩")]
        [InlineData("gd11x5", "广东11选5")]
        [InlineData("ahk3", "安徽快三")]
        public void GetSupportedLotteries_ShouldReturnCorrectNames(string code, string expectedName)
        {
            // Arrange
            var lotteries = BywClient.GetSupportedLotteries();

            // Assert
            Assert.Equal(expectedName, lotteries[code]);
        }
    }

    /// <summary>
    /// 数据模型测试
    /// </summary>
    public class ModelsTests
    {
        [Fact]
        public void LotteryResult_GetOpenCodesAsArray_ShouldParseCorrectly()
        {
            // Arrange
            var result = new LotteryResult
            {
                Expect = "20260418053",
                Opencode = "9,0,0,1,1",
                Opentime = "2026-04-18 21:50:03"
            };

            // Act
            var codes = result.GetOpenCodesAsArray();

            // Assert
            Assert.Equal(5, codes.Length);
            Assert.Equal(9, codes[0]);
            Assert.Equal(0, codes[1]);
        }

        [Fact]
        public void LotteryResult_GetOpenTimeAsDateTime_ShouldParseCorrectly()
        {
            // Arrange
            var result = new LotteryResult
            {
                Opentime = "2026-04-18 21:50:03"
            };

            // Act
            var dateTime = result.GetOpenTimeAsDateTime();

            // Assert
            Assert.NotNull(dateTime);
            Assert.Equal(2026, dateTime.Value.Year);
            Assert.Equal(4, dateTime.Value.Month);
            Assert.Equal(18, dateTime.Value.Day);
        }

        [Fact]
        public void LotteryResult_ToString_ShouldReturnFormattedString()
        {
            // Arrange
            var result = new LotteryResult
            {
                Expect = "20260418053",
                Opencode = "9,0,0,1,1",
                Opentime = "2026-04-18 21:50:03"
            };

            // Act
            var str = result.ToString();

            // Assert
            Assert.Contains("20260418053", str);
            Assert.Contains("9,0,0,1,1", str);
        }

        [Fact]
        public void LotteryResult_GetOpenCodesAsArray_WithEmptyOpencode_ShouldReturnEmptyArray()
        {
            // Arrange
            var result = new LotteryResult
            {
                Opencode = ""
            };

            // Act
            var codes = result.GetOpenCodesAsArray();

            // Assert
            Assert.Empty(codes);
        }
    }

    /// <summary>
    /// 请求参数测试
    /// </summary>
    public class RequestTests
    {
        [Fact]
        public void LotteryRequest_DefaultValues_ShouldBeCorrect()
        {
            // Arrange & Act
            var request = new LotteryRequest();

            // Assert
            Assert.Equal(1, request.Limit);
            Assert.False(request.IncludeNextTime);
            Assert.Null(request.Date);
            Assert.Equal("json", request.Format);
        }

        [Fact]
        public void LotteryRequest_CanSetAllProperties()
        {
            // Arrange
            var date = new DateTime(2026, 4, 18);

            // Act
            var request = new LotteryRequest
            {
                Token = "test_token",
                LotteryType = "cqssc",
                Limit = 10,
                IncludeNextTime = true,
                Date = date,
                Format = "json2"
            };

            // Assert
            Assert.Equal("test_token", request.Token);
            Assert.Equal("cqssc", request.LotteryType);
            Assert.Equal(10, request.Limit);
            Assert.True(request.IncludeNextTime);
            Assert.Equal(date, request.Date);
            Assert.Equal("json2", request.Format);
        }
    }
}
