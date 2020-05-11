class Resources {
    public static images: any = {};
    
    public static setImage(id: string, img: Object): void {
        this.images[id] = img;
    }
    
    public static getImage(id: string): HTMLImageElement | null {
        if (this.images[id] == undefined) return null;
        return <HTMLImageElement> this.images[id];
    }
    
    public static sounds(id: string) {
        createjs.Sound.play(id);
    }
    
    public static models: any[] = [];
    
}