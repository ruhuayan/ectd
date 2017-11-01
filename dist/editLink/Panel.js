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
                }   
            } 
        }
    };
    Jstree.prototype.__proto__ = Filetree.prototype;
    var JsTree = new Jstree("#jsECTDtree", _EH );
    
    function PdfPanel(id){
        this.id = id; 
        this.panel = $(id);
        this.fileZone = this.panel.find(".fileZone");
    }
    PdfPanel.prototype = {
        constructor: PdfPanel,
        openPanel: function(file, fileId){                                                
            this.panel.find('.drop-file-zone').hide();
            this.panel.attr('data-loaded', 'true');
            this.fileZone.show();
            var userData = angular.element("#JstreeCtrl").scope().getUserData();
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
                    loadingTask.promise.then(function(pdf){                     console.log(pdf);
                        _this.fileName = file, _this.fid = fileId, _this.pdf = pdf;
                        //_this.pdfCache[fileId] = {'name': file, 'pdf': pdf};
                        _this.panel.find('div.load-process').fadeOut(1000);  
                        _this.pdf2html();
                    }).catch(function(error){                                   //console.log(error);
                        alert(error);
                    });
                }
            };
            xhr.send();
        },
        pdf2html: function(callback){
            $('.splitter').fadeIn(300);
            this.genHtml()
                .setTab()
                .render(1)
                .createPageList(this.pdf.numPages);
            
            this.fileZone.css({'border': '1px solid #999', 'height': _EH}).scroll(function(e){
                //hideEditMenu();                                                                          // 
            });
            if(callback) callback();
        },
        genHtml: function() {                                                                  
            var pageWrap = $('<div class="page-wrap"><canvas class="page"></canvas></div>').attr("data-page-num", 1);  
            this.fileZone.append(pageWrap);                                                                 
            pageWrap.find("canvas.page").attr("height", _EH).attr("width", this.fileZone.width()).css("visibility", "hidden"); 
            return this; 
        },
        setTab: function(){
            var _this = this;
            this.panel.find('.pdfTab').html( _this.fileName+'<span class="closeFile"><i class="fa fa-times" aria-hidden="true" style="margin-left: 15px; margin-right: 1em;"></i></span>');
            this.panel.find("span.closeFile").click(function(){
                var tabText = _this.id =="#pdf-editor" ? "PDF file to editor": "PDF file to view";
                _this.closeFile(tabText);
            });
            return this;
        }, 
        render: function(e=1) {                                          //console.log("page: ", e);    
            var _this = this; 
            this.pdf.getPage(e).then(function(page) {                           //console.log(page);
                var n = page.getViewport(1),                                          
                    scale = (_this.fileZone.width()-window.browserScrollbarWidth)/ n.width,                                                 
                    viewport = page.getViewport(scale),
                    pageWrap = _this.fileZone.find(".page-wrap").attr("data-scale", scale).attr('data-pw', n.width).attr("data-page-num", e);

                var canvas = pageWrap.find("canvas.page").get(0),
                    ctx = canvas.getContext("2d");
                    canvas.height = viewport.height,
                    canvas.width = viewport.width;                                                //console.log('scale0: ', o);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }; 
                page.render(renderContext).then(function() {
                    _this.scaleFileZone(canvas.height);
                    pageWrap.find("canvas.page").css("visibility", "visible"); 
                });

            }).catch(function(error){
                    alert(error);
                });
            return _this;
        }, 
        scaleFileZone: function(height){
            if(height < _EH){ 
                    this.fileZone.animate({"height": height}, 300, function(){
                        $('.splitter').css({"height": height});
                    });
                }else{
                    this.fileZone.animate({"height": _EH}, 300, function(){
                         $('.splitter').css("height", _EH);
                    });
                }
            //App.initSlimScroll(fileZone);
        },
        createPageList: function(numPages){
            var pageList = this.panel.find('select.pageList');
            pageList.empty();
            for (var i = 1;i <= numPages; i++){
                pageList.append('<option >'+i+'</option>');
            } 
            
            if(pageList.parents(".pageControl").length) pageList.parents(".pageControl").show();
            
            var _this = this;
            pageList.on("change", function(){
                var pageNum= parseInt($(this).find('option:selected').text());                               //alert($(this).find('option:selected').text());
                _this.render(pageNum);                 //showEdits(operationCount, pageNum);                         if pdf-Editor, show edits
            });
            
            _this.panel.find("a.prePage").click(function(e){          //alert("a prePage click");
               
                var pageNum = parseInt(_this.panel.find(".page-wrap").attr("data-page-num"));
                if(pageNum >1){ 
                    _this.render(--pageNum);
                    pageList.val(pageNum);
                    //showEdits(operationCount, pageNum);
                }
            });
            _this.panel.find("a.nextPage").click(function(e){          //alert("a prePage click");
                
                var pageNum = parseInt(_this.panel.find(".page-wrap").attr("data-page-num"));
                
                if(pageNum < _this.pdf.numPages){ 
                    _this.render(_this.pdf,  ++pageNum);
                    pageList.val(pageNum);
                    //if($(this).parents('div.pdf-editor').length) showEdits(operationCount, pageNum);
                }
            });
            _this.panel.find(".pageNum").keydown(function(event){
                if(event.keyCode==13){
                    var pageNum = parseInt($(this).val());        
                    if(!pageNum || pageNum<=0){ toastr.warning("Invalid page number !"); return;} 
                        //showEdits(operationCount, pageNum);
                        _this.render(pageNum);
                        pageList.val(pageNum);
                    
                }
            });
            
            return this;
        }, 
        closeFile: function(tabText){
            var panel = this.panel.attr('data-loaded', 'false');
            panel.find('.pdfTab').html(tabText); 
            panel.find('span.pageControl').hide();
            var _this = this;
            this.fileZone.fadeOut(100, function(){
                $(this).remove();
                _this.fileZone = $('<div class="fileZone"><div class="load-process">Loading...</div></div>').insertAfter(panel.find('.drop-file-zone'));
                //$(this).empty().append('<div class="load-process">Loading...</div>');
            });
            panel.find('.drop-file-zone').fadeIn(300);
//            if(pdfEditor.attr('data-loaded')=='false' && pdfFrame.attr('data-loaded')=='false'){
//                    toggleSplitter(false);
//            }
            delete this.pdf; delete this.fid;
        }
    };
    
    function PdfFrame(id){
        PdfPanel.call(this, id); 
    }
    PdfFrame.prototype = {
        setPageList: function(pdf){
            $('.link-editable-menu select.pageList').attr("data-numPages", pdf.numPages);
        }
    };
    PdfFrame.prototype.__proto__ = PdfPanel.prototype; 
    
    function PdfEditor(id){
        PdfPanel.call(this, id);
    }
    PdfEditor.prototype = {
        getEdits: function(){
            var edits = this.edits;
            if(edits && edits.length){
                //replaceEdits(edits, 1, this.fileZone.find(".page-wrap"));
            }
        }
    };
    
    PdfEditor.prototype.__proto__ = PdfPanel.prototype;
    
    
    var pdfEditor = new PdfEditor("#pdf-editor");
    var pdfFrame = new PdfFrame("#pdf-frame");
    
    $(document).on('dnd_move.vakata', function (e, data) {  
            var t = $(data.event.target);                                      
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


