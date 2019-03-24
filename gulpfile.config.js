'use strict';

class GulpConfig {

  constructor() {

    // source
    this.sourcePath = 'src';
    this.tsSourceFiles = this.sourcePath + '/**/*.ts';

    // test
    this.testPath = 'test';
    this.testFiles = `${this.testPath}/**/*.ts`;

    // target
    this.targetPath = 'generators';

    // docs
    this.docsPath = 'docs';
    this.docsFiles = this.docsPath + '/**/*';

    // Static files
    this.statics = [
      {
        sourcePath: `${this.sourcePath}/**/templates/**`,
        targetPath: `${this.targetPath}`
      }
    ];
  }

}
module.exports = GulpConfig;
