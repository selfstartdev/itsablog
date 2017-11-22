/* global describe it beforeEach afterEach*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ItsABlog from './../ItsABlog.js';

let expect = chai.expect;
chai.use(sinonChai);

describe('ItsABlog', () => {
    let itsABlog;

    beforeEach(() => {
        itsABlog = new ItsABlog();
    });

    describe('constructor', () => {
        let defaultOptions, customOptions, currentOptions;

        beforeEach(() => {
            defaultOptions = {
                metaTagStart: '<meta>',
                metaTagEnd: '</meta>',
                dir: 'blog',
                encoding: 'utf-8',
                pretty: true,
                output: 'blog.json'
            };
        });

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
    });
});