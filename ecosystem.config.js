module.exports = {
  apps: [{
    name: "UNIZAN-CORE",
    script: "./dist/runtime/bootstrap.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "500M",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    merge_logs: true,
    time: true
  }]
};
