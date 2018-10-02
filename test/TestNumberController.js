var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

const NumberController = require('../Controller/NumberController')
const number_controller = new NumberController()

describe('Number Controller', function() {


  describe('Conversations', function() {
    it('should return an array of all conversations as an object', function(done) {
      number_controller.getAllConversations(conversations => {
        expect(conversations).to.be.a('object');
        done()
      })
    });
    it('should return an array of active conversations', function(done) {
      number_controller.getActiveConversations(conversations => {
        expect(conversations).to.be.a('object');
        done()
      })
    });
  })


  describe('Get a line', function() {
    it('should return the phone numbers to use for the conversation', function() {
      expect(number_controller.getLines()).to.be.an('array');
    });

    it('should return an array of available numbers for a pair', function(done) {
      number_controller.getAvailableLineForNumbers(['+61491570156','+61491570157'], lines => {
        expect(lines).to.be.an('array');
        done()
      })
    });

  });


});
