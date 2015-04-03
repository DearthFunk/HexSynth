angular
	.module('visualizerServiceModule')
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