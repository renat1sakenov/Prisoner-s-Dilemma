var ps_options = (function(){
    var input_elems;
    var span_elems;
    var save_values;
    var num_players;
    var button;
    var evol_mode = false;
    
    
    //public functions
    return{
        
        
        evol_mode_button: function(){
            if(evol_mode){
                button.value = "No";
            }else{
                button.value = "Yes";
            }
            evol_mode = !evol_mode; 
            console.log(evol_mode);
        },
        
        
        show_value: function(id){
            var value = document.getElementById(id).value;
            document.getElementById(id+"_").innerHTML = " -- "+ value + "%";

            var index = -1;
            for(var i = 0; i < input_elems.length; i ++){
                if(id == input_elems[i].id){
                    index = i;
                    break;
                }
            }

            var sum = 0;
            for(var i = 0; i < input_elems.length; i ++){
                sum += parseInt(input_elems[i].value);
            }

            while(sum != 100){
                for(var i = 0; i < input_elems.length; i ++){
                    if(id != input_elems[i].id){
                        if(sum < 100){
                            input_elems[i].value = parseInt(input_elems[i].value) + 1;
                            sum += 1;
                        }else if(sum > 100 && parseInt(input_elems[i].value) > 0){
                            input_elems[i].value = parseInt(input_elems[i].value) - 1;
                            sum -= 1;
                        }
                    }
                }
            }
            
            for(var i = 0; i < span_elems.length; i ++){
                if((id+"_") != span_elems[i].id)
                    span_elems[i].innerHTML = " -- "+ input_elems[i].value +"%";
            }

            for(var i = 0; i < input_elems.length; i ++)
                save_values[i] = parseInt(input_elems[i].value);

        },
        
        
        prob_values_button: function(){
            
            
            function check_input_number(id){
                var loc_num = parseInt(document.getElementById(id).value)
                if(loc_num !== null && !isNaN(loc_num) && loc_num > 0)
                    return loc_num;
                else return null;
            }
            
            var loc_num = check_input_number('num_players_input');
            if(loc_num && loc_num % 2 == 0)
                num_players = loc_num;
            else num_players = 100;            
            
            var prob_rand = check_input_number('prob_random_input');
            if(!prob_rand || prob_rand > 100 || prob_rand < 1)
                prob_rand = 50;
        
            window.opener.ps_main.set_options_values(save_values,num_players,evol_mode,prob_rand);
            window.close();
        },
        
        options_main: function(){

            var DEFAULT = Math.floor(100.0 / ( window.opener.ps_main.get_NUMBER_STRATEGYS()));
            input_elems = document.getElementsByClassName('range');
            span_elems = document.getElementsByTagName('span');
            button = document.getElementById('evol_button');
            save_values = [];
                      
            var prob_values = window.opener.ps_main.get_saved_options_values().prob_vals;
            var num_players = window.opener.ps_main.get_saved_options_values().num_players;
            var prob_rand = window.opener.ps_main.get_saved_options_values().prob_rand;
            
            if(prob_values != null && prob_values.length != 0){
                for(var i = 0; i < input_elems.length; i ++){
                    input_elems[i].value = prob_values[i];
                    save_values[i] = prob_values[i];
                }
            }else{
                for(var i = 0; i < input_elems.length; i ++){
                    input_elems[i].value = DEFAULT;
                    save_values.push(DEFAULT);
                }

                var rest = 100 - DEFAULT*(window.opener.ps_main.get_NUMBER_STRATEGYS());
                for(var i = 0; i < rest; i ++)
                    input_elems[i].value = parseInt(input_elems[i].value) + 1;
            }
            
            document.getElementById('prob_random_input').value = prob_rand;
            
            
            
            for(var i = 0; i < span_elems.length; i ++){
                span_elems[i].innerHTML = " -- " +input_elems[i].value + "%"
            }
            
            if(num_players)
                document.getElementById('num_players_input').value = num_players;
        }
        
    };    
})();