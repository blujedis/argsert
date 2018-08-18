import * as chai from 'chai';
import * as mocha from 'mocha';

const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

import * as Argsert from './argsert';

const argsert = Argsert.configure({
  strict: true,
  onError: false
});

describe('Argsert', () => {

  it('should return error expecting 2 arguments.', () => {
    function addUser(name?, age?, email?) {
      const result = argsert.assert('<string> <number> [string]', [name, age, email]);
      assert.equal(result.failure.error.message, 'expected at least 2 argument(s) but got 1.');
    }
    addUser('Milton');
  });

  it('should return error, too many args in strict mode.', () => {
    function addUser(name?, age?, email?) {
      const result = argsert.assert('<string> <number>', [name, age, email]);
      assert.equal(result.failure.error.message, 'expected no more than 2 argument(s) but got 3.');
    }
    addUser('Milton', 44, 'waddams@officespace.com');
  });

  it('should disable strict mode inject any type for missing config.', () => {
    function addUser(name?, age?, email?) {
      const result = argsert.assert('<string> <number>', [name, age, email]);
      assert.equal(result.failure, null);
    }
    argsert.option('strict', false);
    addUser('Milton', 44, 'waddams@officespace.com');
  });

  it('should type check using multiple types for age arg.', () => {
    function addUser(name?, age?, email?) {
      const result = argsert.assert('<string> <string|number> [string]', [name, age, email]);
      assert.equal(result.failure, null);
    }
    addUser('Milton', 'waddams@officespace.com');
  });

  it('should disable extra arguments check.', () => {
    function addUser(name?, age?, email?) {
      const result = argsert.assert('<string> <number>', [name, age, email]);
      assert.equal(result.failure, null);
    }
    argsert
      .option('strict', true)
      .disable('extra');
    addUser('Milton', 44, 'waddams@officespace.com');
  });

  it('should disable extra arguments check.', () => {
    const enabled = argsert.once('unmet').enabled();
    assert.deepEqual(enabled, ['unmet']);
  });

  it('should disable check enabled then reenabled all.', () => {
    let enabled = argsert.disable().enabled();
    assert.deepEqual(enabled, []);
    enabled = argsert.enable().enabled();
    assert.deepEqual(enabled, ['unmet', 'extra', 'mismatch']);
  });

  it('should call single validator manually.', () => {
    function addUser(name?, age?, email?) {
      const result = argsert.assert('<string> <age:number>', [name, age, email], 'mismatch');
      assert.equal(result.failure.error.message, 'age arg has type string but only number is allowed.');
    }
    addUser('Milton', 'should be number');
  });

});