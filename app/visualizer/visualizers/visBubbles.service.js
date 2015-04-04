angular
	.module('visualizerModule')
    .factory("VisBubbles", visBubblesFactory);

	visBubblesFactory.$inject = ['mathService', 'colorService', 'browserService'];

	function visBubblesFactory(mathService, colorService, browserService) {

		var balls = [];
		var totalBalls = browserService.isChrome ? 1000 : 100;

		var VisBubbles = function (ctx) {
			this.ctx = ctx;
			this.audioDB = 0;
			this.balls = [];
			for (var i = 0; i < totalBalls; i++) {
				balls.push(this.newBall());
			}
		};

		VisBubbles.prototype.draw = function() {
			var db = this.audioDB;
			for (var i = 0; i < balls.length; i++) {
				var ball = balls[i];
				ball.y -= (ball.yX * (1 + (db / 100)));
				ball.r -= (ball.rX * (1 + (db / 30)));
				if (ball.y + ball.r < -15 || ball.r < 0) {
					balls[i] = this.newBall();
				}
				else {
					this.ctx.beginPath();
					this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false);
					this.ctx.fillStyle = ball.color;
					this.ctx.fill();
					this.ctx.closePath();
				}
			}
		};
		VisBubbles.prototype.newBall = function() {
			return {
				x: mathService.randomNumber(0, this.ctx.canvas.width),
				y: this.ctx.canvas.height + 15,
				r: 15,
				yX: mathService.randomNumber(1, 5),
				rX: mathService.randomNumber(0.1, 2),
				color: colorService.randomRGB()
			};
		};

		return VisBubbles;

	}