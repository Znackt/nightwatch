const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('sendKeys', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done, {
      output: true
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.sendKeys()', function(done) {
    let clearValueCalled = false;
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/clear',
      method: 'POST',
      postdata: {},
      response: {
        value: null,
        status: 0
      },
      onResponse() {
        clearValueCalled = true;
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: {value: ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    this.client.api
      .sendKeys('css selector', '#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys('css selector', {
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys({
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys('#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(clearValueCalled, false);
      });

    this.client.start(done);
  });
});