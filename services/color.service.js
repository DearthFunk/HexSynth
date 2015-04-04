angular
	.module('colorServiceModule', [])
    .factory('colorService', colorService);

	function colorService(){
		var service = {
			randomRGB: randomRGB
		};
		return service;

		/////////////////////////////////////

		function randomRGB() {
			return 'rgba(' +
				Math.floor(Math.random()*255+1) + ',' +
				Math.floor(Math.random()*255+1) + ',' +
				Math.floor(Math.random()*255+1) + ',' +
				Math.random() + ')';
		}
	}