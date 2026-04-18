/**
 * 彩票API Flutter/Dart 示例
 * 
 * 使用 http package + dart:convert 解析 JSON 数据
 * 
 * @author BYW Lottery SDK
 * @version 1.0.0
 */

import 'dart:convert';
import 'package:http/http.dart' as http;

// ============== 常量配置 ==============

/// API基础地址
const String kApiBaseUrl = 'http://api.byw.bet:868/api';

/// API Token (请替换为您的Token)
const String kApiToken = 'YOUR_TOKEN_HERE';

/// 彩种类型
class LotteryTypes {
  // 时时彩系列
  static const String heilongjiangSSC = '1';   // 黑龙江时时彩
  static const String neimengguSSC = '2';       // 内蒙古时时彩
  static const String tianjinSSC = '3';         // 天津时时彩
  static const String chongqingSSC = '4';        // 重庆时时彩
  static const String xinjiangSSC = '5';        // 新疆时时彩
  
  // 11选5系列
  static const String guangdong11x5 = '59';     // 广东11选5
  static const String shandong11x5 = '60';      // 山东11选5
  static const String jiangxi11x5 = '55';       // 江西11选5
  static const String jiangsu11x5 = '52';       // 江苏11选5
  
  // 快三系列
  static const String jiangsuK3 = '78';         // 江苏快三
  static const String anhuiK3 = '85';           // 安徽快三
  static const String hubeiK3 = '84';           // 湖北快三
  
  // PK10系列
  static const String beijingPK10 = '8';        // 北京赛车
  static const String luckyFlying = '112';      // 幸运飞艇
  static const String speedRacing = '102';      // 168极速赛车
  
  // 幸运系列
  static const String australiaLucky10 = '115'; // 澳洲幸运10
  static const String taiwanBingo = '117';      // 台湾宾果
  
  // 数字彩
  static const String fucai3D = '21';           // 福彩3D
  static const String shuangseqiu = '22';        // 双色球
  static const String daletou = '24';           // 大乐透
  static const String pailie3 = '25';           // 排列三
  static const String pailie5 = '26';           // 排列五
  
  /// 彩种名称映射
  static const Map<String, String> names = {
    '1': '黑龙江时时彩',
    '2': '内蒙古时时彩',
    '3': '天津时时彩',
    '4': '重庆时时彩',
    '5': '新疆时时彩',
    '59': '广东11选5',
    '60': '山东11选5',
    '78': '江苏快三',
    '85': '安徽快三',
    '8': '北京赛车',
    '112': '幸运飞艇',
    '21': '福彩3D',
    '22': '双色球',
    '24': '大乐透',
  };
}

// ============== 数据模型 ==============

/// 彩票开奖结果
class LotteryResult {
  /// 开奖期号
  final String expect;
  
  /// 开奖号码
  final String opencode;
  
  /// 开奖时间
  final String opentime;
  
  /// 原始数据
  final Map<String, dynamic> rawData;
  
  LotteryResult({
    required this.expect,
    required this.opencode,
    required this.opentime,
    this.rawData = const {},
  });
  
  /// 从JSON创建
  factory LotteryResult.fromJson(Map<String, dynamic> json) {
    return LotteryResult(
      expect: json['Expect'] ?? '',
      opencode: json['Opencode'] ?? '',
      opentime: json['Opentime'] ?? '',
      rawData: json,
    );
  }
  
  /// 格式化期号 (20260418001 -> 20260418-001)
  String get formattedExpect {
    if (expect.length < 11) return expect;
    return '${expect.substring(0, 8)}-${expect.substring(8)}';
  }
  
  /// 开奖号码数组
  List<String> get opencodeList {
    return opencode.isNotEmpty ? opencode.split(',') : [];
  }
  
  @override
  String toString() {
    return 'LotteryResult(expect: $expect, opencode: $opencode, opentime: $opentime)';
  }
}

/// API响应
class LotteryApiResponse {
  final int rows;
  final List<LotteryResult> data;
  
  LotteryApiResponse({
    required this.rows,
    required this.data,
  });
  
  factory LotteryApiResponse.fromJson(Map<String, dynamic> json) {
    final dataList = json['Data'] as List? ?? [];
    return LotteryApiResponse(
      rows: json['Rows'] ?? 0,
      data: dataList.map((e) => LotteryResult.fromJson(e)).toList(),
    );
  }
}

// ============== API服务 ==============

/// 彩票API异常
class LotteryApiException implements Exception {
  final String message;
  final int? code;
  
  LotteryApiException(this.message, {this.code});
  
  @override
  String toString() => 'LotteryApiException: $message (code: $code)';
}

/// 彩票API服务
class LotteryApiService {
  /// HTTP客户端
  final http.Client _client;
  
  /// API基础地址
  final String baseUrl;
  
  /// API Token
  final String token;
  
  LotteryApiService({
    http.Client? client,
    this.baseUrl = kApiBaseUrl,
    required this.token,
  }) : _client = client ?? http.Client();
  
  /// 获取最新开奖数据
  /// 
  /// [lotteryId] 彩种ID (如: "4" = 重庆时时彩)
  /// [limit] 返回数量
  /// 
  /// 返回开奖结果列表
  Future<List<LotteryResult>> getLatest(String lotteryId, {int limit = 10}) async {
    final url = Uri.parse(
      '$baseUrl?token=$token&t=$lotteryId&limit=$limit&p=json'
    );
    
    try {
      final response = await _client.get(
        url,
        headers: {
          'Accept': 'application/json',
        },
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () => throw LotteryApiException('请求超时'),
      );
      
      if (response.statusCode != 200) {
        throw LotteryApiException(
          '请求失败',
          code: response.statusCode,
        );
      }
      
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      final apiResponse = LotteryApiResponse.fromJson(json);
      return apiResponse.data;
      
    } catch (e) {
      if (e is LotteryApiException) rethrow;
      throw LotteryApiException('网络错误: $e');
    }
  }
  
  /// 获取指定日期的开奖数据
  /// 
  /// [lotteryId] 彩种ID
  /// [date] 日期 (格式: yyyy-MM-dd)
  /// 
  /// 返回开奖结果列表
  Future<List<LotteryResult>> getByDate(String lotteryId, String date) async {
    final url = Uri.parse(
      '$baseUrl?token=$token&t=$lotteryId&date=$date&p=json'
    );
    
    try {
      final response = await _client.get(
        url,
        headers: {
          'Accept': 'application/json',
        },
      );
      
      if (response.statusCode != 200) {
        throw LotteryApiException(
          '请求失败',
          code: response.statusCode,
        );
      }
      
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      final apiResponse = LotteryApiResponse.fromJson(json);
      return apiResponse.data;
      
    } catch (e) {
      if (e is LotteryApiException) rethrow;
      throw LotteryApiException('网络错误: $e');
    }
  }
  
  /// 释放资源
  void dispose() {
    _client.close();
  }
}

// ============== 使用示例 ==============

/// Dart控制台示例
void main() async {
  final api = LotteryApiService(
    baseUrl: kApiBaseUrl,
    token: kApiToken,
  );
  
  try {
    // 获取重庆时时彩最新10期
    print('=== 重庆时时彩最新开奖 ===');
    final results = await api.getLatest(LotteryTypes.chongqingSSC, limit: 10);
    
    for (var i = 0; i < results.length; i++) {
      final result = results[i];
      print('${i + 1}. 期号: ${result.formattedExpect}, 号码: ${result.opencode}, 时间: ${result.opentime}');
    }
    
    // 获取广东11选5最新5期
    print('\n=== 广东11选5最新开奖 ===');
    final results2 = await api.getLatest(LotteryTypes.guangdong11x5, limit: 5);
    
    for (var i = 0; i < results2.length; i++) {
      final result = results2[i];
      print('${i + 1}. 期号: ${result.formattedExpect}, 号码: ${result.opencode}, 时间: ${result.opentime}');
    }
    
  } catch (e) {
    print('错误: $e');
  } finally {
    api.dispose();
  }
}

// ============== Flutter 页面示例 ==============

/*
// Flutter 页面示例代码 (lib/lottery_page.dart)

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LotteryPage extends StatefulWidget {
  @override
  _LotteryPageState createState() => _LotteryPageState();
}

class _LotteryPageState extends State<LotteryPage> {
  final LotteryApiService _api = LotteryApiService(
    baseUrl: kApiBaseUrl,
    token: kApiToken,
  );
  
  List<LotteryResult> _results = [];
  bool _loading = false;
  String? _error;
  String _selectedLottery = LotteryTypes.chongqingSSC;
  
  @override
  void initState() {
    super.initState();
    _fetchData();
  }
  
  Future<void> _fetchData() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    
    try {
      final results = await _api.getLatest(_selectedLottery, limit: 10);
      setState(() {
        _results = results;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('彩票开奖查询'),
      ),
      body: Column(
        children: [
          // 彩种选择器
          DropdownButton<String>(
            value: _selectedLottery,
            items: LotteryTypes.names.entries.map((e) => 
              DropdownMenuItem(value: e.key, child: Text(e.value))
            ).toList(),
            onChanged: (value) {
              if (value != null) {
                setState(() => _selectedLottery = value);
                _fetchData();
              }
            },
          ),
          
          // 结果列表
          Expanded(
            child: _loading
                ? Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(child: Text('错误: $_error'))
                    : ListView.builder(
                        itemCount: _results.length,
                        itemBuilder: (context, index) {
                          final result = _results[index];
                          return ListTile(
                            title: Text('期号: ${result.formattedExpect}'),
                            subtitle: Text('号码: ${result.opencode}'),
                            trailing: Text(result.opentime),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
  
  @override
  void dispose() {
    _api.dispose();
    super.dispose();
  }
}
*/
