// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");

const files = ["src", "config", "index.js", "package.json", "package-lock.json", "yarn.lock", "scripts", "protolint_custom_rules"];

const runChildProcess = ({ command, args = [], cwd, stdio, env = process.env } = {}) => {
  console.log([command, ...args].join(" "));
  const options = {
    cwd,
    stdio,
    env,
  };

  const child = spawn.sync(command, args, options);
  if (child.error) {
    throw child.error;
  }
  return child;
};

(async () => {
  const basePath = process.cwd();
  const output = path.join(basePath, "dist");

  files.forEach((f) => {
    const src = path.normalize(path.resolve(basePath, f));
    const target = path.normalize(path.resolve(output, f));
    if (fs.existsSync(src)) {
      console.log(target);
      fs.copySync(src, target);
    }
  });

  const env = process.env;

  const ret = runChildProcess({
    command: path.join(env.AMIGA_NPM_PATH || env.bamboo_npm_path_latest || "", "npm"),
    args: ["ci", "--only=production"],
    cwd: output,
    stdio: "inherit",
    env,
  });
  if (ret.status) {
    throw new Error("npm install failed");
  }
})();
