class GameScene extends Scene {
    private _score!: createjs.Text;										//记录步数
    
    private _cat!: Sprite;
    
    private _container!: createjs.Container;
    
    private _circles!: Shape[][];
    
    private _status!: Game;
            
    public init(): void {
        super.init();
        this._status = Game.NONE;
        this._drawScence();
        this._drawScore();
        this._drawCat();
        this.setFPS(30);
    }
    
    private _drawScence(): void {
        this._container = new createjs.Container();
        this._container.x = 30;
        this._container.y = 70;
        this._circles = new Array();
        for (let i = 0; i < 9; i++) {
            this._circles[i] = new Array();
            for (let j = 0; j < 9; j++) {
                this._container.addChild( this._circles[i][j] = this._drawCircle(i, j));
                if (Math.random() < 0.1) {
                    this._circles[i][j].setStatus(Status.SELECTED);
                }
            }		
        }
        this.addChild(this._container);
    }
    
    private _drawCircle(x: number, y: number, arg: Status = Status.NONE) {
        let cirtle = new Shape(),
            point  = new Point(x, y);
        point.setPoint(cirtle);
        cirtle.setStatus(arg);
        cirtle.addEventListener('click', this._clickEvent.bind(this));
        return cirtle;
    }
    
    private _clickEvent(event: Event|any) {
        if (event.target.status != Status.NONE) {
            return;
        };
        this._score.text = (parseInt(this._score.text) + 1).toString();
        if (this._cat.point.x == 8 || this._cat.point.x == 0 || this._cat.point.y == 0 || this._cat.point.y == 8) {
            this._close();
        }
        event.target.setStatus(Status.SELECTED);
        let point = this._findPath();
        if (point) {
            this._moveCat(point);
        }
    }
    
    private _drawScore(): void {
        this._score = new createjs.Text( (0).toString() , 'bold 30px Courier New', '#ff0000');
        this._score.y = 50;
        this._score.x = 100
        this.addChild(this._score);
    }
    
    private _drawCat(): void {
        let spriteSheet = new createjs.SpriteSheet({
            'images': [Resources.getImage(CAT_IMG)],
            framerate: 15,
            frames: {
                regX: 0, 
                height: 93, 
                count: 16, 
                regY: 0, 
                width: 61
            },
            animations: {
                run: [0, 15, 'run', 0.5],
            }
        });
        this._cat = new Sprite(spriteSheet, 'run');
        let point = undefined;
        while (true) {
            point = new Point( Math.floor(Math.random() * 4) + 2, Math.floor(Math.random() * 4) + 2 );
            if (this._circles[point.x][point.y].status == Status.NONE) {
                break;
            }
        }
        this._cat.point = point;
        this._cat.point.kind = Kind.CAT;
        this._cat.setPoint();
        this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.USED);
        this._container.addChild(this._cat);	
    }
    
    private _findPath() {
        console.log('=====开始检测=====');		
        
        let points = Array(),   //已经看过的点；
            start = Array();
        for (let i = 0; i < 9; i++) {
            if(this._circles[0][i].status != Status.SELECTED) {
                start.push(new Point(0,i));				
                points.push(new Point(0,i));				
            }
            if(this._circles[8][i].status != Status.SELECTED) {
                start.push(new Point(8,i));				
                points.push(new Point(8,i));				
            }
        }
        for (let i = 0; i < 8; i++) {
            if(this._circles[i][0].status != Status.SELECTED) {
                start.push(new Point(i,0));				
                points.push(new Point(i,0));				
            }
            if(this._circles[i][8].status != Status.SELECTED) {
                start.push(new Point(i,8));				
                points.push(new Point(i,8));				
            }
        }
        
        while (this._status == Game.NONE) {                              //从外面向里面检测是否有逃生点；
            let nexts = Array();
            for (let i = 0, len = start.length; i < len; i++) {
                let p = start[i];
                for (let j = 0; j < 6; j ++) {
                    let tem = this._getNextPoint(p, j);
                    if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
                        continue;
                    }
                    if(this._circles[tem.x][tem.y].status == Status.USED) {
                        return p;
                    }
                    if(this._circles[tem.x][tem.y].status == Status.SELECTED) {
                        continue;
                    }
                    let b = false;
                    for (let m = 0, leng = points.length; m < leng; m++) {
                        if(tem.x == points[m].x && tem.y == points[m].y) {
                            b = true;								
                            break;
                        };
                    };
                    
                    if(b) {
                        continue;
                    }
                    points.push(tem);
                    nexts.push(tem);
                }
            }
            
            
            start = nexts;
            if(start.length <= 0) {
                this._status = Game.SURROUND;
                let spriteSheet = new createjs.SpriteSheet({
                    framerate: 15,
                    images: [Resources.getImage(CATED_IMG)],
                    frames: {
                        regX: 0, 
                        height: 91, 
                        count: 15, 
                        regY: 0, 
                        width: 64
                    },
                    animations: {
                        run: [0, 14, 'run', 0.5],
                    }
                });				
                this._cat.spriteSheet = spriteSheet;
                break;
            }
        }
        
        console.log('=====围住=====');
        
        points = Array();
        start = Array();
        for (let i = 0; i < 6; i++) {
            let tem = this._getNextPoint(this._cat.point, i);
            if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
                continue;
            };
            if(this._circles[tem.x][tem.y].status == Status.SELECTED) {
                continue;
            }
            tem.startPoint = tem;
            start.push(tem);
            points.push(tem);
        }
        
        if(start.length <= 0) {
            this._status = Game.END;
            this._close(true);
        }
        
        while (this._status == Game.SURROUND) {
            let nexts = Array();
            for (let i = 0; i < start.length; i++) {
                let p = start[i];
                for (let j = 0; j < 6; j ++) {
                    let tem = this._getNextPoint(p, j );
                    if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
                        continue;
                    };
                    if(this._circles[tem.x][tem.y].status == Status.USED) {
                        continue;
                    };
                    if(this._circles[tem.x][tem.y].status == Status.SELECTED) {
                        continue;
                    }
                    let b = false;
                    for (let m = 0, len = points.length; m < len; m++) {
                        if(tem.x == points[m].x && tem.y == points[m].y) {
                            b = true;							
                            break;
                        };
                    };
                    if(b) {
                        continue;
                    };
                    tem.startPoint = p.startPoint;					
                    nexts.push(tem);
                    points.push(tem);				
                }
            }
            
            if (nexts.length <= 0) {
                return start[0].startPoint;
            }
            start = nexts;
        }
    }
    
    private _moveCat(point: Point) {
        this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.NONE);		
        this._cat.point.x = point.x;
        this._cat.point.y = point.y;
        this._cat.setPoint();
        this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.USED);			
    }
    
    private _getNextPoint(p: Point, dire: Direction = Direction.LEFT) {
        let point = new Point(p.x, p.y);
        point.kind = p.kind;
        switch (dire) {
            case Direction.LEFT:
                point.x --;
                break;
            case Direction.LEFTTOP:
                if(point.y % 2 == 0) {
                    point.x --;										
                }
                point.y --;
                break;
            case Direction.RIGHTTOP:
                if(point.y % 2 == 1) {
                    point.x ++;										
                }
                point.y --;
                break;
            case Direction.RIGHT:
                point.x ++;
                break;
            case Direction.RIGHTBOTTOM:
                if(point.y % 2 == 0) {
                    point.x --;										
                }
                point.y ++;
                break;
            case Direction.LEFTBOTTOM:
                if(point.y % 2 == 1) {
                    point.x ++;										
                }
                point.y ++;
                break;
            default:
                break;
        }
        return point;	
    }
    
    private _close(arg: boolean = false) {
        this.navigate(new EndScene(), this._score.text, arg);
    }
}

