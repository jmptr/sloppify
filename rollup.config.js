import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import external from "rollup-plugin-peer-deps-external";
import graphql from "@rollup/plugin-graphql";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        banner: "#! /usr/bin/env node",
      },
    ],
    plugins: [
      external(),
      resolve(),
      graphql(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
];
