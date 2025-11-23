// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'realtor-manager',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
