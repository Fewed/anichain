const presets = [
    [
      "@babel/env",
      {
        targets: {
          ie: "10"
        },
        useBuiltIns: "usage"
      }
    ]
  ],
  plugins = ["@babel/plugin-proposal-class-properties"];

module.exports = { presets, plugins };
