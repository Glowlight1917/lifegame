	//キャンバスデータ
	var canvas = document.getElementById("canvas");

	//その他グローバル変数 
	var timer = null;
	var data = null;

	//デフォルトでボタンの有効化を設定
	disabling(false, true, true, false);

	//ボタンのイベント処理

	//Start
	document.controller.elements[0].onclick = function(){
		disabling(true, false, false, true);

		if(timer == null) data = init();
		if(data == null) return;
		timer = setInterval(function(){loop(data)}, 80);
	}

	//draw
	document.controller.elements[1].onclick = function(){
	}
	
	//stop
	document.controller.elements[2].onclick = function(){
		disabling(false, true, false, false);
		clearInterval(timer);
	}

	//reset
	document.controller.elements[3].onclick = function(){
		disabling(false, true, false, false);
		data = init();

		if(data == null) return;

		clearInterval(timer);
		timer = setInterval(function(){loop(data)}, 80);
		clearInterval(timer);
	}

	//formの有効化の制御
	function disabling(t0, t1, t2, t3){
		document.controller.elements[0].disabled = t0;	
		document.controller.elements[1].disabled = t1;	
		document.controller.elements[2].disabled = t2;	
		document.controller.elements[3].disabled = t3;	
	}

	function draw(data){
		var map = data["map"];
		var xn = data["xn"];
		var yn = data["yn"];
		var size = data["size"];
		var c = canvas.getContext("2d");

		for(y = 0; y < yn; y++){
			for(x = 0; x < xn; x++){
				if(map[y][x] == 1){
					c.fillStyle = "green";
					c.strokeStyle = "green";
				}else{
					c.fillStyle = "white";
					c.strokeStyle = "white";
				}	
				c.fillRect(size*x, size*y, size, size);
			}
		}
	}

	function loop(data){
		draw(data);
		calc(data);
	}

	//データの初期化
	function init(){
		var data = Object();
		data.size = 4;
		data.width = parseInt(canvas.width, 10);
		data.height = parseInt(canvas.height, 10);
		data.xn = data["width"] / data["size"];
		data.yn = data["height"] / data["size"];

		canvas.getContext("2d").fillStyle = "white";
		canvas.getContext("2d").fillRect(0, 0, data["width"], data["height"]);

		//初期条件を設定
		var temp = new Array(data["yn"]);
		for(var y = 0; y < data["yn"]; y++){

			temp[y] = new Array(data["xn"]);
			for(var x = 0; x < data["xn"]; x++){
				temp[y][x] = parseInt(2 * Math.random(), 10);
			}
		}

		data.map = temp;
		return data;
	}

	function calc(data){
		var map = data["map"];
		data.map = calcNext(data);
	}

	function count(data, x, y){
		var cnt = 0;
		var map = data["map"];
		var xn = data["xn"];
		var yn = data["yn"];

		for(var i = 0; i < 9 ; i++){
			var X = x + (i%3-1);
			var Y = (Math.floor(i/3)-1)+y;

			if (Y >=0 && Y < yn && X >=0 && X < xn && i != 4){
				if(map[Y][X] == 1) cnt +=1;
			}
		}

		return cnt;
	}

	function calcNext(data){
		var xn = data["xn"];
		var yn = data["yn"];
		var map = data["map"];

		var temp = new Array(yn);
		for(var y = 0; y < yn; y++){

			temp[y] = new Array(xn);
			for(var x = 0; x < xn; x++){
				temp[y][x] = map[y][x];

				if(map[y][x] == 0 && count(data,x,y) == 3){
					temp[y][x] = 1;
				}
		
				if(map[y][x] == 1 && count(data,x,y) != 2 && count(data,x,y) != 3){
					temp[y][x] = 0;
				}
			}
		}

		return temp;
	}
