angular
	.module('visualizerServiceModule', [])
    .factory('visualizerService', visualizerService);

	visualizerService.$inject = ['VisBubbles', 'VisTracer', 'VisScope'];

	function visualizerService(VisBubbles, VisTracer, VisScope) {
		var service = {
			ctx: {},
			visualizers: [
				{name:'None',   globalCompositeOperation: '',            vis: false},
				{name:'Bubbles',globalCompositeOperation: 'lighter',     vis: new VisBubbles()},
				{name:'Scope',  globalCompositeOperation: 'source-over', vis: new VisScope()},
				{name:'Tracer', globalCompositeOperation: 'lighter',     vis: new VisTracer()}
			]
		};
		return service;
	}