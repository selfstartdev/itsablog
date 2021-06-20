#!/usr/bin/env/node

import { Command } from 'commander';

import { ItsABlogOptions } from './types/ItsABlog';
import ItsABlog from './ItsABlog';

const itsABlogCLI = new Command();

/** Defining CLI Params */

itsABlogCLI
    .option('-d, --dir <dir>', 'Directory containing markdown files to be converted')
    .option('-o, --output <output>', 'Output Directory for JSON')
    .option('-p, --pretty', 'Prettifies the output')
    .option('-ms, --metaTagStart <metaTagStart>', 'Define a custom opening meta tag')
    .option('-me, --metaTagEnd <metaTagEnd>', 'Define a custom closing meta tag');

itsABlogCLI.parse(process.argv);

const cliOptions = itsABlogCLI.opts() as ItsABlogOptions;

const itsABlog = new ItsABlog(cliOptions);

itsABlog.outputToFile();