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
            let stubList = [],
                methodNames = ['getNamesOfFilesFromDir', 'initiateFileManifest', 'initializeMetaData',
                    'configureCustomMetaData', 'removeMetaDataString', 'compileContent',
                    'prettifyFileManifest'];

            beforeEach(() => {
                methodNames.forEach((methodName) => {
                    stubList.push(sinon.stub(itsABlog, methodName));
                });
            });

            afterEach(() => {
                methodNames.forEach((methodName) => {
                    itsABlog[methodName].restore();
                });
            });

            it('should not do anything if the fileManifest is defined', () => {
                itsABlog.fileManifest = {};
                itsABlog.configureFileManifest();
                stubList.forEach((stub) => {
                    expect(stub).to.have.not.been.calledWith();
                });
            });

            it('should go through all the proper calls', () => {
                itsABlog.configureFileManifest();
                stubList.forEach((stub) => {
                    expect(stub).to.have.been.called;
                });
            });
        });
    });
});