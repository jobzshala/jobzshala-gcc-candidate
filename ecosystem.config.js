module.exports = {
  apps: [
    {
      name: "web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      interpreter: "node",
      cwd: __dirname,
    },
  ],
};
