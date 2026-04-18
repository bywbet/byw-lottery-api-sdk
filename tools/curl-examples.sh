#!/bin/bash
#============================================
# 博易网彩票开奖数据API - cURL示例
# 
# 官方文档: https://www.byw.bet
# API文档: https://www.byw.bet/show.html
#============================================

# API基础地址
API_BASE="http://api.byw.bet:868/api"

# API Token (请替换为你的Token)
TOKEN="YOUR_API_TOKEN"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 输出分隔线
print_separator() {
    echo "============================================"
}

#============================================
# 示例1: 获取最新开奖数据 (重庆时时彩)
#============================================
echo -e "${GREEN}示例1: 获取重庆时时彩最新开奖数据${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=cqssc&limit=1&p=json" | jq .
echo ""

#============================================
# 示例2: 获取多期开奖数据
#============================================
echo -e "${GREEN}示例2: 获取最近5期开奖数据${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=cqssc&limit=5&p=json" | jq .
echo ""

#============================================
# 示例3: 获取带下一期开奖时间
#============================================
echo -e "${GREEN}示例3: 获取开奖数据+下一期时间${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=cqssc&limit=3&nexttime=1&p=json" | jq .
echo ""

#============================================
# 示例4: 指定日期查询
#============================================
echo -e "${GREEN}示例4: 查询指定日期开奖数据${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=cqssc&date=20260418&p=json" | jq .
echo ""

#============================================
# 示例5: XML格式请求
#============================================
echo -e "${GREEN}示例5: XML格式请求${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=cqssc&limit=2&p=xml"
echo ""
echo ""

#============================================
# 示例6: 广东11选5开奖查询
#============================================
echo -e "${GREEN}示例6: 广东11选5开奖查询${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=gd11x5&limit=5&p=json" | jq .
echo ""

#============================================
# 示例7: 安徽快三开奖查询
#============================================
echo -e "${GREEN}示例7: 安徽快三开奖查询${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=ahk3&limit=5&p=json" | jq .
echo ""

#============================================
# 示例8: 排列三开奖查询
#============================================
echo -e "${GREEN}示例8: 排列三开奖查询${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=pl3&limit=5&p=json" | jq .
echo ""

#============================================
# 示例9: 福彩3D开奖查询
#============================================
echo -e "${GREEN}示例9: 福彩3D开奖查询${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=fc3d&limit=5&p=json" | jq .
echo ""

#============================================
# 示例10: 双色球开奖查询
#============================================
echo -e "${GREEN}示例10: 双色球开奖查询${NC}"
print_separator
curl -s "${API_BASE}?token=${TOKEN}&t=ssq&limit=5&p=json" | jq .
echo ""

#============================================
# 示例11: JSONP跨域请求 (用于前端)
#============================================
echo -e "${GREEN}示例11: JSONP跨域请求${NC}"
print_separator
echo "jQuery前端调用示例:"
echo '$.getJSON("http://api.byw.bet:868/api?token=${TOKEN}&t=cqssc&p=jsonp&callback=?", function(data) { console.log(data); });'
echo ""

#============================================
# 示例12: 使用GET方法的标准调用
#============================================
echo -e "${GREEN}示例12: 标准GET请求${NC}"
print_separator
curl -X GET "${API_BASE}?token=${TOKEN}&t=cqssc&limit=1&p=json" \
    -H "Accept: application/json" \
    -H "User-Agent: BywLottery-API-Client/1.0"
echo ""
echo ""

#============================================
# 彩种代码参考
#============================================
print_separator
echo -e "${YELLOW}支持的彩种代码:${NC}"
print_separator
echo "时时彩: cqssc(重庆), tjsssc(天津), xjssc(新疆)"
echo "11选5: gd11x5(广东), sd11x5(山东), jx11x5(江西)"
echo "快三: ahk3(安徽), jsk3(江苏), hbk3(湖北)"
echo "其他: pl3(排列三), pl5(排列五), fc3d(福彩3D), ssq(双色球), qlc(七乐彩)"
print_separator
