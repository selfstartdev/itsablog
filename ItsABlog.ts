import * as fs from 'fs';
import objectPath from 'object-path';
import marked from 'marked';
import typeset from 'typeset';

import { ItsABlogOptions, ItsABlogFileManifest } from './types/ItsABlog';

/**
 * ItsABlog
 */
export default class ItsABlog {

    /**
     * Private Members
     */
    private options: ItsABlogOptions;
    private fileNames: string[];
    private fileManifest: ItsABlogFileManifest;

    constructor(options?: Record<string, unknown>) {
        const defaultOptions: ItsABlogOptions = {
            metaTagStart: '<meta>',
            metaTagEnd: '</meta>',
            dir: 'blog',
            encoding: 'utf8',
            pretty: true,
            output: 'blog.json'
        };

        const compiledOptions: ItsABlogOptions = {} as ItsABlogOptions;

        Object.keys(defaultOptions).forEach((key) => {
            compiledOptions[key] = objectPath.has(options, key) ? options[key] :
                defaultOptions[key];
        });

        this.options = compiledOptions;
    }

    /**
     * Runner Methods
     */
    getPosts(): ItsABlogFileManifest {
        this.configureFileManifest();
        return this.fileManifest;
    }

    /**
     * Write fileManifest to given output file
     */
    outputToFile(): void {
        this.configureFileManifest();
        this.writeToFile();
        console.log('Output to file: "' + this.options.output + '"');
    }

    /**
     * Builder Methods
     */

    /**
     * Sets up the file manifest, if it hasn't been done already
     */
    configureFileManifest(): void {
        if(typeof this.fileManifest === 'undefined') {
            this.getNamesOfFilesFromDir();
            this.initiateFileManifest();
            this.initializeMetaData();
            this.configureCustomMetaData();
            this.removeMetaDataString();
            this.compileContent();
            this.options.pretty && this.prettifyFileManifest();
        }
    }

    /**
     * Sets the fileNames member equal to all file names in the given dir
     */
    getNamesOfFilesFromDir(): void {
        this.fileNames = fs.readdirSync(this.options.dir);
    }

    /**
     * Sets the fileManifest to have keys based on the file names from the directory,
     * and their content
     */
    initiateFileManifest(): void {
        if(!objectPath.get(this, 'fileNames.length')) {
            throw 'no files found in given dir';
        }

        this.fileManifest = {};

        this.fileNames.forEach((fileName) => {
            this.fileManifest[fileName] = {
                content: fs.readFileSync(this.options.dir + '/' + fileName, {
                    encoding: this.options.encoding
                })
            };
        });

        delete this.fileNames;
    }

    /**
     * Sets up metaData for each item in fileManifest
     */
    initializeMetaData(): void {
        Object.keys(this.fileManifest).forEach((key) => {
            this.fileManifest[key].meta = {
                creationDate: fs.statSync(this.options.dir + '/' + key)
                    .birthtime,
                lastEdited: fs.statSync(this.options.dir + '/' + key)
                    .mtime
            };
        });
    }

    /**
     * Adds meta data set within the blog post to the meta data for the fileManifest
     */
    configureCustomMetaData(): void {
        Object.keys(this.fileManifest).forEach((key) => {
            const containsCustomMetaData = this.fileManifest[key].content.indexOf(this.options.metaTagStart) > -1;
            let customMetaDataString, customMetaData;

            if(containsCustomMetaData) {
                customMetaDataString = this.fileManifest[key].content.substring(this.fileManifest[key]
                        .content.indexOf(this.options.metaTagStart) +
                    this.options.metaTagStart.length, this.fileManifest[key]
                    .content.indexOf(this.options.metaTagEnd));

                customMetaData = JSON.parse(customMetaDataString);

                Object.assign(this.fileManifest[key].meta, customMetaData);
            }
        });
    }

    /**
     * Removes text that contains meta data from the outputted content of the item in the fileManifest
     */
    removeMetaDataString(): void {
        Object.keys(this.fileManifest).forEach((key) => {
            const customMetaDataString =  this.fileManifest[key].content.substring(this.fileManifest[key]
                .content.indexOf(this.options.metaTagStart), this.fileManifest[key]
                .content.indexOf(this.options.metaTagEnd) + this.options.metaTagEnd.length);

            this.fileManifest[key].content = this.fileManifest[key].content.substring(
                this.fileManifest[key].content.indexOf(customMetaDataString) + customMetaDataString.length,
                this.fileManifest[key].content.length
            );
        });
    }

    /**
     * Changes content of each item in fileManifest to be html compatable, and
     * char changed to typeset
     */
    compileContent(): void {
        Object.keys(this.fileManifest).forEach((key) => {
            this.fileManifest[key].content =
                typeset(marked(this.fileManifest[key].content));
        });
    }

    /**
     * Changes fileManifest keys to be the file name without the extension, by making
     * them substrings up to the first '.'
     */
    prettifyFileManifest(): void {
        Object.keys(this.fileManifest).forEach((key) => {
            const prettyName = key.substr(0, key.indexOf('.'));
            this.fileManifest[prettyName] = this.fileManifest[key];
            delete this.fileManifest[key];
        });
    }

    /**
     * Writes the fileManifest to the file set in the options
     */
    writeToFile(): void {
        fs.writeFileSync(this.options.output, JSON.stringify(this.fileManifest, null, this.options.pretty ?
            '\t' : null));
    }
}