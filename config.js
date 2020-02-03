module.exports = {
  version: "7.5.0",
  note: '升级地址选择器插件',
  subDomain: "xmp", // 根据教程 https://www.yuque.com/apifm/doc/qr6l4m 查看你自己的 subDomain
  appid: "wxfd0f3b50b2bcb27e", // 您的小程序的appid，购物单功能需要使用
  shareProfile: '惊喜多多！实惠多多！', // 首页转发的时候话术
  kanjiaRequirePlayAd: true, // 是否必须要观看视频广告后才可以砍价
  goodsDetailSkuShowType: 0, // 0 为点击立即购买按钮后出现规格尺寸、数量的选择； 1为直接在商品详情页面显示规格尺寸、数量的选择，而不弹框 
  config: {
    env: env,
    "Abp-TenantId": 12,
    baseUrl: (() => {
      switch (env) {
        case "pro":
          return `https://ad.api.mqsocial.com/`;
        case "test":
          return ``;
        case "dev-intranet":
          return "http://192.168.123.201:10000/";
        case "dev":
          return "http://ad.api.test.mqsocial.com/";
        case "dev-gtp":
          return "http://ad.api.gtp.mqsocial.com/";
        case "local":
          return "http://192.168.123.107:21030/";
        default:
          console.warn(
            `警告:获取到的[env:${env}],不是配置正确的地址,默认返回正式环境API.`
          );
          return ``;
      }
    })(env),
    mockBaseUrl: "",
  }
}
const env = "dev";