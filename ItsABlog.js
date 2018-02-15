import fs from 'fs';
import objectPath from 'object-path';
import marked from 'marked';
import typeset from 'typeset';
import recursiveReadDir from 'recursive-readdir-synchronous';

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
            pretty: true,
            output: 'blog.json'
        };

        let compiledOptions = {};

        Object.keys(defaultOptions).forEach((key) => {
            compiledOptions[key] = objectPath.has(options, key) ? options[key] :
                defaultOptions[key];
        });

        this.options = compiledOptions;
    }

    /**
     * Runner Methods
     */

    /**
     * Returns fileManifest, without writing to a file
     */
    getPosts() {
        this.configureFileManifest();
        return this.fileManifest;
    }

    /**
     * Write fileManifest to given output file
     */
    outputToFile() {
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
    configureFileManifest() {
        if(typeof this.fileManifest === 'undefined') {
            this.getFileListFromDir();
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
    getFileListFromDir() {
        this.fileNames = recursiveReadDir(this.options.dir);
        this.fileList = this.fileNames.map((fileName) => {
            let ancestry = fileName.split('\\'),
                trueFileName;

            ancestry.shift();

            trueFileName = ancestry.pop();

            return {
                 fileName: trueFileName,
                 ancestry: ancestry
            };
        });

        delete this.fileNames;
    }

    /**
     * Sets the fileManifest to have keys based on the file names from the directory,
     * and their content
     */
    initiateFileManifest() {
        if(!objectPath.get(this, 'fileList.length')) {
            throw 'no files found in given dir';
        }

        this.fileManifest = {};

        this.fileList.forEach((file) => {
            this.fileManifest[file.fileName] = {
                content: fs.readFileSync(this.options.dir + '/' + file.ancestry.join('/') + '/' +
                    file.fileName, this.options.encoding),
                ancestry: file.ancestry
            };
        });

        delete this.fileList;
    }

    /**
     * Sets up metaData for each item in fileManifest
     */
    initializeMetaData() {
        Object.keys(this.fileManifest).forEach((key) => {
            let file = this.fileManifest[key];
            file.meta = {
                creationDate: fs.statSync(this.options.dir + '/' + file.ancestry.join('/') + '/' +
                    key).birthtime,
                lastEdited: fs.statSync(this.options.dir + '/' + file.ancestry.join('/') + '/' +
                    key).mtime
            };
        });
    }

    /**
     * Adds meta data set within the blog post to the meta data for the fileManifest
     */
    configureCustomMetaData() {
        Object.keys(this.fileManifest).forEach((key) => {
            let containsCustomMetaData = this.fileManifest[key].content.indexOf(this.options.metaTagStart) > -1,
                customMetaDataString,
                customMetaData;

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
    removeMetaDataString() {
        Object.keys(this.fileManifest).forEach((key) => {
            let customMetaDataString =  this.fileManifest[key].content.substring(this.fileManifest[key]
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
    compileContent() {
        Object.keys(this.fileManifest).forEach((key) => {
            this.fileManifest[key].content =
                typeset(marked(this.fileManifest[key].content), {
                    disable: ['hyphenate']
                });
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

    /**
     * Writes the fileManifest to the file set in the options
     */
    writeToFile() {
        fs.writeFileSync(this.options.output, JSON.stringify(this.fileManifest, null, this.options.pretty ?
            '\t' : null));
    }
}