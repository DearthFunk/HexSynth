angular
	.module('visualizerModule')
    .factory('VisTracer', visTracerFactory);

	visTracerFactory.$inject = [];

	function visTracerFactory() {

		var VisTracer = function () {

		};

		VisTracer.prototype.draw = function() {

		};

		return VisTracer;

	}