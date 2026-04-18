/**
 * 彩票API Android/Kotlin 示例
 * 
 * 使用 OkHttp + Gson 解析 JSON 数据
 * 
 * @author BYW Lottery SDK
 * @version 1.0.0
 */

package com.byw.lottery

import okhttp3.OkHttpClient
import okhttp3.Request
import com.google.gson.JsonObject
import com.google.gson.JsonArray
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
 * 彩票API服务类
 */
class LotteryApiService(
    private val baseUrl: String = "http://api.byw.bet:868/api",
    private val token: String
) {
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()

    /**
     * 获取最新开奖数据
     * 
     * @param lotteryId 彩种ID (如: "4" = 重庆时时彩)
     * @param limit 返回数量
     * @return 开奖结果列表
     */
    fun getLatest(lotteryId: String, limit: Int = 10): List<LotteryResult> {
        val url = "$baseUrl?token=$token&t=$lotteryId&limit=$limit&p=json"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .addHeader("Accept", "application/json")
            .build()

        return try {
            val response = client.newCall(request).execute()
            
            if (!response.isSuccessful) {
                throw Exception("请求失败: HTTP ${response.code}")
            }

            val body = response.body?.string() ?: throw Exception("响应为空")
            parseLotteryResponse(body)
            
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    /**
     * 获取指定日期的开奖数据
     * 
     * @param lotteryId 彩种ID
     * @param date 日期 (格式: yyyy-MM-dd)
     * @return 开奖结果列表
     */
    fun getByDate(lotteryId: String, date: String): List<LotteryResult> {
        val url = "$baseUrl?token=$token&t=$lotteryId&date=$date&p=json"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .addHeader("Accept", "application/json")
            .build()

        return try {
            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: throw Exception("响应为空")
            parseLotteryResponse(body)
            
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    /**
     * 解析JSON响应
     */
    private fun parseLotteryResponse(json: String): List<LotteryResult> {
        val results = mutableListOf<LotteryResult>()
        
        try {
            val jsonObject = com.google.gson.JsonParser.parseString(json).asJsonObject
            val dataArray = jsonObject.getAsJsonArray("Data")
            
            dataArray.forEach { element ->
                val obj = element.asJsonObject
                results.add(
                    LotteryResult(
                        expect = obj.get("Expect").asString,
                        opencode = obj.get("Opencode").asString,
                        opentime = obj.get("Opentime").asString
                    )
                )
            }
        } catch (e: Exception) {
            throw Exception("JSON解析失败: ${e.message}")
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
    val api = LotteryApiService(
        token = "YOUR_TOKEN_HERE",
        baseUrl = "http://api.byw.bet:868/api"
    )
    
    try {
        // 获取重庆时时彩最新10期
        println("=== 重庆时时彩最新开奖 ===")
        val results = api.getLatest(LotteryTypes.CHONGQING_SSC, 10)
        
        results.forEachIndexed { index, result ->
            println("${index + 1}. 期号: ${result.expect}, 号码: ${result.opencode}, 时间: ${result.opentime}")
        }
        
        // 获取广东11选5最新5期
        println("\n=== 广东11选5最新开奖 ===")
        val results2 = api.getLatest(LotteryTypes.GUANGDONG_11X5, 5)
        
        results2.forEachIndexed { index, result ->
            println("${index + 1}. 期号: ${result.expect}, 号码: ${result.opencode}, 时间: ${result.opentime}")
        }
        
    } catch (e: Exception) {
        println("错误: ${e.message}")
    }
}
