"use strict";
/*

	idea: 
	
	strategy
		- Always cooperate 
		- Always defect		
		- Cooperate from beginning, then copy last opponent's move 	(TIT FOR TAT)
		- Cooperate from beginning, when opponent defects, defect always (GRUDGER)
		- TIT FOR THAT with random defections (JOSS)
		- TIT FOR THAT, forgiving one opponent defection (FORGIVING TIT FOR TAT)
		- RANDOM
	
	
	points
		
				A		B
			
		A		3	|	5
			3		|0
			------------------
		B		0	|	1
			5		|1
			
			
	playworld:
		-n amount of players, each one with one given strategy.
		-random collisions (everyone involved)
				-play a number_of_games_to_play round game of prisoners dilemma
				-get points
		-after number_of_confrontations amount of collisions the best surviver_percent percent of players survive
	
	--------------------------------------------------------------------------------|
	implementation:
	
	class playworld
		list of all player-objects
		attributes:
			number_of_players
			number_of_games_to_play		//rounds
			number_of_confrontations	//
			surviver_percent
			
	class player
		attributes:
			strategy_name
			points_total
		
	global 
		points for coop/defection (see 'points')

*/

var ps_main = (function(){
    
    var COP = "cooperation";
    var DEF = "defection";
    var JOSS_PROBABILITY = 0.5;
    var RANDOM_PROBABILITY = 0.5;
    var ALWAYS_COOPERATE = "Always Cooperate";
    var ALWAYS_DEFECT = "Always Defect";
    var TIT_FOR_TAT = "Tit For Tat";
    var GRUDGER = "Grudger";
    var JOSS = "Joss";
    var FORGIVING_TIT_FOR_TAT = "Forgiving Tit For Tat";
    var RANDOM = "Random";
    var SUSPICIOUS_TIT_FOR_TAT = "Suspicious Tit For Tat";
    var PAVLOV = "Pavolv";
    var REVERSE_TIT_FOR_TAT = "Reverse Tit For Tat"
    var HANDSHAKE = "Handshake";
    var play_world;
    var set_up_boolean = false;
    var running = false;
    var results_showing = false;
    var prob_values = [];
    var id_g = 0;
    var thread;
    var generation_counter = 0;
    var tab = "&emsp;&emsp;";
    var STRATEGYS = [ ALWAYS_COOPERATE , ALWAYS_DEFECT , TIT_FOR_TAT , GRUDGER , JOSS , 
                     FORGIVING_TIT_FOR_TAT , RANDOM, SUSPICIOUS_TIT_FOR_TAT, PAVLOV, REVERSE_TIT_FOR_TAT, HANDSHAKE];
    var NUMBER_STRATEGYS = STRATEGYS.length;
    var NUMBER_PLAYERS = 100;
    var EVOL_MODE = false;
    
    
    

    var buttons_elem = document.getElementsByClassName('myDesign');
    for(var i = 0; i < buttons_elem.length-1; i ++){ //-1 because I don't want the 'result button' to change
            console.log(buttons_elem[i].id);
            buttons_elem[i].addEventListener("mouseover",mouse_over_event);
            buttons_elem[i].addEventListener("mouseout",mouse_out_event);
    }

    

    class Play_world{
        constructor(number_players, number_games,number_confrontations,survivor_percent){
            this.number_players = number_players;
            this.number_games = number_games;
            this.number_confrontations = number_confrontations;
            this.survivor_percent = survivor_percent;

            this.players = [];

            id_g = 0;

            for(; id_g < number_players; id_g ++){
                var p = new Player(id_g);
                this.players.push(p);
            }

        }
        
        play(player_1, player_2){

            var p1_move = this.get_move(player_1,player_2);
            var p2_move = this.get_move(player_2,player_1);

            var p1p = 0;
            var p2p = 0;

            player_1.last_moves.push(p1_move);
            player_2.last_moves.push(p2_move);
        
            
            if(p1_move == COP && p2_move == COP){
                p1p = 3;
                p2p = 3;
            }else if(p1_move == COP && p2_move == DEF){
                p1p = 0;
                p2p = 5;
            }else if(p1_move == DEF && p2_move == COP){
                p1p = 5;
                p2p = 0;
            }else if(p1_move == DEF && p2_move == DEF){
                p1p = 1;
                p2p = 1;
            }

            player_1.old_points = player_1.points;
            player_2.old_points = player_2.points;
            
            player_1.points += p1p;
            player_2.points += p2p;

        }


        get_move(p1,p2){

            var m1 = p1.last_moves;
            var m2 = p2.last_moves;
            
            switch (p1.strategy_name){
                case STRATEGYS[0]:
                    return this.s_always_coop();
                case STRATEGYS[1]:
                    return this.s_always_def();
                case STRATEGYS[2]:
                    return this.s_tit_for_tat(m2);
                case STRATEGYS[3]:
                    return this.s_grudger(m2);
                case STRATEGYS[4]:
                    return this.s_joss(m2);
                case STRATEGYS[5]:
                    return this.s_forg_tft(m2);
                case STRATEGYS[6]:
                    return this.s_random();
                case STRATEGYS[7]:
                    return this.s_susp_tft(m1,m2);
                case STRATEGYS[8]:
                    return this.s_pavlov(p1,m1);
                case STRATEGYS[9]: 
                    return this.s_rev_tft(m2);
                case STRATEGYS[10]:
                    return this.s_handshake(m1,m2);
            }
        }

        
        s_always_coop(){return COP;}
        
        s_always_def(){return DEF;}
        
        s_tit_for_tat(m2){if(m2.length == 0 || m2[m2.length-1] == COP)return COP;return DEF;}
        
        s_grudger(m2){if(m2.length == 0 || !this.contains(m2,DEF))return COP;return DEF;}
        
        
        s_joss(m2){
            if(m2.length == 0 || m2[m2.length-1] == COP){
                if(Math.random() < JOSS_PROBABILITY){
                    return COP;
                }
            }
            return DEF;            
        }
        
        s_forg_tft(m2){
            if(m2[m2.length-2] == DEF && m2[m2.length-1] == DEF)return DEF;return COP;            
        }
        
        s_random(){if(Math.random() < RANDOM_PROBABILITY)return COP;return DEF;}
        
        s_susp_tft(m1,m2){
            if(m2.length == 0 || m1.length == 0)
                return DEF;
            else if(m2[m2.length-1] == COP)
                return COP;
            return DEF;            
        }
        
        s_pavlov(p1,m1){
            if(m1.length > 0){
                var lr = m1[m1.length-1];
                if(p1.points >= p1.old_points+3)
                    return lr;
                else{
                    if(lr==COP)return DEF;return COP;
                }
            }
            return COP;            
        }
        
        s_rev_tft(m2){
            if(this.s_tit_for_tat(m2) == COP)return DEF; return COP;
        }

        
        s_handshake(m1,m2){
            if(m1.length == 0)
                return COP;
            if(m1.length == 1)
                return DEF;
            if(m1.length > 1 && m2[0] == COP && m2[1] == DEF)
                return COP;
            else return DEF;
        }

        one_game(){
            for(var i = 0; i < this.players.length; i ++){
                if(this.players[i].in_match == 0){
                    this.players[i].in_match = 1;

                    var r = random(0,this.players.length-1);
                    while(this.players[r].in_match == 1 || r == i){
                        r = random(0,this.players.length-1);
                    } 
                    this.players[r].in_match = 1;

                    for(var z = 0; z < this.number_games; z ++){
                        this.play(this.players[i],this.players[r]);
                    }		
                }

            }
            
            for(var i = 0; i < this.players.length; i ++){
                this.players[i].old_last_moves = this.players[i].last_moves;
                this.players[i].last_moves = [];
                this.players[i].in_match = 0;
            }
        }


        one_generation(){
            for(var i = 0; i < this.number_confrontations; i ++){
                this.one_game();
            }
            this.sort();


            var survivors = this.players.length * this.survivor_percent;
            this.players.splice(survivors);


            /*
                2 modes:
                    1. nobody dies, no new players
                    2. players give birth to new players and die 

            */
        }




        contains(list,elem){
            for(var i = 0; i < list.length; i ++){
                if(list[i] == elem){
                    return true;
                }
            }
            return false;
        }


        sort(){
            this.players.sort(
                    function(p1,p2){
                        if(p1.points >= p2.points){
                            return -1;
                        }else return 1;				
                }
                );
        }


        get_average(){
            var sum = 0;
            for(var i = 0; i < this.players.length; i ++){
                sum += this.players[i].points;
            }
            return (sum/this.players.length).toFixed(2);
        }

        get_highest(){
            return Math.max.apply(Math,this.players.map(function(p){return p.points;}));
        }


        get_lowest(){
            return Math.min.apply(Math,this.players.map(function(p){return p.points;}));
        }
        
        
        get_points_per_strategy(){
            var slist = [];
            var plist = [];
            for(var i = 0; i < NUMBER_STRATEGYS; i ++){
                slist.push(0);
                plist.push(0);
            }
            for(var i = 0; i < this.players.length; i ++){                
                switch(this.players[i].strategy_name){
                    case STRATEGYS[0]:
                        slist[0] += this.players[i].points;
                        plist[0]++;
                        break;
                    case STRATEGYS[1]:
                        slist[1] += this.players[i].points;
                        plist[1]++;
                        break;
                    case STRATEGYS[2]:
                        slist[2] += this.players[i].points;
                        plist[2]++;
                        break;
                    case STRATEGYS[3]:
                        slist[3] += this.players[i].points;
                        plist[3]++;
                        break;
                    case STRATEGYS[4]:
                        slist[4] += this.players[i].points;
                        plist[4]++;
                        break;
                    case STRATEGYS[5]:
                        slist[5] += this.players[i].points;
                        plist[5]++;
                        break;
                    case STRATEGYS[6]:
                        slist[6] += this.players[i].points;
                        plist[6]++;
                        break;
                    case STRATEGYS[7]:
                        slist[7] += this.players[i].points;
                        plist[7]++;
                        break;
                    case STRATEGYS[8]:
                        slist[8] += this.players[i].points;
                        plist[8]++;
                        break;
                    case STRATEGYS[9]:
                        slist[9] += this.players[i].points;
                        plist[9]++;
                        break;
                    case STRATEGYS[10]:
                        slist[10] += this.players[i].points;
                        plist[10]++;                    
                }
            }
            
            return{
                points_per_strategy: slist,
                players_per_strategy: plist
            };
        }
    }
                    
    class Player{

        constructor(id,strategy){

                this.id = id;
                if(strategy === undefined){
                    this.strategy_name = this.new_prob();
                    if(this.strategy_name == null){
                        var r = random(0,NUMBER_STRATEGYS-1);
                        this.strategy_name = STRATEGYS[r];
                    }
                }else{
                    this.strategy_name = strategy;
                }

                this.points = 0;	
                this.old_points = 0;
                this.in_match = 0;
                this.last_moves = [];
                this.old_last_moves = [];
        }

        new_prob(){
            
            
            function sum_vals(i){
                var sum = 0;
                for(var j = 0; j <= i; j ++){
                    sum += prob_values[j]
                }
                return sum;
            }

            if(prob_values == null || prob_values.length == 0)
                return null;

            
            var r = random(0,99);

            if(r < prob_values[0])
                return STRATEGYS[0];
            if(r >= prob_values[0] && r < sum_vals(1))
                return STRATEGYS[1];
            if(r >= sum_vals(1) && r < sum_vals(2))
                return STRATEGYS[2];
            if(r >= sum_vals(2) && r < sum_vals(3))
                return STRATEGYS[3];
            if(r >= sum_vals(3) && r < sum_vals(4))
                return STRATEGYS[4];
            if(r >= sum_vals(4) && r < sum_vals(5))
                return STRATEGYS[5];
            if(r >= sum_vals(5) && r < sum_vals(6))
                return STRATEGYS[6];
            if(r >= sum_vals(6) && r < sum_vals(7))
                return STRATEGYS[7];
            if(r >= sum_vals(7) && r < sum_vals(8))
                return STRATEGYS[8]; 
            if(r >= sum_vals(8) && r < sum_vals(9))
                return STRATEGYS[9];  
            if(r >= sum_vals(9) && r < sum_vals(10))
                return STRATEGYS[10];
        }
    }

    /*
     * Returns a random integer between min (inclusive) and max (inclusive)
    */
    function random(min,max){
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    function run(){
        if(running && play_world.players.length >= 10){
            play_world.one_generation();
            generation_counter++;
            update_counter();
            print_players();
            thread = setTimeout(run,0);
        }else{
            return;
        }
    }

    function print_players(){

        clean_up();

        var players_table = [];
        var sub_table = [];

        for(var i = 0; i < play_world.players.length; i ++){
            sub_table = [play_world.players[i].id,play_world.players[i].strategy_name,play_world.players[i].points];
            players_table.push(sub_table);
        }

        createHTML.create_table("results_generation_table",document.getElementById('all'),3,play_world.players.length,players_table);
    }

    function clean_up(){
        
        close_results();
        
        var table = document.getElementById("results_table");
        if(table != null)
            document.getElementById("all").removeChild(table);

        var canvas = document.getElementById("canvas");
        if(canvas != null)
            document.getElementById("all").removeChild(canvas);

        table = document.getElementById("results_generation_table");
        if(table != null)
            document.getElementById("all").removeChild(table);
        

    }

    
    function update_counter(){
        document.getElementById('counter_div').innerHTML = "Players: "+play_world.players.length + "<br>Generations: "+ generation_counter;
    }
    
    
    function close_results(){
        document.getElementById('results').innerHTML = "";
        document.getElementById('results').className = "";
        results_showing = false;
    }
    
    
    //******************************************************************************************************************************************//
    //Explaination / Commentary functions                                                                                         //
    //******************************************************************************************************************************************//    
    function mouse_over_event(e){
        var des = "";
        switch(e.target.id){
            case "one_round_button":
                des = "(One turn between randomly selected agents)";
                break;
            case "one_match_button":
                des = "(Ten turn between randomly selected agents)";
                break;
            case "set_up_button":
                des = "(Set up a pool of agents)";
                break;
            case "one_generation_button":
                des = "(Run one generation (100 matches) of the pool-population)";
                break;
            case "just_run_button_id":
                des = "(Run non-stop generations of the pool-population)";
                break;
        }
        createHTML.create_description_box(e.target,"id",des);
    }
    
    
    function mouse_out_event(e){
        createHTML.del("id");
    }
    
    //******************************************************************************************************************************************//
    //public functions                                                                                                                          //
    //******************************************************************************************************************************************//
    return{
        
        get_NUMBER_STRATEGYS: function(){
            return NUMBER_STRATEGYS;
        },
        
        open_options: function(){
            window.open('options.htm','Options','width=600,height=document.body.innerHeight,scrollbars=yes');
        },
           
        results: function(){
            if(!results_showing){
                if(set_up_boolean && play_world != null){
                    if(!running){
                        
                        var pps = play_world.get_points_per_strategy().points_per_strategy
                        var pyps = play_world.get_points_per_strategy().players_per_strategy;
                        

                        var space = "<br><br><br>";        
                        var results_div = document.getElementById('results');
                        results_div.className = "myDiv";
                        results_div.innerHTML = space +"<h3>Stats for each Player:</h3>"+tab+"Average points: " + play_world.get_average()
                                                                    + "<br>"+tab+"Max points: "+play_world.get_highest()
                                                                    + "<br>"+tab+"Min points: "+play_world.get_lowest()
                                                                    + space+"<h3>Player per strategy:</h3><br>"+
                                                                    (function(){
                                                                        var str = "";
                                                                        for(var i = 0; i < NUMBER_STRATEGYS; i ++)
                                                                            str += tab+STRATEGYS[i]+": "+pyps[i]+"<br>";
                                                                        return str;
                                                                    })();                        
                        
                        
                        
                        createHTML.create_div(results_div,'piechart',"300px","0px");      
                        var pie_chart = document.getElementById('piechart');
                        pie_chart.className = "myDiv";
                        pie_chart.style.width = "48%";
                        pie_chart.style.paddingLeft = "0px";
                        pie_chart.style.border = "0px";
                        
                        
                        //google charts - piechart
                        google.charts.load('current', {'packages':['corechart']});
                        google.charts.setOnLoadCallback(function() {
                                var data = google.visualization.arrayToDataTable([
                                  ['Strategy', 'Points'],
                                  [STRATEGYS[0], pps[0]],
                                  [STRATEGYS[1], pps[1]],
                                  [STRATEGYS[2], pps[2]],
                                  [STRATEGYS[3], pps[3]],
                                  [STRATEGYS[4], pps[4]],
                                  [STRATEGYS[5], pps[5]],
                                  [STRATEGYS[6], pps[6]],
                                  [STRATEGYS[7], pps[7]],
                                  [STRATEGYS[8], pps[8]],
                                  [STRATEGYS[9], pps[9]],
                                  [STRATEGYS[10], pps[10]]
                                ]);

                                var options = {
                                  title: 'Points pert strategy',
                                  backgroundColor: 'transparent',
                                  chartArea : {left :0,top:50,width: '70%',height: '100%'}

                                };
                            var chart = new google.visualization.PieChart(pie_chart);
                            chart.draw(data, options);
                            });
                            //
                        
                        //google charts - barchart
                        createHTML.create_div(results_div,'barchart',"240px","-150px");
                        var bar_chart = document.getElementById('barchart');
                        bar_chart.className = "myDiv";
                        bar_chart.style.width = "48%";
                        bar_chart.style.paddingLeft = "0px";
                        bar_chart.style.border = "0px";
                        bar_chart.style.position = "relative";
                        
                        //google charts - piechart
                        google.charts.setOnLoadCallback(function() {
                                var data = google.visualization.arrayToDataTable([
                                  ['Strategy', 'Points per player', {role: 'style'},{role: 'annotation'}], 
                                  ['', pps[0]/pyps[0],'color: #76A7FA',STRATEGYS[0]],
                                  ['', pps[1]/pyps[1],'color: #76A7FA',STRATEGYS[1]],
                                  ['', pps[2]/pyps[2],'color: #76A7FA',STRATEGYS[2]],
                                  ['', pps[3]/pyps[3],'color: #76A7FA',STRATEGYS[3]],
                                  ['', pps[4]/pyps[4],'color: #76A7FA',STRATEGYS[4]],
                                  ['', pps[5]/pyps[5],'color: #76A7FA',STRATEGYS[5]],
                                  ['', pps[6]/pyps[6],'color: #76A7FA',STRATEGYS[6]],
                                  ['', pps[7]/pyps[7],'color: #76A7FA',STRATEGYS[7]],  
                                  ['', pps[8]/pyps[8],'color: #76A7FA',STRATEGYS[8]],
                                  ['', pps[9]/pyps[9],'color: #76A7FA',STRATEGYS[9]],
                                  ['', pps[10]/pyps[10],'color: #76A7FA',STRATEGYS[10]]
                                ]);

                                var options = {
                                  title: 'Points per strategy per player',
                                  backgroundColor: 'transparent',
                                  legend: {position: "none"},

                                };
                            var chart = new google.visualization.BarChart(bar_chart);
                            chart.draw(data, options);
                            });
                            //
                         
                        
                        results_showing = true;
                    }else{			
                        alert("stop the run first");
                    }
                }else{
                    alert("click 'Set up' first");
                }
            }else{
                close_results();
            }
        },
        
        one_round_button: function(){
            
            //reset prob_values. no bias in random selection of the two players
            prob_values = [];
            play_world = null;
            
            clean_up();
            var loc_play_world = new Play_world(2,100,100,1);
            var p1 = loc_play_world.players[0];
            var p2 = loc_play_world.players[1];
            loc_play_world.play(p1,p2);
            createHTML.create_table("results_table",document.getElementById('all'),3,3,
                [["Move","Strategy","Points"],
                [p1.last_moves,p1.strategy_name,p1.points],
                [p2.last_moves,p2.strategy_name,p2.points]]);
        },
             
        one_match: function(){
            
            
            //reset global object from previous use
            prob_values = [];
            play_world = null;
        
            clean_up();
            var loc_play_world = new Play_world(2,10,1,1);
            var p1 = loc_play_world.players[0];
            var p2 = loc_play_world.players[1];
            
            /*test
            p1.strategy_name = HANDSHAKE;
            p2.strategy_name = REVERSE_TIT_FOR_TAT;
            */
            
            loc_play_world.one_game();
            createHTML.create_table("results_table",document.getElementById('all'),3,3,
            [["ID","Strategy","Points"],
            [p1.id,p1.strategy_name,p1.points],
            [p2.id,p2.strategy_name,p2.points]]);
            createHTML.create_canvas(document.getElementById('all'),'canvas',500,document.body.clientWidth,"10px","250px"); 
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext("2d");
            var window_with = document.body.clientWidth;
            var x_length = (window_with-10-(20*loc_play_world.number_games)) /  loc_play_world.number_games;
            var y_length = 100;
            var y_offset = 200;
            for(var i = 0; i < loc_play_world.number_games; i ++){
                for(var j = 0; j < loc_play_world.players.length; j ++){
                    if(loc_play_world.players[j].old_last_moves[i] == COP)
                        ctx.fillStyle = "green";
                    else ctx.fillStyle = "red";
                    ctx.fillRect((x_length+20)*i,(y_length+20)*j+y_offset,x_length,y_length);
                }
            }
        },
        
        set_up: function(){
            //number_players, number_rounds,number_confrontations,survivor_percent
            play_world = new Play_world(NUMBER_PLAYERS,10,100,1);

            generation_counter = 0;
            
            //create div for player and generation counter
            createHTML.create_div(document.getElementById('button_div'),'counter_div');
            document.getElementById('counter_div').innerHTML = "Players: " + play_world.players.length + "<br>"+"Generations: " + generation_counter;
            
            print_players();

            set_up_boolean = true;
        },
        
        one_generation_button: function(){
            if(set_up_boolean){
                play_world.one_generation();

                print_players();
                generation_counter ++;
                update_counter();
            }else{
                alert("click 'Set up' first");
            }
        },
        
        just_run_button: function(){
            if(set_up_boolean){

                running = !running;

                if(running){
                    document.getElementById('just_run_button_id').textContent = "Stop";

                    run();

                }else{
                    document.getElementById('just_run_button_id').textContent = "Run";
                    clearInterval(thread);
                }
            }else{
                alert("click 'Set up' first");
            }
        },
        
        set_options_values: function(values,num_players,evol_mode,prob_rand){
            prob_values = values;
            NUMBER_PLAYERS = num_players;
            EVOL_MODE = evol_mode;
            RANDOM_PROBABILITY = prob_rand / 100;
        },
        
        
        get_saved_options_values: function(){
            return{
                prob_vals : prob_values,
                num_players: NUMBER_PLAYERS,
                prob_rand: RANDOM_PROBABILITY * 100
            };
        }
        
    };

})();