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

    //super class PdfPanel
    function PdfPanel(id){
        this.id = id; 
        this.panel = $("#"+id);
        this.fileZone = this.panel.find(".fileZone");
        this.partner = this.id == "pdf-editor"? $("#pdf-frame"): $("#pdf-editor");
    }
    PdfPanel.prototype = {
        constructor: PdfPanel,
        openPanel: function(file, fileId, callback){
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
                    loadingTask.promise.then(function(pdf){                     //console.log(pdf);
                        //panels[_this.id].pdf = pdf, panels[_this.id].panel = _this.panel;
                        _this.fileName = file, _this.fid = fileId, _this.pdf = pdf;
                        //_this.pdfCache[fileId] = {'name': file, 'pdf': pdf};
                        _this.panel.find('div.load-process').fadeOut(1000);  
                        _this.pdf2html(callback);
                    }).catch(function(error){                                   //console.log(error);
                        alert(error);
                    });
                }
            };
            xhr.send();
            return this;
        },
        pdf2html: function(callback){
            $('.splitter').fadeIn(300);
            this.genHtml()
                .setTab()
                .render(1)
                .createPageList(this.pdf.numPages);
            var _this = this;
            this.fileZone.css({'border': '1px solid #999', 'height': _EH}).scroll(function(e){
                if(_this.hideEditMenu) _this.hideEditMenu();                                                                          //
            });
                                                                                                            console.log("before edits")
            if(this.id == "pdf-editor") this.replaceEdits();      // for pdfEditor
            //if(this.setPageList) this.setPageList();        // for pdfFrame
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
                var tabText = _this.id =="pdf-editor" ? "PDF file to editor": "PDF file to view";
                _this.closeFile(tabText);
            });
            return this;
        }, 
        render: function(e) {                                          //console.log("panel: ",this.panel, this.fileName);

            var _this = this; 
            this.pdf.getPage(e).then(function(page) {
                var n = page.getViewport(1),                                          
                    scale = (_this.fileZone.width()-window.browserScrollbarWidth)/ n.width,                                                 
                    viewport = page.getViewport(scale),
                    pageWrap = _this.fileZone.find(".page-wrap").attr("data-scale", scale).attr('data-pw', n.width).attr("data-page-num", e);
                                                                                        //console.log("scale", scale);
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
        },
        createPageList: function(numPages, list){

            var pageList = list || this.panel.find('select.pageList');
            pageList.empty();
            for (var i = 1;i <= numPages; i++){
                pageList.append('<option >'+i+'</option>');
            } 
            
            if(pageList.parents(".pageControl").length) pageList.parents(".pageControl").show();
            return this;
        },
        setPageControlHendler: function(){
            var pageList = this.panel.find('.right-tabs select.pageList');
            var _this = this;
            pageList.on("change", function(){
                var pageNum= parseInt($(this).find('option:selected').text());                               //alert($(this).find('option:selected').text());
                _this.render(pageNum);
                if(_this.showEdits) _this.showEdits(pageNum);                         //if pdf-Editor, show edits
            });

            _this.panel.find("a.prePage").click(function(e){          //alert("a prePage click");

                var pageNum = parseInt(_this.panel.find(".page-wrap").attr("data-page-num"));
                if(pageNum >1){
                    _this.render(--pageNum);
                    pageList.val(pageNum);
                    if(_this.showEdits) _this.showEdits(pageNum);
                }
            });
            _this.panel.find("a.nextPage").click(function(e){          //alert("a prePage click");

                var pageNum = parseInt(_this.panel.find(".page-wrap").attr("data-page-num"));

                if(pageNum < _this.pdf.numPages){                                                                       //console.log("panel", _this.panel)
                    _this.render(++pageNum);
                    pageList.val(pageNum);
                    if(_this.showEdits) _this.showEdits(pageNum);
                }
            });
            _this.panel.find(".pageNum").keydown(function(event){
                if(event.keyCode==13){
                    var pageNum = parseInt($(this).val());
                    if(!pageNum || pageNum<=0){ toastr.warning("Invalid page number !"); return;}
                    if(_this.showEdits) _this.showEdits(pageNum);
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

            this.fileZone.fadeOut(100, function(){

                $(this).empty().append('<div class="load-process">Loading...</div>');
            });
            panel.find('.drop-file-zone').fadeIn(300, function(){});
            if(this.partner.attr('data-loaded')=='false'){
                    this.toggleSplitter(false);
            }
            delete this.pdf; delete this.fid; delete this.fileName;
        },
        toggleSplitter: function(show){
            if(show){ $('.splitter').show(); } else { $('.splitter').hide(); }
        }

    };
    
    function PdfFrame(id){
        PdfPanel.call(this, id); 
    }
    PdfFrame.prototype = {};
    PdfFrame.prototype.__proto__ = PdfPanel.prototype;
    var pdfFrame = new PdfFrame("pdf-frame");
    pdfFrame.setPageControlHendler();

    function PdfEditor(id){
        PdfPanel.call(this, id);
        this.editCount = 0;
    }
    PdfEditor.prototype = {
        setEditCount: function(){
            this.editCount = 0;
            return this;
        },
        scaleOperations: function(){
            return this;
        },
        loadEdits: function(fid){
            var _this = this;
            angular.element("#JstreeCtrl").scope().getFileByUuid(fid).then(function(result){       console.log("file: ", result);
                if(result.errors) return;
                if(result && result.state.length>0){
                    var lastState = result.state[result.state.length-1];                               //console.log("edits: ", JSON.parse(lastState.action) );
                    _this.edits = JSON.parse(lastState.action);                         //console.log("edits: ", pdfFile['pdf-editor'].edits);
                }
            });
            return this;
        },
        replaceEdits: function(){                                                                 console.log("edits", this.edits);
            if(!this.edits || this.edits.length<=0) return false;
            var edits = this.edits, editZone = this.fileZone;
            var linkEdits = edits["linkOperations"];
            var textEdits = edits["textOperations"];

                if(linkEdits && linkEdits.length>0){
                    for (var i=0; i<linkEdits.length; i++){                               //console.log("page num: ", linkEdits[i].page);
                        var lastOpNum = linkEdits[i].id.split("-")[2];
                        if(this.editCount<lastOpNum) this.editCount = lastOpNum;
                        var scale = (editZone.width()-window.browserScrollbarWidth)/linkEdits[i].pw;                   //console.log("scale: ", scale);
                        var t = linkEdits[i].boundingBox.top * scale,
                            l = linkEdits[i].boundingBox.left * scale,
                            w = linkEdits[i].boundingBox.width * scale,
                            h = linkEdits[i].boundingBox.height * scale,
                            tfid = linkEdits[i].tfid,
                            id = linkEdits[i].id,
                            page = linkEdits[i].page,
                            tpage = linkEdits[i].tpage,
                            uri = linkEdits[i].uri;

                        var edit = this.createTargetShape({t: t, l: l, w: w, h: h, id: id, tfid: tfid, page: page, tpage: tpage, uri: uri}, false);
                        if(1 !== parseInt(linkEdits[i].page)){
                            edit.css("z-index", -1);
                        }
                    }
                }
                if(textEdits && textEdits.length>0){
                    for (var i=0; i<textEdits.length; i++){                               //console.log("page num: ", linkEdits[i].page);

                        var lastOpNum = textEdits[i].id.split("-")[2];                   //console.log("edit no: ", lastOpNum);
                        if(this.editCount<lastOpNum) this.editCount = lastOpNum;

                        var scale = (editZone.width()-window.browserScrollbarWidth)/textEdits[i].pw;
                        var t = textEdits[i].position.y * scale,
                            l = textEdits[i].position.x * scale,
                            style = textEdits[i].style,
                            id = textEdits[i].id,
                            text = textEdits[i].text;
                        page = textEdits[i].page;
                        style.fontSize = style.fontSize * scale;
                        //var edit = createTextEdit(pageWrap, t, l, text, {id: id, page: page, style: style});
                        if(1 !== parseInt(textEdits[i].page)){
                          //  edit.css("z-index", -1);
                        }
                    }
                }
                this.hideEditMenu();
                return this;
        },
        showEdits: function(pageNum){                                  console.log("editCount", this.editCount);
            if(this.editCount===0) return false;
            for(var i=this.editCount; i>=1; i--){
                var target = this.panel.find('.operation_'+i);
                if(target.length && target.is(":visible")) {target.css("z-index", -1);}
                var num = target.attr("data-page-num");
                if(num && num==pageNum) target.css("z-index", 10);
            }
            this.hideEditMenu();
        },
        createTargetShape: function(link, select){
            var _this = this;
            var w = link.w || 200, h = link.h || 100, pageWrap = this.panel.find(".page-wrap");
            var target = $('<div class="target-editable"></div>');                                           // link retangle
            if(link.id) target.attr({"id": link.id, "data-target-fid": link.tfid, "data-page-num": link.page, "data-target-page": link.tpage, "data-uri": link.uri})
                .addClass('operation_'+link.id.split("-")[2]);
            else target.attr({"id": "target-editable-" + ++_this.editCount, "data-page-num":pageWrap.attr("data-page-num")}).addClass('operation_'+_this.editCount);
            //removeOperationCache();                                                                                 //parseFloat(o.attr("data-scale"));
            target.css({
                width: w + "px",
                height: h + "px",
                position: "absolute",
                top: link.t + "px",
                left: link.l + "px"

            }).draggable().resizable({
                handles: "all"
            }).addClass("active").addClass("shape-rectangle");

            if(!link.id) setTimeout(function() { _this.openLinkEdit(target, select);  }, 100);

            target.click(function(t) {

                _this.openLinkEdit($(this), select),
                    target.find(".ui-resizable-handle").show(),
                    target.addClass("active");
            }).on("resizestart", function() {
                //e()
            }).on("resizestop", function() {
                setTimeout(function() {
                    _this.openLinkEdit(target, select);
                }, 100);
            }).on("dragstart", function() {
                $("#link-editable-menu").hide();
            }).on("dragstop", function() {
                setTimeout(function() {
                    //c(target)
                    _this.openLinkEdit(target, select);
                }, 100);
            }).on("mouseover", function() {
                target.find(".ui-resizable-handle").show();
            }).on("mouseout", function() {
                var t=$('#link-editable-menu');
                target.hasClass("active") || t.is(":visible") && t.attr("data-target-id") == target.attr("id") || target.find(".ui-resizable-handle").hide()
            });
            if(select)
                target.attr({"data-uri": this.fileName, "data-target-fid":_this.fid });

            pageWrap.append(target);                                            //console.log("append edit: ", pageWrap);
            //pdfFile["pdf-editor"].saved = false;
            return target;
        },
        openLinkEdit: function(target, select){
            var fileListSelect = $('.link-editable-menu select.fileList'), pageList =$('.link-editable-menu select.pageList');
            if(select) {
                if(target.attr('data-target-fid') && target.attr('data-uri'))                                     // pageList is not first time loaded
                    fileListSelect.val( target.attr('data-uri')).attr('disabled', 'disabled');
                else fileListSelect.val( this.fileName).attr('disabled', 'disabled');      // pageList is loaded first time

                if(target.attr("data-numPages")){
                    this.createPageList(target.attr("data-numPages"), pageList);           //pageList
                    pageList.val(target.attr('data-target-page'));
                }else if(pageList.attr("data-numPages")){
                    this.createPageList(pageList.attr("data-numPages"), pageList);
                    target.attr("data-numPages", pageList.attr("data-numPages"));
                }else
                    pageList.val(target.attr('data-target-page')).attr('disabled', 'disabled');;
                pageList.show();
            }else {
                if(target.attr('data-target-page')>1 && target.attr('data-uri')){             console.log(target.attr('data-target-page'));
                    fileListSelect.val( target.attr('data-uri')).attr('disabled', 'disabled');
                    this.createPageList( target.attr('data-target-page'), pageList);
                    pageList.val(target.attr('data-target-page')).attr('disabled', 'disabled').show();
                }else{
                    var sText;
                    $("select.fileList option").each(function(){
                        if(target.attr('data-target-fid') && $(this).attr('id')==target.attr('data-target-fid')) {
                            $(this).attr('selected' ,'selected'); sText = $(this).text();
                        }else $(this).removeAttr('selected');
                    });

                    fileListSelect.removeAttr('disabled').val(sText);
                    pageList.hide();
                }
            }

            $("#link-editable-menu").css({
                position: "absolute",
                "z-index": "1000",
                top: target.offset().top + target.height()-30,
                left: target.offset().left
            }).attr("data-target-id", target.attr("id")).show();
        },
        hideEditMenu: function(){
            if ($(".text-editable").attr("contenteditable", "false").each(function() {
                    var t = $(this);
                    t.hasClass("noDrag") || t.draggable("enable")
                }),$("#text-editable-menu").is(":visible"))
                return void $("#text-editable-menu").hide();

            var i = $("#link-editable-menu");
            if (i.is(":visible")) {
                i.hide();
                var n = $("#" + i.attr("data-target-id"));
                return n.find(".ui-resizable-handle").hide(),
                    void n.removeClass("active");
            }
        }
    };
    
    PdfEditor.prototype.__proto__ = PdfPanel.prototype;
    
    var pdfEditor = new PdfEditor("pdf-editor");
    pdfEditor.setPageControlHendler();
    pdfEditor.panel.resize({
        minWidth: 350,
        maxWidth: $('.panel-container').width()-200,
        handleSelector: ".splitter",
        resizeHeight: false,
        onDragStart: function(e, $el, opts){ pdfEditor.hideEditMenu(); },
        onDragEnd: function(e, $el, opts ){
            if(pdfFrame.panel.attr('data-loaded')=="true")
                pdfFrame.render(parseInt(pdfFrame.panel.find(".page-wrap").attr("data-page-num")));
            if($el.attr('data-loaded')==='true'){
                pdfEditor.render(parseInt(1));
                pdfEditor.scaleOperations();
            }
        }
    });

    
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
                    if(t.parents('div.pdf-editor').length && pdfEditor.panel.attr('data-loaded')=='false')
                        pdfEditor.setEditCount()
                            .loadEdits(fileId)
                            .openPanel(fileName, fileId);
                    else if(t.parents('div.pdf-frame').length && pdfFrame.panel.attr('data-loaded')=='false')
                        pdfFrame.openPanel(fileName, fileId, function(){
                            $('.link-editable-menu select.pageList').attr("data-numPages", pdfFrame.pdf.numPages);
                        });
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


