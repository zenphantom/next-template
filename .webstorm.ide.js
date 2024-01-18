const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('/')   //这里的./是指@映射的路径，如果你设置的@不是指向的当前路径，需要修改该数值，并且需要是相对路径
    }
  }
}
