import axios from 'axios'

// 1.第一种封装
// export function request(config, success, failure) {
//   // 创建axios的实例
//   const instance = axios.create({
//     baseURL: 'http://123.207.32.32:8000',
//     timeout: 5000
//   })

//   // 发送网络请求
//   instance(config).then(res => {
//     success(res)
//   }).catch(err => {
//     failure(err)
//   })
// }
// 2.第二种封装
// export function request(config) {
//   // 创建axios的实例
//   const instance = axios.create({
//     baseURL: 'http://123.207.32.32:8000',
//     timeout: 5000
//   })

//   // 发送网络请求
//   instance(config.baseConfig)
//     .then(res => {
//       config.success(res)
//     }).catch(err => {
//       config.failure(err)
//     })
// }

// 3.第三种封装
// export function request(config) {
//   return new Promise((resolve, reject) => {
//     // 创建axios的实例
//     const instance = axios.create({
//       baseURL: 'http://123.207.32.32:8000',
//       timeout: 5000
//     })

//     // 发送网络请求
//     instance(config)
//       .then(res => {
//         resolve(res)
//       }).catch(err => {
//         reject(err)
//       })
//   })
// }

// 4.第四种封装（最终方案）
export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/api',
    timeout: 50000
  })
  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    // 1.如果config中的headers等信息不符合服务器的要求时，可在这里修改
    // 2.每次发送网络请求时，显示的加载动画可在这里添加
    // 3.如果请求时需要携带token。可在这里添加
    // console.log(config);
    // 在拦截了请求之后，还得将拦截的config返回出去
    return config
  }, err => {
    console.log(err);
    return err
  })
  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    // 拦截了响应之后，还得把结果返回出去，这里只需返回data就好
    return res.data
  }, err => {
    console.log(err);
    return err
  })

  // 3.发送网络请求
  return instance(config)
}