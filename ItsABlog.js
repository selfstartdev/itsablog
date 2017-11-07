import fs from 'fs';
import objectPath from 'object-path';
import marked from 'marked';
import typeset from 'typeset';

/**
 * ItsABlog
 */
export default class ItsABlog {
    constructor(options) {
        const defaultOptions = {
            metaTagStart: '<meta>',
            metaTagEnd: '</meta>',
            dir: 'blog',
            encoding: 'utf-8',
            pretty: true
        };

        let compiledOptions = {};

        Object.keys(defaultOptions).forEach((key) => {
            compiledOptions[key] = objectPath.has(options, key) ? options[key] :
                defaultOptions[key];
        });

        this.options = compiledOptions;
    }

    getPosts() {
        this.getNamesOfFilesFromDir();
        this.initiateFileManifest();
        this.initializeMetaData();
        this.compileContent();
        this.options.pretty && this.prettifyFileManifest();
        return this.fileManifest;
    }

    /**
     * Privates
     */

    /**
     * Sets the fileNames member equal to all file names in the given dir
     */
    getNamesOfFilesFromDir() {
        this.fileNames = fs.readdirSync(__dirname + '/' + this.options.dir);
    }

    /**
     * Sets the fileManifest to have keys based on the file names from the directory,
     * and their content
     */
    initiateFileManifest() {
        if(!this.fileNames.length) {
            throw 'no files found in given dir';
        }

        this.fileManifest = {};

        this.fileNames.forEach((fileName) => {
            this.fileManifest[fileName] = {
                content: fs.readFileSync(__dirname + '/' +
                    this.options.dir + '/' + fileName,  this.options.encoding)
                };
        });

        delete this.fileNames;
    }

    /**
     * Sets up metaData for each item in fileManifest
     */
    initializeMetaData() {
        Object.keys(this.fileManifest).forEach((key) => {
            this.fileManifest[key].meta = {
                creationDate: fs.statSync(__dirname + '/' + this.options.dir + '/' + key)
                    .birthtime,
                lastEdited: fs.statSync(__dirname + '/' + this.options.dir + '/' + key)
                    .mtime
            };
        });
    }

    /**
     * Changes content of each item in fileManifest to be html compatable, and
     * char changed to typeset
     */
    compileContent() {
        Object.keys(this.fileManifest).forEach((key) => {
            this.fileManifest[key].content =
                typeset(marked(this.fileManifest[key].content));
        });
    }

    /**
     * Changes fileManifest keys to be the file name without the extension, by making
     * them substrings up to the first '.'
     */
    prettifyFileManifest() {
        Object.keys(this.fileManifest).forEach((key) => {
            let prettyName = key.substr(0, key.indexOf('.'));
            this.fileManifest[prettyName] = this.fileManifest[key];
            delete this.fileManifest[key];
        });
    }
}