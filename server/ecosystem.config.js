// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'real-estate',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
