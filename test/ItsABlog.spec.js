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
});