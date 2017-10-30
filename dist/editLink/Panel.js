    var _EH = $(window).height()-200;
    function Jstree(id, height){
        this.tree = $(id); 
        this.height = height;
        this.ctrlId = "#JstreeCtrl";
    }
    Jstree.prototype = {
        constructor: Jstree,
        closeSidebar: function(){
            if(!$('.page-sidebar-menu').hasClass('page-sidebar-menu-closed'))
                $('.sidebar-toggler').click();
        },
        setSelectList: function(json){
            for(var i in json){
                var node = json[i];
                if(node['type']==="file") {
                    $('select.fileList').append('<option id="'+node['id']+'">'+node['text']+'</option>');
                    //$('select.fileList').find('#'+node['parent']).append('<option id="'+node['id']+'">'+node['text']+'</option>');
                }   
                //else  $('select.fileList').append('<optgroup label="'+node['text']+'" id="'+node['id']+'"></optgroup>');
            } 
        }
    };
    Jstree.prototype.__proto__ = Filetree.prototype;
    var JsTree = new Jstree("#jsECTDtree", _EH );
    
    var panels = {
                "#pdf-editor": {},
                "#pdf-frame": {}
            }; 
    
    class PdfPanel{
        constructor(id){
            this.id = id; 
            this.panel = $(id);
            this.fileZone = this.panel.find('.fileZone'); 
            //this._EH = $(window).height()-200;
        }
        openPanel(file, fileId){                                                
            this.panel.find('.drop-file-zone').hide();
            this.panel.attr('data-loaded', 'true');
            this.fileZone.show();
            var url = Base_URL + "/a/application/file/download/" + fileId +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            
            var _this = this;                                                   //console.log(_this.panel);
            xhr.onprogress = function(e){        //console.log (e);
                if (e.lengthComputable) {}
            };
            xhr.onload = function() {
                if (this.status === 200) {
                    var blob = new Blob([this.response], {type: 'application/pdf'}),
                    pdfBlob = URL.createObjectURL(blob);           
                    var loadingTask = PDFJS.getDocument(pdfBlob);
                    loadingTask.onProgress = function(progress){
                        _this.panel.find('div.load-process').show();
                        _this.panel.find('div.load-process').css('width', ((progress.loaded/progress.total)*100)+'%');
                    };
                    loadingTask.promise.then(function(pdf){
                        var pdfArr = panels[_this.id];
                        pdfArr.name = file, pdfArr.fid = fileId, pdfArr.pdf=pdf, pdfArr.panel=_this.panel, pdfArr.saved = true;
                        //_this.pdfCache[fileId] = {'name': file, 'pdf': pdf};
                        _this.panel.find('div.load-process').fadeOut(1000);  
                        _this.pdf2html(file, pdf);
                    }).catch(function(error){                                   console.log(error);
                        //alert(error);
                    });
                }
            };
            xhr.send();
        }
        pdf2html(file, pdf){
            $('.splitter').fadeIn(300);
            this.genHtml()
                .setTab(file)
                .render(pdf)
                .createPageList(pdf.numPages);
            
            this.fileZone.css({'border': '1px solid #999', 'height': _EH}).scroll(function(e){
                //hideEditMenu();                                                                          // 
            });
        }
        genHtml() {                                                                  
            var pageWrap = $('<div class="page-wrap"><canvas class="page"></canvas></div>').attr("data-page-num", 1);  
            this.fileZone.append(pageWrap);                                                                 
            pageWrap.find("canvas.page").attr("height", _EH).attr("width", this.fileZone.width()).css("visibility", "hidden"); 
            return this; 
        }
        setTab(fileName){
            var _this = this;
            this.panel.find('.pdfTab').html(fileName+'<span class="closeFile"><i class="fa fa-times" aria-hidden="true" style="margin-left: 15px; margin-right: 1em;"></i></span>');
            this.panel.find("span.closeFile").click(function(){
                var tabText = _this.id =="#pdf-editor" ? "PDF file to editor": "PDF file to view"
                _this.closeFile(tabText);
            });
            return this;
        }
        render(pdf, e=1) {                                          //console.log("page: ", e);    
            var _this = this; 
            pdf.getPage(e).then(function(page) {
                var n = page.getViewport(1),                                          
                    scale = (_this.fileZone.width()-window.browserScrollbarWidth)/ n.width,                                                 
                    viewport = page.getViewport(scale),
                    pageWrap = _this.fileZone.find(".page-wrap").attr("data-scale", scale).attr('data-pw', n.width).attr("data-page-num", e);

                var canvas = pageWrap.find("canvas.page").get(0),
                    ctx = canvas.getContext("2d");
                    canvas.height = viewport.height,
                    canvas.width = viewport.width;                                                //console.log('scale0: ', o);
                _this.scaleFileZone(canvas.height);
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }; 
                page.render(renderContext).then(function() {
                    pageWrap.find("canvas.page").css("visibility", "visible");  
                });

            }).catch(function(error){
                    alert(error);
                });
            return _this;
        }
        scaleFileZone(h){
            if(h < _EH){ 
                this.fileZone.animate({"height": h}, 300, function(){
                    $('.splitter').css({"height": h});
                });
            }else{
                this.fileZone.animate({"height": _EH}, 300, function(){
                     $('.splitter').css("height", _EH);
                });
            }
        }
        createPageList(numPages){
            var pageList = this.panel.find('select.pageList');
            pageList.empty();
            for (var i = 1;i <= numPages; i++){
                pageList.append('<option >'+i+'</option>');
            } 
            if(pageList.parents(".pageControl").length) pageList.parents(".pageControl").show();
            return this;
        }
        closeFile(tabText){
            var panel = this.panel.attr('data-loaded', 'false');
            panel.find('.pdfTab').html(tabText); 
            panel.find('span.pageControl').hide(); 
            this.fileZone.fadeOut(100, function(){//$(this).empty();
                $(this).remove();
                $('<div class="fileZone"> </div>').insertAfter(panel.find('.drop-file-zone'));
            });
            panel.find('.drop-file-zone').fadeIn(300);
//            if(pdfEditor.attr('data-loaded')=='false' && pdfFrame.attr('data-loaded')=='false'){
//                    toggleSplitter(false);
//            }
        } 
            
    }
    
    class PdfFrame extends PdfPanel{
       
        pdf2html(file, pdf){
            super.pdf2html(file, pdf);
            $('.link-editable-menu select.pageList').attr("data-numPages", pdf.numPages);
        }
    }
    class PdfEditor extends PdfPanel{
        
        pdf2html(file, pdf){
            super.pdf2html(file, pdf);
            var edits = panels[this.id].edits;                            console.log("get edits: ", edits);   
            if(edits && edits.length){
                //replaceEdits(edits, 1, this.fileZone.find(".page-wrap"));
            }
        }
    }
    
    var pdfEditor = new PdfEditor("#pdf-editor");
    var pdfFrame = new PdfFrame("#pdf-frame");
    
    $(document).on('dnd_move.vakata', function (e, data) {  
            var t = $(data.event.target);                                      
//            var node =  $('#jsECTDtree').jstree(true).get_node(data.data.nodes[0]);                      //console.log("move node:", node);
//            if(node.type!=="file") return;                                                               //does not work
            if(t.parents('div.pdf-editor').length && t.parents('div.pdf-editor').attr('data-loaded')=='false' )
                data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok'); 
            if(t.parents('div.pdf-frame').length && t.parents('div.pdf-frame').attr('data-loaded')=='false')
                data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok'); 
            var nodeId = $(data.element);
            var preNode = $('#jsECTDtree').jstree(true).get_selected(true);
            if(preNode) $('#jsECTDtree').jstree(true).deselect_node(preNode);
            $('#jsECTDtree').jstree("select_node", nodeId, true);               
            
        }).on('dnd_stop.vakata', function (e, data) {                                 //console.log(data);
                var fileName = $.trim(data.element.text), fileId = data.data.nodes[0]; // filePath = data;            console.log(filePath);
                var t = $(data.event.target);                                           //console.log('parents: ',t.parents('div.pdf-editor').length); 
                if(fileName.indexOf('.pdf')>0) {                                                
                    if(t.parents(pdfEditor.id).length && pdfEditor.panel.attr('data-loaded')=='false') pdfEditor.openPanel(fileName, fileId);
                    else if(t.parents(pdfFrame.id).length && pdfFrame.panel.attr('data-loaded')=='false') pdfFrame.openPanel(fileName, fileId);
                }   
       });  
//       $("span.closeFile").click(function(){    
//           console.log($(this).parents(pdfEditor.id).length);
//           
//       });

    (function getScrollbarWidth() {
        var div, body, W = window.browserScrollbarWidth;
        if (W === undefined) {
            body = document.body, div = document.createElement('div');
            div.innerHTML = '<div style="width: 50px; height: 50px; position: absolute; left: -100px; top: -100px; overflow: auto;"><div style="width: 1px; height: 100px;"></div></div>';
            div = div.firstChild;
            body.appendChild(div);
            W = window.browserScrollbarWidth = div.offsetWidth - div.clientWidth;
            body.removeChild(div);
        }
        return W;
    })();


