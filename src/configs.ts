class Configs {
    public static resources: any[] = [
        {src:"img/man.png" , id:"man"},
        {src:"img/ground.png" , id:"ground"},
        {src:"img/bg.png" , id:"bg"},
        {src:"img/high.jpg" , id:"high"},
        {src:"img/coin.png" , id:"coin"},
        {src:"img/game.json" , id:"model"}
    ];
    
    public static sounds: Object[];
    
    public static width: number = window.innerWidth;
    
    public static height: number = window.innerHeight;
    
    public static stoneHeight: number = Math.floor(window.innerHeight / 4);	
}