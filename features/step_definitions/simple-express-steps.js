'use strict';

var expect = require('chai').expect;

module.exports = function() {
  this.World = require('../support/world.js').World;

  this.When(/^I go to the just deployed test server$/, function () {
    this.driver.get('http://' + (process.env.TEST_SERVER_DNS || 'localhost') + ':3000/').then(function () {
      return true;
    }, function () {
      return false;
    });
  });

  this.Then(/^I should see the welcome to page$/, function () {
    this.waitFor('p');
    return this.driver.findElements({ css: '#welcome' })
      .then(function(elements) {
        expect(elements.length).to.not.equal(0);
      });
  });

};
