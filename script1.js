
	anychart.onDocumentReady(function(){
	stage = acgraph.create('game_box');
	var firstLayer = acgraph.layer();
	firstLayer.parent(stage);
	var rectangle = firstLayer.rect(0, 0, stage.width(), stage.height());
	var ew =0;
	var eb = 0;
	var flag = 1;
	var height = 640;
	var width = 640;
	
	//������ ����
	for (var j=0; j<8; j++){
			for(var i=0; i<8; i++){
				var rect = firstLayer.rect(
				width/10*(i),
				height/10*(j),
				width/10,
				height/10
				);
				if((i+j)%2!=0){
					rect.fill("#000000");
				}
				else{
					rect.fill("#FFFFFF");
				}
			}	
		}
	
// ����������� ��� �������� �����	
	function Checker(x,y, team ){
		
		this.figure = stage.circle(
		(width/10*(x)+width/20),   //x
		(height/10*(y)+height/20), //y
		height/24);						//r

		if(team == "white"){
			this.FILL = "white";
			this.notFILL = "#C9CCCA";
			this.strokeFILL = "black";
			this.figure.dir = 1;
			
		}
		if (team == "black"){
			this.FILL = "black";
			this.notFILL = "#7E7E7F";
			this.strokeFILL = "white";
			this.figure.dir = -1;
		}
		
		this.team = team;
		
		this.figure.FILL = this.FILL;
		this.figure.notFILL = this.notFILL;
		this.figure.fill(this.FILL);
		this.figure.KingFill = this.KingFill;
		this.figure.stroke(this.strokeFILL,2);
		this.figure.drag(rectangle.getBounds());
		this.figure.cursor("hand");
		this.figure.radius =height/24 ;
		this.figure.x_old = x;
		this.figure.y_old = y;
		this.figure.x_pos = x;
		this.figure.y_pos = y;
		this.figure.team = team;
		this.figure.isKing = false;
		
		
// ������� ��� ������������ �����
		acgraph.events.listen(this.figure, acgraph.events.EventType.DRAG_END, function (e) {
			this.y_pos =Math.floor((this.getY()+this.radius)/(height/10));
			this.x_pos =Math.floor((this.getX()+this.radius)/(width/10) );
			
			check_moving_checker(this);
			this.fill(this.FILL);
			
		});
// ������� ��� ������� �� �����		
		acgraph.events.listen(this.figure, acgraph.events.EventType.MOUSEDOWN, function (e) {
			this.fill(this.notFILL);
			
			if(this.isKing){
				console.log( one_more_course_for_king(this));
			}
			else {
					console.log(one_more_course_for_checker(this));
			}
			
		});
		
	}
//�������� ������������ ����
var check_moving_checker= function(fig){
	// ���� ��������� ����������� �����: ���������� flag=1, � ����� dir=1, � ������ dir = -1, ����� ������� ���� flag = flag*(-1)
	if (flag*fig.dir==1){
			// x_pre � y_pre  - ���������� ��������� ������, ����� ������� ���� ���������� ������� ������
			if (fig.x_pos-fig.x_old > 0){
				x_pre = -1; 
			}
			else{
				x_pre = 1;
			}
			if(fig.y_pos-fig.y_old > 0){
				y_pre = -1;
			}
			else{
				y_pre = 1;
			}
			
			var x = fig.x_pos+x_pre; 
			var y = fig.y_pos+y_pre; 
			var delta_x = fig.x_pos-fig.x_old;
			var delta_y = fig.y_pos-fig.y_old;
		
			// ���� �� ������� �� ������� ������� � ��� ����������� �� ��������� � �� ������ ������
			if ((Math.abs(delta_x) == Math.abs(delta_y))&&(fig.x_pos>=0)&&(fig.x_pos<8)&&(fig.y_pos>=0)&&(fig.y_pos<8)&&(Board[fig.x_pos][fig.y_pos]==0)){
				//���� �������� �� ��� �� ������		
				if(Math.abs(delta_x)==0){
					set_old_position(fig);
					console.log("������������ ���");
				}
				//����  ������������� �� ���� ������ 
				else if(Math.abs(delta_x)==1){
					//���� ���������� ����� � ���������� ����������� � �� ��������� ������
					if ((delta_x==1||delta_x==-1)&&(delta_y == fig.dir)){
							// ���� ��� ����������� ������ ����� - ��������� 
							if(!eat_avaliable()){
								moving(fig);
								console.log("������� ���");
							}
							else{
								set_old_position(fig);
								console.log("���������� ������ ��� 1!");
							}
					}
					else{
						set_old_position(fig);
						console.log("������������ ��� (��� 3)");
					}
				}
				//���� ������������ �� 2 ������ �� ��������� ������ ��� ������
				else if(Math.abs(delta_x)==2){
					// ���� ������������ ����� �����
					if(Board[x][y]!=0){
					
						// ���� �����, ����� ������� ������������ - �����-���������
						if (Board[x][y].figure.dir==fig.dir*(-1)){
							eating(Board[x][y]);
							moving(fig);
							if(fig.isKing){
								if(one_more_course_for_king(fig)){
									flag = flag*(-1);
								}
							}
							else {
								if (one_more_course_for_checker(fig)){
									flag = flag * (-1);
								}
							}
							console.log("���������� ������� ������ ");
						}
						// ����� - ����, �����������
						else{
							set_old_position(fig);
							console.log("������� ������ ������");
						}
					}
					// ���� ������������ ����� ������ ������ ������
					else if (Board[x][y]==0 && fig.isKing){
						if(!eat_avaliable()){
								moving(fig);
								console.log("��� ������");
							}
							else{
								set_old_position(fig);
								console.log("���������� ������!");
							}
					}
					else {
						set_old_position(fig);
						console.log("������������ ��� (��� 4)");
					}
					
				}
				// ���� ������������ ������ 
				else if( Math.abs(delta_x)>2 && fig.isKing == true  ){
					// ���� ��������� �����		
					if (check_king_moving(fig, x_pre, y_pre, delta_x)){
						//���� ���������� ������ �� ����� 
						if (Board[x][y]!=0){
							//���� �� ���������� ������  �����-���������
							if (Board[x][y].figure.dir==fig.dir*(-1)){
								eating(Board[x][y]);
								moving(fig);
								
								if(one_more_course_for_king(fig)){
									flag = flag*(-1);
								}
							}// ���� �� ����� ���������, �� ����, �����������
							else{
								set_old_position(fig);
								console.log("������� ������ ������!");
							}
						
						}
						// ���� ����� �� ������� �����������
						else{
							if(!eat_avaliable()){
								moving(fig);
								console.log("��� ������");
							}
							else{
								set_old_position(fig);
								console.log("���������� ������!");
							}
						
						}
						
					}
					else {
							set_old_position(fig);
							console.log("������������ ��� ������");
					}
				}
				else{
					set_old_position(fig);
					console.log("������������ ��� (��� 2)");
				}
			}
			else{
				set_old_position(fig);
				console.log("������������ ��� (����� �� ������� ���� ��� ��� �� ������� ������)");
			}
	}
	else {
		set_old_position(fig);
		console.log("�� ��� ���!");
	}
};

//������������ �����
	var moving = function(fig){
		
		Board[fig.x_pos][fig.y_pos] = Board[fig.x_old][fig.y_old];
		Board[fig.x_old][fig.y_old] = 0;
		fig.setPosition(
				(width/10*(fig.x_pos)+width/120), //x
				(height/10*(fig.y_pos)+height/120)//y
				);
		
		if(fig.y_pos == 7 && fig.dir == 1){
			fig.isKing = true;
			fig.FILL = "#FFDBC6";
			fig.fill(fig.FILL);
		}
		if (fig.y_pos == 0 && fig.dir == -1){
			fig.isKing = true;
			fig.FILL = "#5E2E27";
			fig.fill(fig.FILL);
		}
		
		fig.x_old = fig.x_pos; 
		fig.y_old = fig.y_pos;
		flag = flag*(-1);
		
		};
//��������
	var eating = function(Checker){
		
		if( Checker.team == "white"){
		
			Checker.figure.setPosition(
				(width/10*9+width/120), //x
				(10*ew+height/120)//y
				);
			ew++;
		}
		else{
			Checker.figure.setPosition(
				(width/10*9+width/120), //x
				(height/10*7+(-10*eb)+height/120)//y
				);
			eb++
		}
			
		Board[Checker.figure.x_old][Checker.figure.y_old] = 0;
		
		
	}
//������� ����� �� �������� ������� ��� ������������ ����
	var set_old_position = function(fig){
		fig.setPosition(
				(width/10*(fig.x_old)+width/120), //x
				(height/10*(fig.y_old)+height/120)//y
				);
	}
// �������� ������� ��� ������ ���� ��� �����
	var one_more_course_for_checker = function(fig){
		var bool =false;
		var x = fig.x_old;
		var y = fig.y_old;
		
			if ( x-2>=0 && y+2<=7 && Board[x-1][y+1] != 0 ){
				
				if( Board[x-1][y+1].figure.dir==fig.dir*(-1) && Board[x-2][y+2]==0){
					bool = true;
				}
			}
			if( x-2>=0 && y-2>=0 && Board[x-1][y-1] != 0){
				if( Board[x-1][y-1].figure.dir==fig.dir*(-1) && Board[x-2][y-2]==0){
					bool = true;
				}
			}
			if( x+2<=7 && y+2<=7 && Board[x+1][y+1] != 0){
				if( Board[x+1][y+1].figure.dir==fig.dir*(-1) && Board[x+2][y+2]==0){
					bool = true;
				}
			}
			if( x+2<=7 && y-2>=0 && Board[x+1][y-1] != 0){
				if( Board[x+1][y-1].figure.dir==fig.dir*(-1) && Board[x+2][y-2]==0){
					bool = true;
				}
			}
			//console.log(bool);
			return bool;  
		
	}
//////////////////////////////////////////////////
// �������� dop-function ��� ������� �����������
	var one_more_course_for_king = function(fig){
		var bool1=dop_function(fig, -1, 1);
		var bool2=dop_function(fig, 1, -1);
		var bool3=dop_function(fig, 1, 1);
		var bool4=dop_function(fig, -1, -1);
		return bool1||bool2||bool3||bool4;
	}
////////////////////////////////////////////////////////////////////////
// ���������� true ����  � ��������� ����������� �������� ������ �����-���������
	var dop_function = function(fig, dir_x, dir_y){
		var bool = false;
		var x= fig.x_old;
		var y= fig.y_old;
		
		for(var z=1;z<7; z++){
			//���� �� ������� �� ������� �������
			if(x+dir_x*(z+1)>=0 && x+dir_x*(z+1)<=7 && y+dir_y*(z+1)>=0 && y+dir_y*(z+1)<=7){
			
				if (Board[x+dir_x*z][y+dir_y*z]!=0){
					if(Board[x+dir_x*z][y+dir_y*z].figure.dir == (-1)*fig.dir){
						if(Board[x+dir_x*(z+1)][y+dir_y*(z+1)]==0){
							bool =true;
							break;
						}
						else{
							console.log("����� 3");
							break;
						}
					}
					else{
						console.log("����� 2");
						break;
					}
				}
	
			}
			// ����� 
			else {
				console.log("����� 1");
				break;
			}
				
		}
		
		return bool;
		
	}
/////////////////////////////////////////////////////////////////////////
//�������� ������� ����������� ������ ����� ��������� ������� ��������
	var eat_avaliable = function(){
		var eatable = false;
		//���� ���� =1 �� ��������� ���� ����� �����
		for (var j=0; j<8; j++){
			for(var i=0; i<8; i++){
				if(Board[i][j]!=0 && !Board[i][j].figure.isKing ){
					
					if ((flag == 1) && (Board[i][j].team == "white") && (one_more_course_for_checker(Board[i][j].figure))){
					eatable = true;
					break;
					}
					if ((flag == -1) && (Board[i][j].team == "black") && (one_more_course_for_checker(Board[i][j].figure))){
					eatable = true;
					break;
					}
				}
				else if(Board[i][j]!=0 && Board[i][j].figure.isKing ){
					if ((flag == 1) && (Board[i][j].team == "white") && (one_more_course_for_king(Board[i][j].figure))){
						eatable = true;
						break;
					}
					if ((flag == -1) && (Board[i][j].team == "black") && (one_more_course_for_king(Board[i][j].figure))){
						eatable = true;
						break;
					}
					
				}
			}
				
			
		}
		
		return eatable;
	} 
/////////////////////////////////////////////////////////////////////////////////////////////////////	
// �-� ��� �������� ���� ������, true ���� ��������� ����� ��������� ������ ������
	var check_king_moving = function(fig, x_dir, y_dir, delta){
		var bool = true;
		
		for(var i=1;i<delta-1; i++){
			if(Board[fig.x_old - x_dir*(i)][fig.y_old-y_dir*(i)]!=0){
				bool=false;
			}
		}
		return bool;
	}

/////////////////////////////////////////////////////////////////////////////////
		//var l = new Checker(50,50);
		var Board = new Array();
		
		
		for ( i = 0; i<8; i++){
			Board[i] = new Array();
			for ( var j = 0; j<8; j++){
				if(j<3){
					if((i+j)%2!=0 ){
						Board[i][j] = new Checker (i,j,"white");
					}
					else{
						Board[i][j] = 0;
					}
				
				}
				else if(j>4){
					if((i+j)%2!=0 ){
						Board[i][j] = new Checker (i,j,"black");
					}
					else{
						Board[i][j] = 0;
					}
				}
				else{
					Board[i][j] = 0;
				}	
			}
		}
////////////////////////////////////////////////////////////////////////////
	var print_Board = function(){
			for ( i = 0; i<8; i++){
				for ( var j = 0; j<8; j++){
					console.log(Board[i][j]);
				}
			}
		}
		
		
		
	}
	)
	
