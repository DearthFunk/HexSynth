angular.module('mathServiceModule', [])
    .service("mathService", function(){
        var mathServiceScope = this;


		mathServiceScope.randomNumber = function(from,to,decimals) {
			if (decimals != undefined) {
				return (Math.random()*(Number(to)-Number(from))+Number(from)).toFixed(decimals);
			}
			else {
				return Math.random()*(to-from)+from;
			}
		};

		mathServiceScope.roundedNumber = function(value, precision) {
			var precision = precision || 0,
				neg = value < 0,
				power = Math.pow(10, precision),
				value = Math.round(value * power),
				integral = String((neg ? Math.ceil : Math.floor)(value / power)),
				fraction = String((neg ? -value : value) % power),
				padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
			return parseFloat(precision ? integral + '.' +  padding + fraction : integral);
		}
		
    });

