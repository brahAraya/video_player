class AutoPause {
	constructor() {
		this.threshold = 0.5;
		this.handlerIntersection = this.handlerIntersection.bind(this);
		this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
	}

	run(player) {
		this.player = player;

		const observer = new IntersectionObserver(this.handlerIntersection, {
			threshold: this.threshold,
		});

		observer.observe(this.player.media);

		document.addEventListener("visibilitychange", this.handleVisibilityChange);
	}

	handlerIntersection(entries) {
		const entry = entries[0];
		const visible = entry.intersectionRatio >= this.threshold;

		this.playIfVisible(visible);
	}

	handleVisibilityChange() {
		const visible = document.visibilityState === "visible";

		this.playIfVisible(visible);
	}

	playIfVisible(isVisible) {
		if (isVisible) {
			this.player.play();
		} else {
			this.player.pause();
		}
	}
}

export default AutoPause;
