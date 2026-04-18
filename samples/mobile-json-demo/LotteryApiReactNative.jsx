/**
 * 彩票API React Native 示例
 * 
 * 使用 fetch API 解析 JSON 数据
 * 适用于 React Native、Expo、React Native CLI 项目
 * 
 * @author BYW Lottery SDK
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';

// ============== 常量配置 ==============

const API_BASE_URL = 'http://api.byw.bet:868/api';
const API_TOKEN = 'YOUR_TOKEN_HERE';

// 彩种类型定义
const LOTTERY_TYPES = {
  // 时时彩系列
  '1': { name: '黑龙江时时彩', type: 'ssc' },
  '2': { name: '内蒙古时时彩', type: 'ssc' },
  '3': { name: '天津时时彩', type: 'ssc' },
  '4': { name: '重庆时时彩', type: 'ssc' },
  '5': { name: '新疆时时彩', type: 'ssc' },
  
  // 11选5系列
  '59': { name: '广东11选5', type: '11x5' },
  '60': { name: '山东11选5', type: '11x5' },
  '55': { name: '江西11选5', type: '11x5' },
  '52': { name: '江苏11选5', type: '11x5' },
  
  // 快三系列
  '78': { name: '江苏快三', type: 'k3' },
  '85': { name: '安徽快三', type: 'k3' },
  '84': { name: '湖北快三', type: 'k3' },
  
  // PK10系列
  '8': { name: '北京赛车', type: 'pk10' },
  '112': { name: '幸运飞艇', type: 'pk10' },
  '102': { name: '168极速赛车', type: 'pk10' },
  
  // 幸运系列
  '115': { name: '澳洲幸运10', type: 'lucky' },
  '117': { name: '台湾宾果', type: 'lucky' },
  
  // 数字彩
  '21': { name: '福彩3D', type: 'digital' },
  '22': { name: '双色球', type: 'digital' },
  '24': { name: '大乐透', type: 'digital' },
  '25': { name: '排列三', type: 'digital' },
  '26': { name: '排列五', type: 'digital' },
};

// 常用彩种列表
const POPULAR_LOTTERIES = [
  { id: '4', name: '重庆时时彩' },
  { id: '59', name: '广东11选5' },
  { id: '8', name: '北京赛车' },
  { id: '78', name: '江苏快三' },
  { id: '85', name: '安徽快三' },
  { id: '112', name: '幸运飞艇' },
  { id: '21', name: '福彩3D' },
  { id: '22', name: '双色球' },
];

// ============== API 服务 ==============

/**
 * 彩票API服务
 */
class LotteryApiService {
  
  /**
   * 获取最新开奖数据
   * @param {string} lotteryId - 彩种ID
   * @param {number} limit - 返回数量
   * @returns {Promise<Array>} 开奖数据列表
   */
  static async getLatest(lotteryId, limit = 10) {
    const url = `${API_BASE_URL}?token=${API_TOKEN}&t=${lotteryId}&limit=${limit}&p=json`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.Data || [];
      
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }
  
  /**
   * 获取指定日期的开奖数据
   * @param {string} lotteryId - 彩种ID
   * @param {string} date - 日期 (yyyy-MM-dd)
   * @returns {Promise<Array>} 开奖数据列表
   */
  static async getByDate(lotteryId, date) {
    const url = `${API_BASE_URL}?token=${API_TOKEN}&t=${lotteryId}&date=${date}&p=json`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.Data || [];
      
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }
}

// ============== Hooks ==============

/**
 * 彩票数据 Hook
 */
function useLotteryData(lotteryId, limit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        const result = await LotteryApiService.getLatest(lotteryId, limit);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [lotteryId, limit]);
  
  const refresh = async () => {
    try {
      setLoading(true);
      const result = await LotteryApiService.getLatest(lotteryId, limit);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refresh };
}

// ============== 组件 ==============

/**
 * 彩种选择器
 */
function LotterySelector({ selected, onSelect }) {
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>选择彩种:</Text>
      <FlatList
        horizontal
        data={POPULAR_LOTTERIES}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.selectorItem,
              selected === item.id && styles.selectorItemActive
            ]}
            onPress={() => onSelect(item.id)}
          >
            <Text style={[
              styles.selectorItemText,
              selected === item.id && styles.selectorItemTextActive
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/**
 * 开奖结果项
 */
function ResultItem({ item, index }) {
  // 格式化期号 (20260418001 -> 20260418-001)
  const formatExpect = (expect) => {
    if (!expect || expect.length < 11) return expect;
    return `${expect.slice(0, 8)}-${expect.slice(-3)}`;
  };
  
  // 格式化号码
  const formatOpencode = (opencode) => {
    return opencode ? opencode.split(',').join(' ') : '';
  };
  
  return (
    <View style={styles.resultItem}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultIndex}>#{index + 1}</Text>
        <Text style={styles.resultExpect}>{formatExpect(item.Expect)}</Text>
      </View>
      <View style={styles.resultBody}>
        <Text style={styles.resultOpencode}>{formatOpencode(item.Opencode)}</Text>
      </View>
      <Text style={styles.resultTime}>{item.Opentime}</Text>
    </View>
  );
}

/**
 * 主页面组件
 */
function LotteryApp() {
  const [selectedLottery, setSelectedLottery] = useState('4'); // 默认重庆时时彩
  const { data, loading, error, refresh } = useLotteryData(selectedLottery, 10);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>彩票开奖查询</Text>
        <Text style={styles.subtitle}>BYW Lottery API Demo</Text>
      </View>
      
      {/* 彩种选择 */}
      <LotterySelector
        selected={selectedLottery}
        onSelect={setSelectedLottery}
      />
      
      {/* 结果列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>加载失败: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.Expect}-${index}`}
          renderItem={({ item, index }) => <ResultItem item={item} index={index} />}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={refresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无数据</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// ============== 样式 ==============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  selectorContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  selectorItemActive: {
    backgroundColor: '#667eea',
  },
  selectorItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectorItemTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIndex: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  resultExpect: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  resultBody: {
    marginVertical: 8,
  },
  resultOpencode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    letterSpacing: 4,
  },
  resultTime: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#f56c6c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default LotteryApp;
