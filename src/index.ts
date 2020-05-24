class App {
	public static main(arg: string | HTMLCanvasElement): Program {
		const app = new Program(arg);
		const setSize = () => {
			const box = (app.getStage().canvas as HTMLCanvasElement).parentElement;
			if (!box || box.nodeName === 'BODY') {
				app.setSize(window.innerWidth, window.innerHeight);
				return;
			}
			app.setSize(box.offsetWidth, box.offsetHeight);
		};
		app.setTouch();
		setSize();
		app.init();
		window.onresize = setSize;
		return app;
	}
}