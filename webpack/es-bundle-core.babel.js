/**
 * @prettier
 */

/** Dev Note: 
 * StatsWriterPlugin is disabled by default; uncomment to enable
 * when enabled, rebuilding the bundle will cause error for assetSizeLimit,
 * which we want to keep out of CI/CD
 * post build, cli command: npx webpack-bundle-analyzer <path>
 */

import { DuplicatesPlugin } from "inspectpack/plugin"
import { WebpackBundleSizeAnalyzerPlugin } from "webpack-bundle-size-analyzer"
import path from "path"
// import { StatsWriterPlugin } from "webpack-stats-plugin"

import configBuilder from "./_config-builder"

const projectBasePath = path.join(__dirname, "../")

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: false,
    emitWorkerAssets: true,
  },
  {
    mode: "production",

    entry: {
      "swagger-editor-es-bundle-core": [
        "./src/index.js",
      ],
      // "validator.worker": path.join(projectBasePath, "src", "plugins", "json-schema-validator", "validator.worker.js"),
    },

    output: {
      // globalObject: "this",
      // library: "SwaggerEditorBundle",
      // libraryTarget: "commonjs2",
      library: {
        type: "commonjs2",
        export: "default",
      },
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.join(projectBasePath, "src"),
            path.join(projectBasePath, "node_modules", "object-assign-deep"),
          ],
          loader: "babel-loader",
          options: {
            retainLines: true,
            cacheDirectory: true,
          },
        },
        {
          test: /\.(txt|yaml)$/,
          type: "asset/source",
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/inline",
        },
        {
          test: /\.worker\.js$/,
          use: [
            {
              loader: "worker-loader",
              options: {
                // inline: "fallback", // allow to inline as a Blob
                inline: "no-fallback", // usual prod, the other option
                esModule: false,
              },
            },
            "babel-loader",
          ],
        }
      ],
    },

    performance: {
      hints: "error",
      maxEntrypointSize: 1024000 * 3.25, // MB
      maxAssetSize: 1024000 * 3.25, // MB
    },

    plugins: [
      new DuplicatesPlugin({
        // emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // display full duplicates information? (Default: `false`)
        verbose: false,
      }),
      new WebpackBundleSizeAnalyzerPlugin("log.es-bundle-sizes.swagger-editor.txt"),
      // new StatsWriterPlugin({
      //   filename: path.join("log.es-bundle-stats.swagger-editor.json"),
      //   fields: null,
      // }),
    ]
  }
)

export default result
