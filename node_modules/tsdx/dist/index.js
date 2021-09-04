#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sade_1 = tslib_1.__importDefault(require("sade"));
const sync_1 = tslib_1.__importDefault(require("tiny-glob/sync"));
const rollup_1 = require("rollup");
const asyncro_1 = tslib_1.__importDefault(require("asyncro"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const util_1 = tslib_1.__importDefault(require("util"));
const fs = tslib_1.__importStar(require("fs-extra"));
const jest_1 = tslib_1.__importDefault(require("jest"));
const eslint_1 = require("eslint");
const logError_1 = tslib_1.__importDefault(require("./logError"));
const path_1 = tslib_1.__importDefault(require("path"));
const mkdirp_1 = tslib_1.__importDefault(require("mkdirp"));
const rimraf_1 = tslib_1.__importDefault(require("rimraf"));
const execa_1 = tslib_1.__importDefault(require("execa"));
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const constants_1 = require("./constants");
const Messages = tslib_1.__importStar(require("./messages"));
const createRollupConfig_1 = require("./createRollupConfig");
const createJestConfig_1 = require("./createJestConfig");
const createEslintConfig_1 = require("./createEslintConfig");
const utils_1 = require("./utils");
const jpjs_1 = require("jpjs");
const getInstallCmd_1 = tslib_1.__importDefault(require("./getInstallCmd"));
const getInstallArgs_1 = tslib_1.__importDefault(require("./getInstallArgs"));
const enquirer_1 = require("enquirer");
const createProgressEstimator_1 = require("./createProgressEstimator");
const pkg = require('../package.json');
const prog = sade_1.default('tsdx');
let appPackageJson;
try {
    appPackageJson = fs.readJSONSync(utils_1.resolveApp('package.json'));
}
catch (e) { }
// check for custom tsdx.config.js
let tsdxConfig = {
    rollup(config, _options) {
        return config;
    },
};
if (fs.existsSync(constants_1.paths.appConfig)) {
    tsdxConfig = require(constants_1.paths.appConfig);
}
exports.isDir = (name) => fs
    .stat(name)
    .then(stats => stats.isDirectory())
    .catch(() => false);
exports.isFile = (name) => fs
    .stat(name)
    .then(stats => stats.isFile())
    .catch(() => false);
async function jsOrTs(filename) {
    const extension = (await exports.isFile(utils_1.resolveApp(filename + '.ts')))
        ? '.ts'
        : (await exports.isFile(utils_1.resolveApp(filename + '.tsx')))
            ? '.tsx'
            : '.js';
    return utils_1.resolveApp(`${filename}${extension}`);
}
async function getInputs(entries, source) {
    let inputs = [];
    let stub = [];
    stub
        .concat(entries && entries.length
        ? entries
        : (source && utils_1.resolveApp(source)) ||
            ((await exports.isDir(utils_1.resolveApp('src'))) && (await jsOrTs('src/index'))))
        .map(file => sync_1.default(file))
        .forEach(input => inputs.push(input));
    return jpjs_1.concatAllArray(inputs);
}
function createBuildConfigs(opts) {
    return jpjs_1.concatAllArray(opts.input.map((input) => [
        opts.format.includes('cjs') && Object.assign(Object.assign({}, opts), { format: 'cjs', env: 'development', input }),
        opts.format.includes('cjs') && Object.assign(Object.assign({}, opts), { format: 'cjs', env: 'production', input }),
        opts.format.includes('esm') && Object.assign(Object.assign({}, opts), { format: 'esm', input }),
        opts.format.includes('umd') && Object.assign(Object.assign({}, opts), { format: 'umd', env: 'development', input }),
        opts.format.includes('umd') && Object.assign(Object.assign({}, opts), { format: 'umd', env: 'production', input }),
        opts.format.includes('system') && Object.assign(Object.assign({}, opts), { format: 'system', env: 'development', input }),
        opts.format.includes('system') && Object.assign(Object.assign({}, opts), { format: 'system', env: 'production', input }),
    ]
        .filter(Boolean)
        .map((options, index) => (Object.assign(Object.assign({}, options), { 
        // We want to know if this is the first run for each entryfile
        // for certain plugins (e.g. css)
        writeMeta: index === 0 }))))).map((options) => 
    // pass the full rollup config to tsdx.config.js override
    tsdxConfig.rollup(createRollupConfig_1.createRollupConfig(options), options));
}
async function moveTypes() {
    try {
        // Move the typescript types to the base of the ./dist folder
        await fs.copy(constants_1.paths.appDist + '/src', constants_1.paths.appDist, {
            overwrite: true,
        });
        await fs.remove(constants_1.paths.appDist + '/src');
    }
    catch (e) { }
}
prog
    .version(pkg.version)
    .command('create <pkg>')
    .describe('Create a new package with TSDX')
    .example('create mypackage')
    .option('--template', 'Specify a template. Allowed choices: [basic, react]')
    .example('create --template react mypackage')
    .action(async (pkg, opts) => {
    console.log(chalk_1.default.blue(`
::::::::::: ::::::::  :::::::::  :::    :::
    :+:    :+:    :+: :+:    :+: :+:    :+:
    +:+    +:+        +:+    +:+  +:+  +:+
    +#+    +#++:++#++ +#+    +:+   +#++:+
    +#+           +#+ +#+    +#+  +#+  +#+
    #+#    #+#    #+# #+#    #+# #+#    #+#
    ###     ########  #########  ###    ###
`));
    const bootSpinner = ora_1.default(`Creating ${chalk_1.default.bold.green(pkg)}...`);
    let template;
    // Helper fn to prompt the user for a different
    // folder name if one already exists
    async function getProjectPath(projectPath) {
        if (fs.existsSync(projectPath)) {
            bootSpinner.fail(`Failed to create ${chalk_1.default.bold.red(pkg)}`);
            const prompt = new enquirer_1.Input({
                message: `A folder named ${chalk_1.default.bold.red(pkg)} already exists! ${chalk_1.default.bold('Choose a different name')}`,
                initial: pkg + '-1',
                result: (v) => v.trim(),
            });
            pkg = await prompt.run();
            projectPath = fs.realpathSync(process.cwd()) + '/' + pkg;
            bootSpinner.start(`Creating ${chalk_1.default.bold.green(pkg)}...`);
            return getProjectPath(projectPath); // recursion!
        }
        else {
            return projectPath;
        }
    }
    try {
        // get the project path
        let projectPath = await getProjectPath(fs.realpathSync(process.cwd()) + '/' + pkg);
        const prompt = new enquirer_1.Select({
            message: 'Choose a template',
            choices: ['basic', 'react'],
        });
        if (opts.template) {
            template = opts.template.trim();
            if (!prompt.choices.includes(template)) {
                bootSpinner.fail(`Invalid template ${chalk_1.default.bold.red(template)}`);
                template = await prompt.run();
            }
        }
        else {
            template = await prompt.run();
        }
        bootSpinner.start();
        // copy the template
        await fs.copy(path_1.default.resolve(__dirname, `../templates/${template}`), projectPath, {
            overwrite: true,
        });
        // fix gitignore
        await fs.move(path_1.default.resolve(projectPath, './gitignore'), path_1.default.resolve(projectPath, './.gitignore'));
        // update license year and author
        let license = fs.readFileSync(path_1.default.resolve(projectPath, 'LICENSE'), 'utf-8');
        license = license.replace(/<year>/, `${new Date().getFullYear()}`);
        // attempt to automatically derive author name
        let author = getAuthorName();
        if (!author) {
            bootSpinner.stop();
            const licenseInput = new enquirer_1.Input({
                name: 'author',
                message: 'Who is the package author?',
            });
            author = await licenseInput.run();
            setAuthorName(author);
            bootSpinner.start();
        }
        license = license.replace(/<author>/, author.trim());
        fs.writeFileSync(path_1.default.resolve(projectPath, 'LICENSE'), license, {
            encoding: 'utf-8',
        });
        // Install deps
        process.chdir(projectPath);
        const safeName = utils_1.safePackageName(pkg);
        const pkgJson = {
            name: safeName,
            version: '0.1.0',
            license: 'MIT',
            author: author,
            main: 'dist/index.js',
            module: `dist/${safeName}.esm.js`,
            typings: `dist/index.d.ts`,
            files: ['dist'],
            scripts: {
                start: 'tsdx watch',
                build: 'tsdx build',
                test: template === 'react' ? 'tsdx test --env=jsdom' : 'tsdx test',
                lint: 'tsdx lint',
            },
            peerDependencies: template === 'react' ? { react: '>=16' } : {},
            husky: {
                hooks: {
                    'pre-commit': 'tsdx lint',
                },
            },
            prettier: {
                printWidth: 80,
                semi: true,
                singleQuote: true,
                trailingComma: 'es5',
            },
        };
        await fs.outputJSON(path_1.default.resolve(projectPath, 'package.json'), pkgJson);
        bootSpinner.succeed(`Created ${chalk_1.default.bold.green(pkg)}`);
        Messages.start(pkg);
    }
    catch (error) {
        bootSpinner.fail(`Failed to create ${chalk_1.default.bold.red(pkg)}`);
        logError_1.default(error);
        process.exit(1);
    }
    let deps = ['@types/jest', 'husky', 'tsdx', 'tslib', 'typescript'].sort();
    if (template === 'react') {
        deps = [
            ...deps,
            '@types/react',
            '@types/react-dom',
            'react',
            'react-dom',
        ].sort();
    }
    const installSpinner = ora_1.default(Messages.installing(deps)).start();
    try {
        const cmd = getInstallCmd_1.default();
        await execa_1.default(cmd, getInstallArgs_1.default(cmd, deps));
        installSpinner.succeed('Installed dependencies');
        console.log(Messages.start(pkg));
    }
    catch (error) {
        installSpinner.fail('Failed to install dependencies');
        logError_1.default(error);
        process.exit(1);
    }
});
prog
    .command('watch')
    .describe('Rebuilds on any change')
    .option('--entry, -i', 'Entry module(s)')
    .example('watch --entry src/foo.tsx')
    .option('--target', 'Specify your target environment', 'web')
    .example('watch --target node')
    .option('--name', 'Specify name exposed in UMD builds')
    .example('watch --name Foo')
    .option('--format', 'Specify module format(s)', 'cjs,esm')
    .example('watch --format cjs,esm')
    .option('--verbose', 'Keep outdated console output in watch mode instead of clearing the screen')
    .example('watch --verbose')
    .option('--noClean', "Don't clean the dist folder")
    .example('watch --noClean')
    .option('--tsconfig', 'Specify custom tsconfig path')
    .example('watch --tsconfig ./tsconfig.foo.json')
    .option('--extractErrors', 'Extract invariant errors to ./errors/codes.json.')
    .example('build --extractErrors')
    .action(async (dirtyOpts) => {
    const opts = await normalizeOpts(dirtyOpts);
    const buildConfigs = createBuildConfigs(opts);
    if (!opts.noClean) {
        await cleanDistFolder();
    }
    await ensureDistFolder();
    if (opts.format.includes('cjs')) {
        await writeCjsEntryFile(opts.name);
    }
    const spinner = ora_1.default().start();
    await rollup_1.watch(buildConfigs.map(inputOptions => (Object.assign({ watch: {
            silent: true,
            include: ['src/**'],
            exclude: ['node_modules/**'],
        } }, inputOptions)))).on('event', async (event) => {
        if (event.code === 'START') {
            if (!opts.verbose) {
                utils_1.clearConsole();
            }
            spinner.start(chalk_1.default.bold.cyan('Compiling modules...'));
        }
        if (event.code === 'ERROR') {
            spinner.fail(chalk_1.default.bold.red('Failed to compile'));
            logError_1.default(event.error);
        }
        if (event.code === 'FATAL') {
            spinner.fail(chalk_1.default.bold.red('Failed to compile'));
            logError_1.default(event.error);
        }
        if (event.code === 'END') {
            spinner.succeed(chalk_1.default.bold.green('Compiled successfully'));
            console.log(`
  ${chalk_1.default.dim('Watching for changes')}
`);
            try {
                await moveTypes();
            }
            catch (_error) { }
        }
    });
});
prog
    .command('build')
    .describe('Build your project once and exit')
    .option('--entry, -i', 'Entry module(s)')
    .example('build --entry src/foo.tsx')
    .option('--target', 'Specify your target environment', 'web')
    .example('build --target node')
    .option('--name', 'Specify name exposed in UMD builds')
    .example('build --name Foo')
    .option('--format', 'Specify module format(s)', 'cjs,esm')
    .example('build --format cjs,esm')
    .option('--tsconfig', 'Specify custom tsconfig path')
    .example('build --tsconfig ./tsconfig.foo.json')
    .option('--extractErrors', 'Extract errors to ./errors/codes.json and provide a url for decoding.')
    .example('build --extractErrors=https://reactjs.org/docs/error-decoder.html?invariant=')
    .action(async (dirtyOpts) => {
    const opts = await normalizeOpts(dirtyOpts);
    const buildConfigs = createBuildConfigs(opts);
    await cleanDistFolder();
    await ensureDistFolder();
    const logger = await createProgressEstimator_1.createProgressEstimator();
    if (opts.format.includes('cjs')) {
        const promise = writeCjsEntryFile(opts.name).catch(logError_1.default);
        logger(promise, 'Creating entry file');
    }
    try {
        const promise = asyncro_1.default
            .map(buildConfigs, async (inputOptions) => {
            let bundle = await rollup_1.rollup(inputOptions);
            await bundle.write(inputOptions.output);
            await moveTypes();
        })
            .catch((e) => {
            throw e;
        });
        logger(promise, 'Building modules');
        await promise;
    }
    catch (error) {
        logError_1.default(error);
        process.exit(1);
    }
});
async function normalizeOpts(opts) {
    return Object.assign(Object.assign({}, opts), { name: opts.name || appPackageJson.name, input: await getInputs(opts.entry, appPackageJson.source), format: opts.format.split(',').map((format) => {
            if (format === 'es') {
                return 'esm';
            }
            return format;
        }) });
}
function ensureDistFolder() {
    return util_1.default.promisify(mkdirp_1.default)(constants_1.paths.appDist);
}
function cleanDistFolder() {
    if (fs.existsSync(constants_1.paths.appDist)) {
        return util_1.default.promisify(rimraf_1.default)(constants_1.paths.appDist);
    }
}
function writeCjsEntryFile(name) {
    const baseLine = `module.exports = require('./${utils_1.safePackageName(name)}`;
    const contents = `
'use strict'

if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.production.min.js')
} else {
  ${baseLine}.cjs.development.js')
}
`;
    return fs.writeFile(path_1.default.join(constants_1.paths.appDist, 'index.js'), contents);
}
function getAuthorName() {
    let author = '';
    author = shelljs_1.default
        .exec('npm config get init-author-name', { silent: true })
        .stdout.trim();
    if (author)
        return author;
    author = shelljs_1.default
        .exec('git config --global user.name', { silent: true })
        .stdout.trim();
    if (author) {
        setAuthorName(author);
        return author;
    }
    author = shelljs_1.default
        .exec('npm config get init-author-email', { silent: true })
        .stdout.trim();
    if (author)
        return author;
    author = shelljs_1.default
        .exec('git config --global user.email', { silent: true })
        .stdout.trim();
    if (author)
        return author;
    return author;
}
function setAuthorName(author) {
    shelljs_1.default.exec(`npm config set init-author-name "${author}"`, { silent: true });
}
prog
    .command('test')
    .describe('Run jest test runner in watch mode. Passes through all flags directly to Jest')
    .action(async () => {
    // Do this as the first thing so that any code reading it knows the right env.
    process.env.BABEL_ENV = 'test';
    process.env.NODE_ENV = 'test';
    // Makes the script crash on unhandled rejections instead of silently
    // ignoring them. In the future, promise rejections that are not handled will
    // terminate the Node.js process with a non-zero exit code.
    process.on('unhandledRejection', err => {
        throw err;
    });
    const argv = process.argv.slice(2);
    let jestConfig = Object.assign(Object.assign({}, createJestConfig_1.createJestConfig(relativePath => path_1.default.resolve(__dirname, '..', relativePath), constants_1.paths.appRoot)), appPackageJson.jest);
    try {
        // Allow overriding with jest.config
        const jestConfigContents = require(constants_1.paths.jestConfig);
        jestConfig = Object.assign(Object.assign({}, jestConfig), jestConfigContents);
    }
    catch (_a) { }
    argv.push('--config', JSON.stringify(Object.assign({}, jestConfig)));
    const [, ...argsToPassToJestCli] = argv;
    jest_1.default.run(argsToPassToJestCli);
});
prog
    .command('lint')
    .describe('Run eslint with Prettier')
    .example('lint src test')
    .option('--fix', 'Fixes fixable errors and warnings')
    .example('lint src test --fix')
    .option('--ignore-pattern', 'Ignore a pattern')
    .example('lint src test --ignore-pattern test/foobar.ts')
    .option('--write-file', 'Write the config file locally')
    .example('lint --write-file')
    .option('--report-file', 'Write JSON report to file locally')
    .example('lint --report-file eslint-report.json')
    .action((opts) => {
    if (opts['_'].length === 0 && !opts['write-file']) {
        const defaultInputs = ['src', 'test'];
        opts['_'] = defaultInputs;
        console.log(chalk_1.default.yellow(`No input files specified, defaulting to ${defaultInputs.join(' ')}`));
    }
    const cli = new eslint_1.CLIEngine({
        baseConfig: Object.assign(Object.assign({}, createEslintConfig_1.createEslintConfig({
            rootDir: constants_1.paths.appRoot,
            writeFile: opts['write-file'],
        })), appPackageJson.eslint),
        extensions: ['.ts', '.tsx'],
        fix: opts.fix,
        ignorePattern: opts['ignore-pattern'],
    });
    const report = cli.executeOnFiles(opts['_']);
    if (opts.fix) {
        eslint_1.CLIEngine.outputFixes(report);
    }
    console.log(cli.getFormatter()(report.results));
    if (opts['report-file']) {
        fs.mkdirsSync(path_1.default.dirname(opts['report-file']));
        fs.writeFileSync(opts['report-file'], cli.getFormatter('json')(report.results));
    }
    if (report.errorCount) {
        process.exit(1);
    }
});
prog.parse(process.argv);
