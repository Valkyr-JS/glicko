import writeYamlFile from 'write-yaml-file'
import pluginSettings from "./plugin/settings.json" with { type: "json" }
import * as pkg from "./package.json" with { type: "json" };
import fs from 'fs';

const filename =  pkg.default.name + ".yml"

// Only import the entry file. If you there are multiple entrypoints, you'll
// need to list them all here. 
const jsFiles = [pkg.default.name + ".js"]
const cssFiles = [pkg.default.name + ".css"]

const json = {
  name: pkg.default.name,
  description: pkg.default.description,
  url: pkg.default.homepage,
  version: pkg.default.version,
  ui: {
    assets: { "/": "." },
    javascript: jsFiles,
    css: cssFiles
  },
  settings: Object.keys(pluginSettings).length ? pluginSettings : undefined
}

writeYamlFile('dist/' + filename, json).then(() => {
  console.log('Generated source file "' + filename + '".')
})