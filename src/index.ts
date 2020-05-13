class App {
	public static main(arg: string | HTMLCanvasElement): Program {
		const app = new Program(arg);
		const setSize = () => {
			app.setSize(window.innerWidth, window.innerHeight);
		};
		app.setTouch();
		setSize();
		app.init();
		window.onresize = setSize;
		return app;
	}
}