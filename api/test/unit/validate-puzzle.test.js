const {assert, expect} = require('chai');
const {validatePuzzle} = require('./../../lib/validate-puzzle');
const fixtures = require('./fixtures/validate-puzzle.json');

describe('/lib/validate-puzzle.js', () => {

  fixtures.forEach(fixture => {

    const message = `should ${fixture.output.throw ? "throw RangeError": fixture.output.isValid ? "validate": "not validate"}`;

    it(message, () => {

      const onThrow = () => (
        validatePuzzle(fixture.entry)
      );

      if(!fixture.output.throw) {
        const {
          isValid,
          errors,
          fieldsNormalize
        } = validatePuzzle(fixture.entry);
  
        assert.isBoolean(isValid);
        expect(fixture.output.isValid).to.be.equal(isValid);
        expect(fixture.output.errors).to.deep.equal(errors);

        expect(fixture.output['themes-length']).to.equal(
          fieldsNormalize.themes.length
        );
        expect(fixture.output["moves-length"]).to.equal(
          fieldsNormalize.moves.length
        );
      } else {

        expect(onThrow).to.throw(RangeError, "arg1 should be a object");
      }

    });

  });

});
