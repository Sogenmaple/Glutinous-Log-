require('dotenv').config();

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
        PORT: process.env.PORT || 3001,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        JWT_SECRET: process.env.JWT_SECRET
      },
      error_file: '/tmp/tangyuan-server-error.log',
      out_file: '/tmp/tangyuan-server-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'tangyuan-frontend',
      script: 'npx',
      args: 'vite preview --port 3000 --host 0.0.0.0',
      cwd: '/root/tangyuan-games',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/tmp/tangyuan-frontend-error.log',
      out_file: '/tmp/tangyuan-frontend-out.log',
      merge_logs: true,
      time: true
    }
  ]
};
