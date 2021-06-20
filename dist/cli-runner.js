#!/usr/bin/env/node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var ItsABlog_1 = __importDefault(require("./ItsABlog"));
var itsABlogCLI = new commander_1.Command();
/** Defining CLI Params */
itsABlogCLI
    .option('-d, --dir <dir>', 'Directory containing markdown files to be converted')
    .option('-o, --output <output>', 'Output Directory for JSON')
    .option('-p, --pretty', 'Prettifies the output')
    .option('-ms, --metaTagStart <metaTagStart>', 'Define a custom opening meta tag')
    .option('-me, --metaTagEnd <metaTagEnd>', 'Define a custom closing meta tag');
itsABlogCLI.parse(process.argv);
var cliOptions = itsABlogCLI.opts();
var itsABlog = new ItsABlog_1.default(cliOptions);
itsABlog.outputToFile();
//# sourceMappingURL=cli-runner.js.map