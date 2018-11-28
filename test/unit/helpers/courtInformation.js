const { expect } = require('@hmcts/one-per-page-test-suite');
const fs = require('fs');

module.exports = {
  getExpectedCourtsList() {
    /* eslint-disable */
        return JSON.parse(fs.readFileSync('test/unit/resources/courtsList.json'));
    },
    testDivorceUnitDetailsRender(html) {
        expect(html).to.include('West Midlands Regional Divorce Centre')
            .and.to.include('PO Box 3650')
            .and.to.include('Stoke-on-Trent')
            .and.to.include('ST4 9NH');
        expect(html).to.not.include('Courts and Tribunals Service Centre')
            .and.to.not.include('c/o');
    },
    testCTSCDetailsRender(html) {
        expect(html).to.not.include('Your divorce centre');
        expect(html).to.include('Courts and Tribunals Service Centre')
            .and.to.include('c/o East Midlands Regional Divorce Centre')
            .and.to.include('PO Box 10447')
            .and.to.include('Nottingham')
            .and.to.include('NG2 9QN');
    }
};