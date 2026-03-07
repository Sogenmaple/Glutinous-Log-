module.exports = {
  apps: [
    {
      name: 'tangyuan-server',
      script: './server/index.js',
      cwd: '/root/tangyuan-games',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      error_file: '/tmp/tangyuan-server-error.log',
      out_file: '/tmp/tangyuan-server-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'tangyuan-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/root/tangyuan-games',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: '/tmp/tangyuan-frontend-error.log',
      out_file: '/tmp/tangyuan-frontend-out.log',
      merge_logs: true,
      time: true
    }
  ]
};
