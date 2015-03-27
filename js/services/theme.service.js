angular.module('themeServiceModule', [])

	.service('themeService', function(localStorageService){

		var themeServiceScope = this;
		themeServiceScope.themeIndex = angular.isObject(localStorageService.storage) ? localStorageService.storage.themeIndex : 0;
        themeServiceScope.themes = [
	        {
		        name: "Blue Blocks",
		        main:{
			        backgroundImage: "url('img/background1.jpg')"
		        },
		        hex: {
			        fill: "rgba(68,68,221,0.5)",
			        fillSharp: "rgba(221,221,68,0.5)",
			        border: "#FFFFFF",
			        text: "#FFFFFF",
			        innerDot: "#FFFFFF"
		        },
		        hexActive: {
			        fill: "#000000",
			        fillSharp: "#000000",
			        border:"#FF0000",
			        text: "#FFFFFF",
			        innerDot: "#FF0000"
		        }
	        },
	        {
		        name: "Science Bitch!",
		        main:{
			        backgroundImage: "url('img/background2.jpg')"
		        },
		        hex: {
			        fill: "rgba(70,255,70,0.7)",
			        fillSharp: "rgba(221,255,68,0.5)",
			        border: "#FFFFFF",
			        text: "#FFFFFF",
			        innerDot: "#FFFFFF"
		        },
		        hexActive: {
			        fill: "#00FF00",
			        fillSharp: "#00FF00",
			        border:"#0000FF",
			        text: "#000000",
			        innerDot: "#000000"
		        }
	        },
	        {
		        name: "Color PeepShow",
		        main:{
			        backgroundImage: "url('img/background3.jpg')"
		        },
		        hex: {
			        fill: "rgba(255,255,255,0.8)",
			        fillSharp: "rgba(255,255,255,0.4)",
			        border: "#72BCD4",
			        text: "#000000",
			        innerDot: "#000000"
		        },
		        hexActive: {
			        fill: "rgba(255,105,180,0.4)",
			        fillSharp: "rgba(255,105,180,0.4)",
			        border:"#000000",
			        text: "#0000FF",
			        innerDot: "#0000FF"
		        }
	        },	{
		        name: "Splatter!",
		        main:{
			        backgroundImage: "url('img/background4.jpg')"
		        },
		        hex: {
			        fill: "rgba(255,10,0,0.6)",
			        fillSharp: "rgba(0,10,255,0.6)",
			        border: "#FFFFFF",
			        text: "#FFFFFF",
			        innerDot: "#FFFFFF"
		        },
		        hexActive: {
			        fill: "rgba(0,255,0,0.6)",
			        fillSharp: "rgba(0,255,0,0.6)",
			        border: "#000000",
			        text: "#000000",
			        innerDot: "#000000"
		        }
	        }

        ];
	});


