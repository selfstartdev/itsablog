"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var object_path_1 = __importDefault(require("object-path"));
var marked_1 = __importDefault(require("marked"));
var typeset_1 = __importDefault(require("typeset"));
/**
 * ItsABlog
 */
var ItsABlog = /** @class */ (function () {
    function ItsABlog(options) {
        var defaultOptions = {
            metaTagStart: '<meta>',
            metaTagEnd: '</meta>',
            dir: 'blog',
            encoding: 'utf8',
            pretty: true,
            output: 'blog.json'
        };
        var compiledOptions = {};
        Object.keys(defaultOptions).forEach(function (key) {
            compiledOptions[key] = object_path_1.default.has(options, key) ? options[key] :
                defaultOptions[key];
        });
        this.options = compiledOptions;
    }
    /**
     * Runner Methods
     */
    ItsABlog.prototype.getPosts = function () {
        this.configureFileManifest();
        return this.fileManifest;
    };
    /**
     * Write fileManifest to given output file
     */
    ItsABlog.prototype.outputToFile = function () {
        this.configureFileManifest();
        this.writeToFile();
        console.log('Output to file: "' + this.options.output + '"');
    };
    /**
     * Builder Methods
     */
    /**
     * Sets up the file manifest, if it hasn't been done already
     */
    ItsABlog.prototype.configureFileManifest = function () {
        if (typeof this.fileManifest === 'undefined') {
            this.getNamesOfFilesFromDir();
            this.initiateFileManifest();
            this.initializeMetaData();
            this.configureCustomMetaData();
            this.removeMetaDataString();
            this.compileContent();
            this.options.pretty && this.prettifyFileManifest();
        }
    };
    /**
     * Sets the fileNames member equal to all file names in the given dir
     */
    ItsABlog.prototype.getNamesOfFilesFromDir = function () {
        this.fileNames = fs.readdirSync(this.options.dir);
    };
    /**
     * Sets the fileManifest to have keys based on the file names from the directory,
     * and their content
     */
    ItsABlog.prototype.initiateFileManifest = function () {
        var _this = this;
        if (!object_path_1.default.get(this, 'fileNames.length')) {
            throw 'no files found in given dir';
        }
        this.fileManifest = {};
        this.fileNames.forEach(function (fileName) {
            _this.fileManifest[fileName] = {
                content: fs.readFileSync(_this.options.dir + '/' + fileName, {
                    encoding: _this.options.encoding
                })
            };
        });
        delete this.fileNames;
    };
    /**
     * Sets up metaData for each item in fileManifest
     */
    ItsABlog.prototype.initializeMetaData = function () {
        var _this = this;
        Object.keys(this.fileManifest).forEach(function (key) {
            _this.fileManifest[key].meta = {
                creationDate: fs.statSync(_this.options.dir + '/' + key)
                    .birthtime,
                lastEdited: fs.statSync(_this.options.dir + '/' + key)
                    .mtime
            };
        });
    };
    /**
     * Adds meta data set within the blog post to the meta data for the fileManifest
     */
    ItsABlog.prototype.configureCustomMetaData = function () {
        var _this = this;
        Object.keys(this.fileManifest).forEach(function (key) {
            var containsCustomMetaData = _this.fileManifest[key].content.indexOf(_this.options.metaTagStart) > -1;
            var customMetaDataString, customMetaData;
            if (containsCustomMetaData) {
                customMetaDataString = _this.fileManifest[key].content.substring(_this.fileManifest[key]
                    .content.indexOf(_this.options.metaTagStart) +
                    _this.options.metaTagStart.length, _this.fileManifest[key]
                    .content.indexOf(_this.options.metaTagEnd));
                customMetaData = JSON.parse(customMetaDataString);
                Object.assign(_this.fileManifest[key].meta, customMetaData);
            }
        });
    };
    /**
     * Removes text that contains meta data from the outputted content of the item in the fileManifest
     */
    ItsABlog.prototype.removeMetaDataString = function () {
        var _this = this;
        Object.keys(this.fileManifest).forEach(function (key) {
            var customMetaDataString = _this.fileManifest[key].content.substring(_this.fileManifest[key]
                .content.indexOf(_this.options.metaTagStart), _this.fileManifest[key]
                .content.indexOf(_this.options.metaTagEnd) + _this.options.metaTagEnd.length);
            _this.fileManifest[key].content = _this.fileManifest[key].content.substring(_this.fileManifest[key].content.indexOf(customMetaDataString) + customMetaDataString.length, _this.fileManifest[key].content.length);
        });
    };
    /**
     * Changes content of each item in fileManifest to be html compatable, and
     * char changed to typeset
     */
    ItsABlog.prototype.compileContent = function () {
        var _this = this;
        Object.keys(this.fileManifest).forEach(function (key) {
            _this.fileManifest[key].content =
                typeset_1.default(marked_1.default(_this.fileManifest[key].content));
        });
    };
    /**
     * Changes fileManifest keys to be the file name without the extension, by making
     * them substrings up to the first '.'
     */
    ItsABlog.prototype.prettifyFileManifest = function () {
        var _this = this;
        Object.keys(this.fileManifest).forEach(function (key) {
            var prettyName = key.substr(0, key.indexOf('.'));
            _this.fileManifest[prettyName] = _this.fileManifest[key];
            delete _this.fileManifest[key];
        });
    };
    /**
     * Writes the fileManifest to the file set in the options
     */
    ItsABlog.prototype.writeToFile = function () {
        fs.writeFileSync(this.options.output, JSON.stringify(this.fileManifest, null, this.options.pretty ?
            '\t' : null));
    };
    return ItsABlog;
}());
exports.default = ItsABlog;
//# sourceMappingURL=ItsABlog.js.map