/*!
 * circuitbox
 * Copyright(c) 2013 Ranganath Kini <oddjobsman@ranganathkini.com>
 * MIT Licensed
 */

/*jshint nonew: false*/

'use strict';

var context = describe;
var expect = require('expect.js');
var sinon = require('sinon');

var Configuration = require('../lib/configuration');
var ComponentDefinitionError = require('../lib/componentDefinitionError');

describe('Configuration', function () {

  context('when created with a kernel and options', function () {

    it('should set the name of the kernel if provided in options', function () {
      var mockKernel = {};

      new Configuration(mockKernel, {name: 'myKernel'});

      expect(mockKernel.name).to.be('myKernel');
    });

    it('should register all modules specified providing them an instance of the kernel\'s registry', function () {
      var mockRegistryView = { for: function () {} };

      var mockKernel = {
        registry: {
          registerModule: function (module) {
            module(mockRegistryView);
          }
        }
      };

      var moduleASpy = sinon.spy();
      var moduleBSpy = sinon.spy();

      new Configuration(mockKernel, {modules: [
        moduleASpy,
        moduleBSpy
      ]});

      expect(moduleASpy.withArgs(mockRegistryView).calledOnce).to.be(true);
      expect(moduleBSpy.withArgs(mockRegistryView).calledOnce).to.be(true);
    });

    it('should throw error if one of the modules specified is not a function', function () {
      var mockRegistryView = { for: function () {} };

      var mockKernel = {
        registry: {
          registerModule: function (module) {
            module(mockRegistryView);
          }
        }
      };

      var moduleASpy = sinon.spy();

      expect(function () {
        new Configuration(mockKernel, {modules: [
          moduleASpy,
          {}
        ]});
      }).to.throwError(function (e) {
        expect(e).to.be.a(ComponentDefinitionError);
        expect(e.message).to.match(/Cannot initialize module which is not a function/);
      });

    });

  });

});