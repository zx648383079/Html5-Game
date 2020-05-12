class App {
	public static main(arg: string | HTMLCanvasElement): Program {
		const app = new Program(arg);
		app.setTouch();
		app.setSize(Configs.width, Configs.height);
		app.init();
		return app;
	} 
}