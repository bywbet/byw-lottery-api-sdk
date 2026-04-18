/**
 * 彩票API Android/Kotlin XML示例
 * 
 * 使用 OkHttp 获取数据 + XmlPullParser 解析 XML
 * 
 * @author BYW Lottery SDK
 * @version 1.0.0
 */

package com.byw.lottery

import okhttp3.OkHttpClient
import okhttp3.Request
import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParserFactory
import java.io.StringReader
import java.util.concurrent.TimeUnit

/**
 * 彩票开奖数据结构
 */
data class LotteryResult(
    val expect: String,      // 开奖期号
    val opencode: String,    // 开奖号码
    val opentime: String     // 开奖时间
)

/**
 * API响应结构
 */
data class LotteryResponse(
    val rows: Int,
    val data: List<LotteryResult>
)

/**
 * 彩票XML API服务类
 */
class LotteryXmlApiService(
    private val baseUrl: String = "http://api.byw.bet:868/api",
    private val token: String
) {
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()

    /**
     * 获取最新开奖数据 (XML格式)
     * 
     * @param lotteryId 彩种ID (如: "4" = 重庆时时彩)
     * @param limit 返回数量
     * @return 开奖结果列表
     */
    fun getLatest(lotteryId: String, limit: Int = 10): List<LotteryResult> {
        val url = "$baseUrl?token=$token&t=$lotteryId&limit=$limit&p=xml"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .addHeader("Accept", "application/xml, text/xml")
            .build()

        return try {
            val response = client.newCall(request).execute()
            
            if (!response.isSuccessful) {
                throw Exception("请求失败: HTTP ${response.code}")
            }

            val body = response.body?.string() ?: throw Exception("响应为空")
            parseXmlResponse(body)
            
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    /**
     * 获取指定日期的开奖数据 (XML格式)
     * 
     * @param lotteryId 彩种ID
     * @param date 日期 (格式: yyyy-MM-dd)
     * @return 开奖结果列表
     */
    fun getByDate(lotteryId: String, date: String): List<LotteryResult> {
        val url = "$baseUrl?token=$token&t=$lotteryId&date=$date&p=xml"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .addHeader("Accept", "application/xml, text/xml")
            .build()

        return try {
            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: throw Exception("响应为空")
            parseXmlResponse(body)
            
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    /**
     * 使用 XmlPullParser 解析 XML
     * 
     * XML格式:
     * <?xml version="1.0" encoding="utf-8"?>
     * <xml row="5">
     *     <row expect="20260418001" opencode="1,2,3,4,5" opentime="2026-04-18 09:00:00"/>
     *     <row expect="20260417059" opencode="2,3,4,5,6" opentime="2026-04-17 22:00:00"/>
     * </xml>
     */
    private fun parseXmlResponse(xml: String): List<LotteryResult> {
        val results = mutableListOf<LotteryResult>()
        
        try {
            val factory = XmlPullParserFactory.newInstance()
            factory.isNamespaceAware = false
            val parser = factory.newPullParser()
            parser.setInput(StringReader(xml))
            
            var eventType = parser.eventType
            var currentTag = ""
            
            // 用于临时存储当前行的属性
            var currentExpect = ""
            var currentOpencode = ""
            var currentOpentime = ""
            
            while (eventType != XmlPullParser.END_DOCUMENT) {
                when (eventType) {
                    XmlPullParser.START_TAG -> {
                        currentTag = parser.name
                        
                        // 解析 <row> 标签的属性
                        if (currentTag == "row") {
                            currentExpect = parser.getAttributeValue(null, "expect") ?: ""
                            currentOpencode = parser.getAttributeValue(null, "opencode") ?: ""
                            currentOpentime = parser.getAttributeValue(null, "opentime") ?: ""
                        }
                    }
                    
                    XmlPullParser.END_TAG -> {
                        // 解析完一行数据
                        if (parser.name == "row") {
                            if (currentExpect.isNotEmpty()) {
                                results.add(
                                    LotteryResult(
                                        expect = currentExpect,
                                        opencode = currentOpencode,
                                        opentime = currentOpentime
                                    )
                                )
                            }
                        }
                        currentTag = ""
                    }
                }
                
                eventType = parser.next()
            }
            
        } catch (e: Exception) {
            throw Exception("XML解析失败: ${e.message}")
        }
        
        return results
    }
    
    /**
     * 使用 Kotlin 内置的 XML 解析 (简单方式)
     */
    private fun parseXmlWithKotlinBuiltin(xml: String): List<LotteryResult> {
        val results = mutableListOf<LotteryResult>()
        
        // 使用正则表达式解析
        val rowPattern = Regex("""<row\s+expect="([^"]+)"\s+opencode="([^"]+)"\s+opentime="([^"]+)""""")
        
        rowPattern.findAll(xml).forEach { match ->
            results.add(
                LotteryResult(
                    expect = match.groupValues[1],
                    opencode = match.groupValues[2],
                    opentime = match.groupValues[3]
                )
            )
        }
        
        return results
    }
}

/**
 * 彩种常量
 */
object LotteryTypes {
    // 时时彩系列
    const val HEILONGJIANG_SSC = "1"   // 黑龙江时时彩
    const val NEIMENGGU_SSC = "2"       // 内蒙古时时彩
    const val TIANJIN_SSC = "3"         // 天津时时彩
    const val CHONGQING_SSC = "4"       // 重庆时时彩
    const val XINJIANG_SSC = "5"        // 新疆时时彩
    
    // 11选5系列
    const val GUANGDONG_11X5 = "59"     // 广东11选5
    const val SHANDONG_11X5 = "60"      // 山东11选5
    const val JIANGXI_11X5 = "55"       // 江西11选5
    const val JIANGSU_11X5 = "52"       // 江苏11选5
    
    // 快三系列
    const val JIANGSU_K3 = "78"         // 江苏快三
    const val ANHUI_K3 = "85"           // 安徽快三
    const val HUBEI_K3 = "84"           // 湖北快三
    
    // PK10系列
    const val BEIJING_PK10 = "8"        // 北京赛车
    const val LUCKY_FLYING = "112"      // 幸运飞艇
    const val SPEED_RACING = "102"      // 168极速赛车
    
    // 幸运系列
    const val AUSTRALIA_LUCKY10 = "115" // 澳洲幸运10
    const val TAIWAN_BINGO = "117"      // 台湾宾果
    
    // 数字彩
    const val FUCAI_3D = "21"           // 福彩3D
    const val SHUANGSEQIU = "22"        // 双色球
    const val DALETOU = "24"            // 大乐透
    const val PAILIE3 = "25"            // 排列三
    const val PAILIE5 = "26"            // 排列五
}

/**
 * 使用示例
 */
fun main() {
    val api = LotteryXmlApiService(
        token = "YOUR_TOKEN_HERE",
        baseUrl = "http://api.byw.bet:868/api"
    )
    
    try {
        // 获取重庆时时彩最新10期 (XML格式)
        println("=== 重庆时时彩最新开奖 (XML) ===")
        val results = api.getLatest(LotteryTypes.CHONGQING_SSC, 10)
        
        results.forEachIndexed { index, result ->
            println("${index + 1}. 期号: ${result.expect}, 号码: ${result.opencode}, 时间: ${result.opentime}")
        }
        
        // 获取广东11选5最新5期 (XML格式)
        println("\n=== 广东11选5最新开奖 (XML) ===")
        val results2 = api.getLatest(LotteryTypes.GUANGDONG_11X5, 5)
        
        results2.forEachIndexed { index, result ->
            println("${index + 1}. 期号: ${result.expect}, 号码: ${result.opencode}, 时间: ${result.opentime}")
        }
        
    } catch (e: Exception) {
        println("错误: ${e.message}")
    }
}
