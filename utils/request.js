import {
  config
} from "../config";

/**
 * (global) 请求工具类
 *
 * @author Halo 2018-12-27 17:12:57
 * > 调用方式
 * import { request } from "../request";
 *
 * //简写
 * req.post(req.apis.{api url name},{data...}).then((res)=>{
 *  //success callback
 * });
 *
 * //捕获异常
 * req.post(req.apis.{api url name},{data...}).then((res)=>{
 *  //success callback
 * }).catch((res)=>{
 *  //catch callback
 * });
 *
 * //多调用链
 * req.post(req.apis.{api url name},{data...}).then((res)=>{
 *  //success callback
 * }).then((res)=>{...})...;
 *
 *
 * Method:
 * > get
 * > post
 * > put
 * > del
 */
class Request {
  constructor() {
    // check is weex
    if (wx) {
      // 执行 初始化方法
      this.init();
    }
  }

  /**
   * 公共接口
   */
  apis() {
    /**
     * api接口格式
     *
     * left(接口名):right(接口地址)
     *
     * 接口名全大写,单词间使用 ' _ ' 下划线做分隔
     *
     * 接口地址: 可以用 ./apiUrl 形式代替,会在请求前调用补全链接方法 补全 https://  和 接口全路径
     *
     */
    return {
      DEMO_API: "./api_url"
    };
  }

  /**
   * 初始化
   */
  init() {
    // 初始化header
    this._header = {
      "content-type": "application/json",
      "Abp-TenantId": config["Abp-TenantId"]
    };
    /**
     *
     */
    this.Methods = {
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      DELETE: "DELETE"
    };
    /**
     *
     */
    this.baseUrl = config.baseUrl;
    /**
     * 错误统一处理
     */
    this._errorHandler = (res, url) => {
      const formatTime = (date) => {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var formatNumber = (n) => {
          n = n.toString();
          return n[1] ? n : `0${n}`;
        };
        return (
          `${[year, month, day].map(formatNumber).join("-")}  ${[hour, minute, second].map(formatNumber).join(":")}`
        );
      };
      /**
       * 输出错误信息
       */
      console.error(`${url} Request Error:${formatTime(new Date())}\r\n`, res);
    };
  }

  /**
   * 补全url.
   * 当采用简写形式的url时,自助补全.
   */
  completionUrl(url, isMock) {
    if (isMock) {
      url = config.mockBaseUrl + url.substring(2, url.length);
    } else {
      switch (true) {
        case url.indexOf("./") > -1:
          // 执行替换baseUrl 操作
          url = this.baseUrl + url.substring(2, url.length);
          break;
        case url.indexOf("http") > -1 &&
        url.indexOf("https") < 0 &&
        config.env === "pro":
          // 补充 http|https
          url = url.replace("http", "https");
          break;
        default:
          break;
      }
    }
    return url;
  }

  /**
   * 网络请求
   */
  requestAll(url, params, header, method) {
    const that = this;
    // 补全url
    return new Promise((resolve, reject) => {
      url = that.completionUrl(url, params.mock);
      console.log("request url:", url, "params:", params);
      wx.request({
        url: url,
        data: params,
        header: header,
        method: method,
        success: (res) => {
          if (params.assets) {
            resolve(res);
          } else if (res.statusCode === 200) {
            console.log(`${url} response:`, res);
            // 200: 服务端业务处理正常结束
            if (
              Object.keys(res.data).length > 0 &&
              ((res.data.result && !res.data.result.isError) ||
                !res.data.isError || !res.data.success)
            ) {
              resolve(res);
            } else {
              reject(
                res.data.result && res.data.result.errorMessage ?
                res :
                Object.assign(res, {
                  data: {
                    result: {
                      errorMessage: "请求失败,出了点小问题。"
                    }
                  }
                })
              );
            }
          } else {
            // 其它错误，提示用户错误信息
            if (this._errorHandler != null) {
              // 如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
              this._errorHandler(res, url);
            }
            reject(res);
          }
        },
        fail: (res) => {
          if (this._errorHandler != null) {
            this._errorHandler(res);
          }
          reject(res);
        }
      });
    });
  }

  /**
   * GET类型的网络请求
   */
  get(url, data, header = this._header) {
    return this.requestAll(url, data, header, this.Methods.GET);
  }

  /**
   * DELETE类型的网络请求
   * 使用del简写代替,因为 delete 是关键字.
   */
  del(url, data, header = this._header) {
    return this.requestAll(url, data, header, this.Methods.DELETE);
  }

  /**
   * PUT类型的网络请求
   */
  put(url, data, header = this._header) {
    return this.requestAll(url, data, header, this.Methods.PUT);
  }

  /**
   * POST类型的网络请求
   */
  post(url, data, header = this._header) {
    return this.requestAll(url, data, header, this.Methods.POST);
  }
}
const _request = new Request();
/**
 * 导出模块
 */
module.exports = {
  request: _request
};