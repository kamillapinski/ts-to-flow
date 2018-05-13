#!/usr/bin/env node

const fsExtra = require('fs-extra');
const flowgen = require('flowgen').default;
const path = require('path')
const chalk = require('chalk').default;

async function containsNoExports(file: string): Promise<boolean> {
	const fileContents = await fsExtra.readFile(file);
	const emptyExportRegExp = /^[\s]*[export]?\{?[\s]*\}?[\s]*$/;

	if (emptyExportRegExp.test(fileContents)) {
		return true;
	}

	return false;
}

function excapeRegExpString(str: string): string {
	return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function getFlowName(file: string, topLevelDir: string): string {
	return file
		.replace(/\.d\.ts$/, '.js')
		.replace(new RegExp('^' + excapeRegExpString(topLevelDir)), 'flow-typed' + path.sep)
		.replace(path.sep + path.sep, path.sep);
}

async function processIfTS(entry: string, topLevelDir: string): Promise<void> {
	if (entry.endsWith('.d.ts')) {
		if (await containsNoExports(entry)) {
			return;
		}

		const flowCode = flowgen.beautify(flowgen.compiler.compileDefinitionFile(entry));
		const flowName = getFlowName(entry, topLevelDir)

		console.log(entry + ' -> ' + chalk.green(flowName))

		await fsExtra.outputFile(flowName, flowCode);
	}
}

async function processEntry(entry: string, topLevelDir: string): Promise<void> {
	try {
		await fsExtra.ensureDir(entry)
		await generateFlowTypes(entry, topLevelDir)
		console.log(chalk.green(`Processed ${entry}`))
	} catch (e) {
		await processIfTS(entry, topLevelDir)
	}
}

async function generateFlowTypes(dir: string | string[], topLevelDir?: string) {
	if (dir instanceof Array) {
		for (const d of dir) {
			return await generateFlowTypes(d, topLevelDir)
		}
	} else {
		const entries = await fsExtra.readdir(dir)

		for (const entry of entries) {
			await processEntry(path.join(dir, entry), topLevelDir || dir)
		}
	}
}

const directories = process.argv.splice(2);

for (const dir of directories) {
	generateFlowTypes(dir).catch((e) => {
		console.error(chalk.red(`Could not process directory ${dir}\n`), e);
	})
}