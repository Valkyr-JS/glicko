import copy from "rollup-plugin-copy";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from '@rollup/plugin-terser';
import typescript from "@rollup/plugin-typescript";
import * as pkg from "./package.json" with { type: "json" };

const pluginID = pkg.default.name;

// Replace require imports with Plugin API library references
const banner = `window.require = function(name) {
    switch (name) {
        case "@apollo/client":
            return window.PluginApi.libraries.Apollo
        case "@fortawesome/free-regular-svg-icons":
            return window.PluginApi.libraries.FontAwesomeRegular
        case "@fortawesome/free-solid-svg-icons":
            return window.PluginApi.libraries.FontAwesomeSolid
        case "mousetrap":
            return window.PluginApi.libraries.Mousetrap
        case "mousetrap-pause":
            return window.PluginApi.libraries.MousetrapPause
        case "react":
            return window.PluginApi.React
        case "react-bootstrap":
            return window.PluginApi.libraries.Bootstrap
        case "react-dom":
            return window.PluginApi.ReactDOM
        case "react-intl":
            return window.PluginApi.libraries.Intl
        case "react-router-dom":
            return window.PluginApi.libraries.ReactRouterDOM
        case "react-select":
            return window.PluginApi.libraries.ReactSelect
    }
}`;

export default {
  input: "plugin/main.tsx",
  output: {
    banner,
    file: "dist/" + pluginID + ".js",
    format: "cjs",
  },
  plugins: [
    copy({
      targets: [
        { src: "plugin/source.yml", dest: "dist", rename: pluginID + ".yml" },
      ],
    }),
    peerDepsExternal(),
    typescript({
        tsconfig: "./tsconfig.rollup.json"
    }),
    terser()
  ],
};
