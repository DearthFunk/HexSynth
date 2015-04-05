angular
	.module('visualizerServiceModule', [])
    .factory('visualizerService', visualizerService);

	visualizerService.$inject = ['VisBubbles', 'VisTracer', 'VisScope'];

	function visualizerService(VisBubbles, VisTracer, VisScope) {
		var service = {
			ctx: {},
			visualizers: [
				{name:'None',   globalCompositeOperation: '',            clearCanvas:false, vis: false},
				{name:'Bubbles',globalCompositeOperation: 'lighter',     clearCanvas:true,  vis: new VisBubbles()},
				{name:'Scope',  globalCompositeOperation: 'source-over', clearCanvas:false, vis: new VisScope()},
				{name:'Tracer', globalCompositeOperation: 'lighter',     clearCanvas:true,  vis: new VisTracer()}
			]
		};
		return service;
	}