module.exports = {
  apps: [
    {
      name: "operation-platform",
      script: "npm",
      args: "start",
      env: {
        PORT: 3006,
        NODE_ENV: "production",
        WORKER_ID: "1"
      },
      exec_mode: "cluster",
      instances: "1", // 使用最大可用的CPU核心数
      autorestart: true, // 在应用程序崩溃时自动重启
      watch: false, // 不监视文件更改
      max_memory_restart: "4G", // 当内存使用量超过1GB时重启应用程序
      log_date_format: "MM-DD HH:mm:ss.SSS",
      error_file: "/data/logs/pm2logs/operation-platform-err.log",
      out_file: "/data/logs/pm2logs/operation-platform-out.log",
    },
  ],
};
