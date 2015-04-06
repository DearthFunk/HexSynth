angular
	.module('visualizerModule')
    .factory('VisScope', visScopeFactory);

	visScopeFactory.$inject = [];

	function visScopeFactory() {

		var VisScope = function () {
			this.audioData = [];
		};

		VisScope.prototype.draw = function() {
			if (this.ctx) {
				var barWidth = this.ctx.canvas.width / this.audioData.length;
				this.ctx.beginPath();
				this.ctx.lineWidth = 12;
				this.ctx.lineCap = 'round';
				this.ctx.lineJoin = 'round';
				this.ctx.strokeStyle = '#FFFFFF';

				for (var i = 0; i < this.audioData.length; i++) {
					var percent = this.audioData[i] / 256;
					var percent2 = this.audioData[i + (i < this.audioData.length ? 1 : 0)] / 256;
					var height = this.ctx.canvas.height * percent;
					var height2 = this.ctx.canvas.height * percent2;
					var offset = this.ctx.canvas.height - height;
					var offset2 = this.ctx.canvas.height - height2;
					this.ctx.moveTo(i*barWidth,offset);
					this.ctx.lineTo(i*barWidth+barWidth,offset2);
				}
				this.ctx.stroke();
				this.ctx.closePath();
			}
		};

		return VisScope;
	}