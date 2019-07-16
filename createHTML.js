var createHTML = (function(){

    return{
        /*
            creates a table object

            parameters:
                id - table id
                parent - where the table will be appended
                nColumns - Number of columns in the table
                nRows - Number of rows in the table
                rows - A list of list containing the data.

            example: [[1,2,3][4,5,6]] will result in:

            1	2 	3
            4	5	6
        */
        create_table: function(id,parent,nColumns,nRows,rows){

            var table = document.createElement('table');
            table.id = id;
            var table_rows = [];
            var table_column = [];


            for(var i = 0; i < nRows; i ++){

                var column_ = [];
                table_column.push(column_);

                var row_ = table.insertRow(i);
                table_rows.push(row_);
            }

            for(var i = 0; i < nRows; i ++){
                for(var j = 0; j < nColumns; j ++){
                    table_column[i][j] = table_rows[i].insertCell(j);	
                    table_column[i][j].innerHTML = rows[i][j];
                }
            }

            parent.appendChild(table);
        },



        create_canvas: function(parent,id,height,width,style_left,style_top){

            var canvas = document.createElement('canvas');
            canvas.id = id;
            canvas.style.position = "absolute";
            canvas.height = height;
            canvas.width = width;
            canvas.style.left = style_left;
            canvas.style.top = style_top;
            parent.appendChild(canvas);	
        },
        
        
        create_div: function(parent,id,style_left,style_top){
            var mydiv = document.createElement('div');
            mydiv.id = id;
            mydiv.style.position = "absolute";
            mydiv.style.left = style_left;
            mydiv.style.top = style_top;
            mydiv.style.fontSize = "25px";
            mydiv.style.display = "inline-block";
            mydiv.style.fontFamily = "Courier New";
            //mydiv.style.border = "3px solid #AFAFFA";
            parent.appendChild(mydiv);
        },
        
            
        create_description_box: function(parent,id,msg){
            var div = document.createElement('div');
            div.id = id;
            div.innerHTML = msg;
            parent.appendChild(div);
        },

        
        del: function(id){
            var e = document.getElementById(id);
            e.parentNode.removeChild(e);
        }

    };
    

    
    
    
})();
