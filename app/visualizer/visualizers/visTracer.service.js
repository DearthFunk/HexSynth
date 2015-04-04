angular
	.module('visualizerModule')
    .factory("VisTracer", visTracerFactory);

	visTracerFactory.$inject = [];

	function visTracerFactory() {

		var VisTracer = function (ctx) {
			this.ctx = ctx;
		};

		VisTracer.prototype.draw = function() {

		};

		return VisTracer;

	}