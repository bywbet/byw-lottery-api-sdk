/**
 * 彩票API iOS/Swift 示例
 * 
 * 使用 URLSession + JSONDecoder 解析 JSON 数据
 * 
 * @author BYW Lottery SDK
 * @version 1.0.0
 */

import Foundation

// MARK: - 数据模型

/// 彩票开奖结果
struct LotteryResult: Codable {
    let expect: String    // 开奖期号
    let opencode: String  // 开奖号码
    let opentime: String  // 开奖时间
    
    /// 格式化期号 (20260418001 -> 20260418-001)
    var formattedExpect: String {
        guard expect.count >= 11 else { return expect }
        let datePart = String(expect.prefix(8))
        let numberPart = String(expect.suffix(3))
        return "\(datePart)-\(numberPart)"
    }
    
    /// 格式化开奖号码 (返回数组)
    var opencodeArray: [String] {
        return opencode.split(separator: ",").map { String($0) }
    }
}

/// API响应
struct LotteryResponse: Codable {
    let rows: Int
    let data: [LotteryResult]
}

// MARK: - API错误

enum LotteryApiError: Error, LocalizedError {
    case invalidURL
    case networkError(Error)
    case invalidResponse
    case decodingError(Error)
    case apiError(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "无效的URL地址"
        case .networkError(let error):
            return "网络错误: \(error.localizedDescription)"
        case .invalidResponse:
            return "无效的服务器响应"
        case .decodingError(let error):
            return "数据解析错误: \(error.localizedDescription)"
        case .apiError(let message):
            return "API错误: \(message)"
        }
    }
}

// MARK: - API服务

class LotteryApiService {
    
    // MARK: - 属性
    
    private let baseURL: String
    private let token: String
    private let session: URLSession
    
    // MARK: - 初始化
    
    init(baseURL: String = "http://api.byw.bet:868/api", token: String) {
        self.baseURL = baseURL
        self.token = token
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 10
        configuration.timeoutIntervalForResource = 30
        self.session = URLSession(configuration: configuration)
    }
    
    // MARK: - 公开方法
    
    /// 获取最新开奖数据
    /// - Parameters:
    ///   - lotteryId: 彩种ID (如: "4" = 重庆时时彩)
    ///   - limit: 返回数量
    ///   - completion: 回调
    func getLatest(
        lotteryId: String,
        limit: Int = 10,
        completion: @escaping (Result<[LotteryResult], LotteryApiError>) -> Void
    ) {
        let urlString = "\(baseURL)?token=\(token)&t=\(lotteryId)&limit=\(limit)&p=json"
        
        guard let url = URL(string: urlString) else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        let task = session.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(.networkError(error)))
                return
            }
            
            guard let data = data else {
                completion(.failure(.invalidResponse))
                return
            }
            
            do {
                let decoder = JSONDecoder()
                let response = try decoder.decode(LotteryResponse.self, from: data)
                completion(.success(response.data))
            } catch {
                completion(.failure(.decodingError(error)))
            }
        }
        
        task.resume()
    }
    
    /// 获取指定日期的开奖数据
    /// - Parameters:
    ///   - lotteryId: 彩种ID
    ///   - date: 日期 (格式: yyyy-MM-dd)
    ///   - completion: 回调
    func getByDate(
        lotteryId: String,
        date: String,
        completion: @escaping (Result<[LotteryResult], LotteryApiError>) -> Void
    ) {
        let urlString = "\(baseURL)?token=\(token)&t=\(lotteryId)&date=\(date)&p=json"
        
        guard let url = URL(string: urlString) else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        let task = session.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(.networkError(error)))
                return
            }
            
            guard let data = data else {
                completion(.failure(.invalidResponse))
                return
            }
            
            do {
                let decoder = JSONDecoder()
                let response = try decoder.decode(LotteryResponse.self, from: data)
                completion(.success(response.data))
            } catch {
                completion(.failure(.decodingError(error)))
            }
        }
        
        task.resume()
    }
    
    /// 异步获取最新开奖数据 (Swift 5.5+)
    @available(iOS 13.0, macOS 10.15, *)
    func getLatestAsync(lotteryId: String, limit: Int = 10) async throws -> [LotteryResult] {
        return try await withCheckedThrowingContinuation { continuation in
            getLatest(lotteryId: lotteryId, limit: limit) { result in
                switch result {
                case .success(let data):
                    continuation.resume(returning: data)
                case .failure(let error):
                    continuation.resume(throwing: error)
                }
            }
        }
    }
}

// MARK: - 彩种常量

struct LotteryTypes {
    // 时时彩系列
    static let heilongjiangSSC = "1"   // 黑龙江时时彩
    static let neimengguSSC = "2"       // 内蒙古时时彩
    static let tianjinSSC = "3"          // 天津时时彩
    static let chongqingSSC = "4"        // 重庆时时彩
    static let xinjiangSSC = "5"        // 新疆时时彩
    
    // 11选5系列
    static let guangdong11x5 = "59"     // 广东11选5
    static let shandong11x5 = "60"      // 山东11选5
    static let jiangxi11x5 = "55"       // 江西11选5
    static let jiangsu11x5 = "52"       // 江苏11选5
    
    // 快三系列
    static let jiangsuK3 = "78"         // 江苏快三
    static let anhuiK3 = "85"           // 安徽快三
    static let hubeiK3 = "84"           // 湖北快三
    
    // PK10系列
    static let beijingPK10 = "8"        // 北京赛车
    static let luckyFlying = "112"      // 幸运飞艇
    static let speedRacing = "102"      // 168极速赛车
    
    // 幸运系列
    static let australiaLucky10 = "115" // 澳洲幸运10
    static let taiwanBingo = "117"      // 台湾宾果
    
    // 数字彩
    static let fucai3D = "21"           // 福彩3D
    static let shuangseqiu = "22"       // 双色球
    static let daletou = "24"           // 大乐透
    static let pailie3 = "25"           // 排列三
    static let pailie5 = "26"           // 排列五
    
    /// 彩种名称映射
    static let names: [String: String] = [
        "1": "黑龙江时时彩",
        "2": "内蒙古时时彩",
        "3": "天津时时彩",
        "4": "重庆时时彩",
        "5": "新疆时时彩",
        "59": "广东11选5",
        "60": "山东11选5",
        "78": "江苏快三",
        "85": "安徽快三",
        "8": "北京赛车",
        "112": "幸运飞艇",
        "21": "福彩3D",
        "22": "双色球",
        "24": "大乐透"
    ]
}

// MARK: - 使用示例

#if DEBUG
func demo() {
    let api = LotteryApiService(token: "YOUR_TOKEN_HERE")
    
    // 获取重庆时时彩最新10期
    print("=== 重庆时时彩最新开奖 ===")
    api.getLatest(lotteryId: LotteryTypes.chongqingSSC, limit: 10) { result in
        switch result {
        case .success(let data):
            for (index, item) in data.enumerated() {
                print("\(index + 1). 期号: \(item.formattedExpect), 号码: \(item.opencode), 时间: \(item.opentime)")
            }
        case .failure(let error):
            print("错误: \(error.localizedDescription)")
        }
    }
    
    // iOS 13+ 使用 async/await
    if #available(iOS 13.0, *) {
        Task {
            do {
                let results = try await api.getLatestAsync(lotteryId: LotteryTypes.guangdong11x5, limit: 5)
                print("\n=== 广东11选5最新开奖 ===")
                for (index, item) in results.enumerated() {
                    print("\(index + 1). 期号: \(item.formattedExpect), 号码: \(item.opencode), 时间: \(item.opentime)")
                }
            } catch {
                print("错误: \(error.localizedDescription)")
            }
        }
    }
}
#endif
