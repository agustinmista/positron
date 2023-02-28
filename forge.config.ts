import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import type { ForgeConfig } from '@electron-forge/shared-types';

import type { ModuleOptions, Configuration } from 'webpack';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// ============================
// Webpack configuration
// ============================

// Module rules
const rules: Required<ModuleOptions>['rules'] = [
  {
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader'
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules'
      }
    },
    parser: {
      amd: false
    }
  },
  {
    test: /\.tsx?$/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    },
    exclude: /(node_modules|\.webpack)/
  },
  {
    test: /\.(png|jpg|jpeg|svg|jpeg|gif|ico)$/i,
    type: 'asset/resource'
  }
];

// Main Process
const mainConfig: Configuration = {
  entry: './src/main/index.ts',
  module: {
    rules
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};

// Renderer process
const rendererConfig: Configuration = {
  module: {
    rules: rules.concat({
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
      ]
    })
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      logger: 'webpack-infrastructure'
    })
  ]
};

// ============================
// Electron Forge configuration
// ============================

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    new MakerDeb({}),
    new MakerRpm({}),
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin'])
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig: mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [{
          name: 'main_window',
          preload: { js: './src/renderer/preload.ts' },
          html: './src/renderer/index.html',
          js: './src/renderer/index.ts'
        }]
      }
    })
  ]
};

export default config;
