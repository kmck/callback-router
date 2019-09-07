import fs from 'fs';
import path from 'path';

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

const PACKAGES_DIRECTORY = 'packages';
const PACKAGE_ENTRY = 'src/index.ts';
const PACKAGES_PATH = path.join(__dirname, PACKAGES_DIRECTORY);

const configs = [];

// Building all packages in the monorepo
const pkgNames = fs.readdirSync(path.join(__dirname, PACKAGES_DIRECTORY));
const REGEX_REACT_HOOK_PKG = /^(react-)?use-/i;
pkgNames.sort((pkgNameA, pkgNameB) => {
  // Build callback-router first
  if (pkgNameA === 'callback-router') {
    return -1;
  } else if (pkgNameB === 'callback-router') {
    return 1;
  }
  // Build examples last
  if (pkgNameA === 'examples') {
    return 1;
  } else if (pkgNameB === 'examples') {
    return -1;
  }
  // Build React Hooks packages last
  const isReactHookA = REGEX_REACT_HOOK_PKG.test(pkgNameA);
  const isReactHookB = REGEX_REACT_HOOK_PKG.test(pkgNameB);
  if (!isReactHookA && isReactHookB) {
    return -1;
  }
  if (isReactHookA && !isReactHookB) {
    return 1;
  }
  return 0;
});

pkgNames.forEach((pkgName) => {
  const pkgPath = path.join(PACKAGES_DIRECTORY, pkgName);
  /* eslint-disable global-require, import/no-dynamic-require */
  const pkgJsonPath = path.join(PACKAGES_PATH, pkgName, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = require(pkgJsonPath);
    const output = [];
    if (pkg.main) {
      output.push({ file: path.join(pkgPath, pkg.main), format: 'cjs' });
    }
    if (pkg.module) {
      output.push({ file: path.join(pkgPath, pkg.module), format: 'es' });
    }
    if (output.length) {
      configs.push({
        input: path.join(pkgPath, PACKAGE_ENTRY),
        output,
        plugins: [
          external({
            packageJsonPath: pkgJsonPath,
            includeDependencies: true,
          }),
          resolve(),
          typescript({
            clean: true,
            rollupCommonJSResolveHack: true,
            tsconfigOverride: {
              compilerOptions: {
                noEmit: true,
              },
              include: [
                path.join(pkgPath, 'src/**/*'),
              ],
            },
          }),
          commonjs({
            namedExports: {
              'node_modules/react/index.js': [
                'useCallback',
                'useLayoutEffect',
                'useRef',
                'useState',
              ],
            },
          }),
        ],
      });
    }
  }
  /* eslint-enable global-require, import/no-dynamic-require */
}, []);

export default configs;
