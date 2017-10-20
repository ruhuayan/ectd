// final edited: 10/04/2017 author: rich yan

var img = new Image();   //document.getElementById("test"); 
            img.src = "imageGame/picture_1.jpg";
            
            var height, width, sHeight, sWidth;                                          
            var ROW = COL = 3; 
            var conLeft = $("#conLeft").offset().left;                          
            var conTop = $("#conLeft").offset().top;       console.log("top",conTop);     
            var thumbs = [];
            
                img.onload = function() {
                    height = img.height, width = img.width;                         console.log(width, height);
                    sHeight = parseInt(height/ROW), sWidth = parseInt(width/COL);   //console.log(sWidth, sHeight);
                    theCanvas();
                    createCanvas();  
                    $("#canvas").css({"top": conTop+height+COL, "left": conLeft}); console.log("canvas top",conTop+height+COL );
                    shuffle(thumbs);
                };
            
            //var num_empty= $("#canvas").attr("image");
            
            function theCanvas(){
                var canvas = document.getElementById("canvas");
                canvas.width = sWidth;
                canvas.height = sHeight;
                /*var ctx =canvas.getContext('2d');
                ctx.beginPath();
                ctx.rect(0, 0, sWidth, sHeight);
                ctx.fillStyle = "#000";
                ctx.fill();*/
            }
            function createCanvas(){
                $(".conArea").css({"width": width, "height": height});
                for(var i=0; i<ROW*COL; i++){
                   var thumb = $("#canvas").css({"top": (sHeight+1)* parseInt(i/ROW)+conTop, "left": (sWidth+1) *(i%COL)+conLeft, "z-index": 100}).
                           clone().attr("id", "can"+i).appendTo($("#conLeft"));  //console.log(thumb);
                   thumbs[i] = thumb;
                   
                   var canvas = document.getElementById("can"+i);
                   var context = canvas.getContext('2d');
                   
                   context.drawImage(img, sWidth *(i%COL), sHeight* parseInt(i/ROW), sWidth, sHeight, 0, 0, sWidth, sHeight);
                  
                   $("#can"+i).attr("image-num", i).attr("image-ori", i);
                   
                   
                   $("#can"+i).click(function(e){
                       var myNum = $(this).attr("image-num");                   //console.log($(this).attr("image-num"));
                       var num_empty = $("#canvas").attr("image-num");
                       if(!num_empty) num_empty = ROW*COL;
                       
                       if(Math.abs(num_empty-myNum) == COL){                              //console.log($("#canvas").offset().top)
                           var top = $("#canvas").offset().top, myTop = $(this).offset().top;
                           //$("#canvas").hide();
                           $("#canvas").css("top", myTop).attr("image-num", myNum);
                           $(this).animate({"top": top}, 300, function(){
                               if(checkNum()) alert("you win");
                           }).attr("image-num", num_empty);
                           
                       }else if (Math.abs(num_empty-myNum)==1){
                           if(num_empty%COL == (COL-1) && myNum %COL ==0) return; 
                           if(num_empty%COL==0 && myNum%COL ==(COL-1)) return; 
                           var left = $("#canvas").offset().left, myLeft = $(this).offset().left;
                           //$("#canvas").hide();
                           $("#canvas").css("left", myLeft).attr("image-num", myNum);
                           $(this).animate({"left": left}, 300, function(){
                               //$("#canvas").css("left", myLeft).show().attr("image-num", myNum);
                               if(checkNum()) alert("you win");
                           }).attr("image-num", num_empty);
                           
                       }
                   });
                }
                
            }
            
            function shuffle(){
                for(var i=0; i<ROW*COL; i++){ 
                    if(i==ROW*COL-ROW) break;
                    var j = parseInt(Math.random()*ROW*COL);                    //console.log(j)
                    var jNum = thumbs[j].attr("image-num"); 
                    var iNum = thumbs[i].attr("image-num");
                        
                    if(iNum!==jNum && j !==ROW*COL-ROW){                                        //console.log(iNum, jNum)
                            var iTop = thumbs[i].offset().top, iLeft = thumbs[i].offset().left;
                            var jTop = thumbs[j].offset().top, jLeft = thumbs[j].offset().left;
                            thumbs[j].css({"top": iTop, "left": iLeft}).attr("image-num", iNum);
                            thumbs[i].css({"top": jTop, "left": jLeft}).attr("image-num", jNum);
                    }
                    
                }
            }
            
            function checkNum(){
                
                for(var i=0; i<ROW*COL; i++){
                    var originalNum = thumbs[i].attr("image-ori");
                    var imageNum = thumbs[i].attr("image-num"); 
                    if(originalNum != imageNum) return false;
                }
                return true;
            }
            function showNumber(){
                                                                                //console.log("click");
                for(var i=0; i<ROW*COL; i++){
                    //var thumb = thumbs[i];                                      //console.log(thumb);
                    var oriNum = $("#can"+i).attr("image-ori");                 //console.log(oriNum);
                    var canvas = document.getElementById("can"+i);
                    var context = canvas.getContext('2d'); 
                    context.fillStyle = "red";
                    context.font = "20px bold";
                    context.fillText(i+1, sWidth/2, sHeight/2);
                }
            }      
            function showImage(){
                
                $('<img id="imageOri">').attr("src", img.src)
                    .appendTo($("#conLeft")).css({"position": "absolute", "left": conLeft+width+20});
                setTimeout(function(){
                    $("#imageOri").remove();
                }, 1000);
            }
            
            $("#images").on("change", function(){
                
                img.src = $(this).val();
                removeThumbs();
                
            });
            $("#formats").on("change", function(){
                //ROW = COL = $(this).val();                           console.log("col", $(this).val());
                //img.src = $("#images").val();
                //removeThumbs();
                
            });
            
            function removeThumbs(){
                for(var i =0; i<thumbs.length; i++) thumbs[i].remove();
            }
            
            function download(){
                zip.createWriter(new zip.BlobWriter("application/zip"), function(writer) {
                      for(var i=0; i<ROW*COL; i++){
                        var canvas = document.getElementById("can"+i);                  
                        var image = canvas.toDataURL("image/png"); 
                        writer.add("thumb_"+i, new zip.BlobReader(image), function(){
                            if(i==ROW*COL-1) writer.close(function(blob){
                                    saveAs(blob, "download_from_richyan_com.zip");
                                });
                        })
                      }
                    }, function(e){console.log(e)});
            }
                
                /*for(var i=0; i<ROW*COL; i++){
                    var canvas = document.getElementById("can"+i);                  
                    var image = canvas.toDataURL("image/png");                      //console.log("image", i,  image);
                    var newData = image.replace(/^data:image\/png/, "data:application/octet-stream");
                    var link = document.createElement('a');
                    link.href = image;
                    link.download = "download_from_richyan_com"+i+".png";
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                    //window.open(newData, "win"+i);
                   // $("#download").attr("download", "download_from_richyan_com"+i+".png").attr("href", newData); 
                   // $("#test").trigger( "click" );
                   //var page = '<html><body style="margin:0 auto;"><img src="'+image+'"></body></html>';
                    //window.open(window.URL.createObjectURL(new Blob([page], {type: 'text/html'})));
                }*/
                
            //}

