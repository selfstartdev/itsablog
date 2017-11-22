/* global describe it beforeEach afterEach*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs';
import ItsABlog from './../ItsABlog.js';

let expect = chai.expect;
chai.use(sinonChai);

describe('ItsABlog', () => {
    let itsABlog, defaultOptions;

    beforeEach(() => {
        itsABlog = new ItsABlog();
        defaultOptions = {
            metaTagStart: '<meta>',
            metaTagEnd: '</meta>',
            dir: 'blog',
            encoding: 'utf-8',
            pretty: true,
            output: 'blog.json'
        };
    });

    describe('constructor', () => {
        let customOptions, currentOptions;

        it('should set the default options', () => {
            itsABlog = new ItsABlog();
            expect(itsABlog.options).to.eql(defaultOptions);
        });

        it('should be able to override any option given', () => {
             customOptions = {
                 metaTagStart: 'test',
                 metaTagEnd: 'test',
                 dir: 'test',
                 encoding: 'test',
                 pretty: false,
                 output: 'test'
             };

            currentOptions = {};

            Object.keys(customOptions).forEach((key) => {
                currentOptions[key] = customOptions[key];
                itsABlog = new ItsABlog(currentOptions);

                Object.keys(currentOptions).forEach((key) => {
                    expect(itsABlog.options[key]).to.eql(currentOptions[key]);
                });
            });
        });
    });

    describe('Runner Methods', () => {
        describe('#getPosts', () => {
            let configureFileManifestStub, fakeFileManifest;

            beforeEach(() => {
                configureFileManifestStub = sinon.stub(itsABlog, 'configureFileManifest');
                fakeFileManifest = {
                    files: [
                        {
                            test: true
                        }
                    ]
                };
            });

            afterEach(() => {
                itsABlog.configureFileManifest.restore();
            });

            it('should call to configure the file manifest', () => {
                itsABlog.getPosts();
                expect(configureFileManifestStub).to.have.been.calledWith();
            });

            it('should return the fileManifest', () => {
                itsABlog.fileManifest = fakeFileManifest;
                expect(itsABlog.getPosts()).to.equal(fakeFileManifest);
            });
        });

        describe('#outputToFile', () => {
            let configureFileManifestStub, writeToFileStub;

            beforeEach(() => {
                configureFileManifestStub = sinon.stub(itsABlog, 'configureFileManifest');
                writeToFileStub = sinon.stub(itsABlog, 'writeToFile');
            });

            afterEach(() => {
                itsABlog.configureFileManifest.restore();
                itsABlog.writeToFile.restore();
            });

            it('should call to configure the file manifest', () => {
                itsABlog.outputToFile();
                expect(configureFileManifestStub).to.have.been.calledWith();
            });

            it('should call to write the file manifest to output file', () => {
                itsABlog.outputToFile();
                expect(writeToFileStub).to.have.been.calledWith();
            });
        });
    });

    describe('Builder Methods', () => {
        describe('#configureFileManifest', () => {
            let getNamesOfFilesFromDirStub, initiateFileManifestStub, initializeMetaDataStub,
                configureCustomMetaDataStub, removeMetaDataStringStub, compileContentStub,
                prettifyFileManifestStub;

            beforeEach(() => {
                getNamesOfFilesFromDirStub = sinon.stub(itsABlog, 'getNamesOfFilesFromDir');
                initiateFileManifestStub = sinon.stub(itsABlog, 'initiateFileManifest');
                initializeMetaDataStub = sinon.stub(itsABlog, 'initializeMetaData');
                configureCustomMetaDataStub = sinon.stub(itsABlog, 'configureCustomMetaData');
                removeMetaDataStringStub = sinon.stub(itsABlog, 'removeMetaDataString');
                compileContentStub = sinon.stub(itsABlog, 'compileContent');
                prettifyFileManifestStub = sinon.stub(itsABlog, 'prettifyFileManifest');
            });

            afterEach(() => {
                itsABlog.getNamesOfFilesFromDir.restore();
                itsABlog.initiateFileManifest.restore();
                itsABlog.initializeMetaData.restore();
                itsABlog.configureCustomMetaData.restore();
                itsABlog.removeMetaDataString.restore();
                itsABlog.compileContent.restore();
                itsABlog.prettifyFileManifest.restore();
            });

            it('should not do anything if the fileManifest is defined', () => {
                itsABlog.fileManifest = {};
                itsABlog.configureFileManifest();
                expect(getNamesOfFilesFromDirStub).to.have.not.been.called;
                expect(initiateFileManifestStub).to.have.not.been.called;
                expect(initializeMetaDataStub).to.have.not.been.called;
                expect(configureCustomMetaDataStub).to.have.not.been.called;
                expect(removeMetaDataStringStub).to.have.not.been.called;
                expect(compileContentStub).to.have.not.been.called;
                expect(prettifyFileManifestStub).to.have.not.been.called;
            });

            it('should go through all the proper calls', () => {
                itsABlog.configureFileManifest();
                expect(getNamesOfFilesFromDirStub).to.have.been.called;
                expect(initiateFileManifestStub).to.have.been.called;
                expect(initializeMetaDataStub).to.have.been.called;
                expect(configureCustomMetaDataStub).to.have.been.called;
                expect(removeMetaDataStringStub).to.have.been.called;
                expect(compileContentStub).to.have.been.called;
                expect(prettifyFileManifestStub).to.have.been.called;
            });

            it('should call to prettify if the option is set to false', () => {
                itsABlog.options.pretty = false;
                itsABlog.configureFileManifest();
                expect(prettifyFileManifestStub).to.have.not.been.called;
            });
        });

        describe('#getNamesOfFilesFromDir', () => {
            let readdirSyncStub, customDir;

            beforeEach(() => {
                readdirSyncStub = sinon.stub(fs, 'readdirSync');
            });

            afterEach(() => {
                fs.readdirSync.restore();
            });

            it('should call to read the default directory', () => {
                itsABlog.getNamesOfFilesFromDir();
                expect(readdirSyncStub).to.have.been.calledWith(defaultOptions.dir);
            });

            it('should call to read a given directory from custom options', () => {
                customDir = 'customDir';
                itsABlog = new ItsABlog({
                    dir: customDir
                });
                itsABlog.getNamesOfFilesFromDir();
                expect(readdirSyncStub).to.have.been.calledWith(customDir);
            });
        });
        
        describe('#initiateFileManifest', () => {
            let fakeFileNames, fakeFileContent, readFileSyncStub;
            
            beforeEach(() => {
                fakeFileNames = ['test1.md', 'test2.md'];
                fakeFileContent = 'fakeFileContent';
                readFileSyncStub = sinon.stub(fs, 'readFileSync').returns(fakeFileContent);
            });

            afterEach(() => {
                fs.readFileSync.restore();
            });
            
            it('should throw an error if no files have been found', () => {
                itsABlog = new ItsABlog();
                expect(itsABlog.initiateFileManifest).to.throw();
            });

            it('should set files from file system', () => {
                itsABlog.fileNames = fakeFileNames;
                itsABlog.initiateFileManifest();
                expect(readFileSyncStub).to.have.been.calledTwice;
                expect(itsABlog.fileManifest[fakeFileNames[0]].content).to.eql(fakeFileContent);
            });

            it('should allow for custom encoding', () => {
                itsABlog = new ItsABlog({
                    encoding: 'test'
                });
                itsABlog.fileNames = fakeFileNames;
                itsABlog.initiateFileManifest();
                expect(readFileSyncStub).to.have.been.calledWith(
                    defaultOptions.dir + '/' + fakeFileNames[0], 'test');
            });

            it('should delete fileNames after completing task', () => {
                itsABlog.fileNames = fakeFileNames;
                itsABlog.initiateFileManifest();
                expect(typeof itsABlog.fileNames).to.equal('undefined');
            });
        });
    });
});