    var pdfCache={}, pdfEditor = $('.pdf-editor'), pdfFrame = $('.pdf-frame'), _EH = $(window).height()-200;   // Editor initial Height
    var pdfFile = {
        "pdf-editor": {},
        "pdf-frame": {}
    };
    function Jstree(id, height){
        Filetree.call(this, id, height);
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

    //////////////////////////////////////////////
    //        load pdf 2 html
    //////////////////////////////////////////////
   
    $(document).on('dnd_move.vakata', function (e, data) {  
            var t = $(data.event.target);                                      
            var node =  $('#jsECTDtree').jstree(true).get_node(data.data.nodes[0]);                      //console.log("move node:", node);
            if(node.type!=="file") return;                                                               //does not work
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
                if(t.parents('div.pdf-editor').length && pdfEditor.attr('data-loaded')=='false') openPanel(fileName, fileId, pdfEditor);
                else if(t.parents('div.pdf-frame').length && pdfFrame.attr('data-loaded')=='false') openPanel(fileName, fileId, pdfFrame);
            }   
   });  
    
    function openPanel(file, fileId, panel){                                   //console.log("panel id", panel[0].id);                               
        panel.find('.drop-file-zone').hide();
        panel.attr('data-loaded', 'true');
        panel.find('.fileZone').show();
        if(panel[0].id=='pdf-editor') loadEdits(fileId);
        /*var cacheOb; 
        for(var fid in pdfCache){                                              //console.log(filename)
            if (fid === fileId){cacheOb = pdfCache[fid];} 
        }
        if(cacheOb && cacheOb.pdf){
            //if(!cacheOb.saved){
                pdfFile[panel[0].id] = {'name': file,'fid': fileId, 'pdf': cacheOb.pdf, 'panel': panel, 'dataLoaded': true};
                panel.find('div.load-process').fadeOut(1000); 
                    pdf2html(file, cacheOb.pdf, panel);
                return;
            //}//else file=cacheOb.name+"?nc="+Math.random();                    // to prevent loading cache file
        }*/
        var userData = angular.element("#JstreeCtrl").scope().getUserData(); 
        var url = Base_URL + "/a/application/file/download/" + fileId +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onprogress = function(e){        //console.log (e);
            if (e.lengthComputable) {}
        };
        xhr.onload = function() {
            if (this.status === 200) {
                var blob = new Blob([this.response], {type: 'application/pdf'}),
                pdfBlob = URL.createObjectURL(blob);           
                var loadingTask = PDFJS.getDocument(pdfBlob);
                loadingTask.onProgress = function(progress){
                    panel.find('div.load-process').show();
                    panel.find('div.load-process').css('width', ((progress.loaded/progress.total)*100)+'%');
                };
                loadingTask.promise.then(function(pdf){
                    var pdfArr = pdfFile[panel[0].id];
                    pdfArr.name = file, pdfArr.fid = fileId, pdfArr.pdf=pdf, pdfArr.panel=panel, pdfArr.saved = true;                     console.log(pdfFile);
                    //pdfFile[panel[0].id] = {'name': file, 'fid': fileId, 'pdf': pdf, 'panel': panel, 'dataLoaded': true};      //console.log('pdfFile: ',pdfFile);
                    pdfCache[fileId] = {'name': file, 'pdf': pdf};
                    panel.find('div.load-process').fadeOut(1000);  
                    pdf2html(file, pdf, panel);
                }).catch(function(error){
                    alert(error);
                });
            }
        };
        xhr.send();

        /*var path = "http://192.168.88.187:8080/ectd"+JsTree.getPathById(fileId);
        var loadingTask = PDFJS.getDocument(path+"?nc="+Math.random());
        loadingTask.onProgress = function(progress){
            panel.find('div.load-process').show();
            panel.find('div.load-process').css('width', ((progress.loaded/progress.total)*100)+'%');
        };
        loadingTask.promise.then(function(pdf){
            pdfFile[panel[0].id] = {'name': file, 'fid': fileId, 'pdf': pdf, 'panel': panel, 'dataLoaded': true};      //console.log('pdfFile: ',pdfFile);
                pdfCache[fileId] = {'name': file, 'pdf': pdf};
                panel.find('div.load-process').fadeOut(1000);  
                pdf2html(file, pdf, panel);
        }).catch(function(error){
            alert(error);
        });*/   
    }
    function loadEdits(fileId){
            angular.element("#JstreeCtrl").scope().getFileByUuid(fileId).then(function(result){       console.log("file: ", result);
                if(result.errors) return;
                if(result && result.state.length>0){
                    var lastState = result.state[result.state.length-1];                               //console.log("edits: ", JSON.parse(lastState.action) );
                   
                    pdfFile['pdf-editor'].edits = JSON.parse(lastState.action);                         //console.log("edits: ", pdfFile['pdf-editor'].edits);            
                }else {
                    
                    pdfFile['pdf-editor'].edits = false;
                }                                                                                       
            });
    }
    function setTab(panel, fileName){
        panel.find('.pdfTab').html(fileName+'<i class="fa fa-times" aria-hidden="true" style="margin-left: 15px; margin-right: 1em;" onclick="closeFile(this)"></i>');
    }
    function createPageList(pageList, numPages){
        pageList.empty();
        for (var i = 1;i <= numPages; i++){
            pageList.append('<option >'+i+'</option>');
        } 
        if(pageList.parents(".pageControl").length) pageList.parents(".pageControl").show();
    }
    function pdf2html(file, pdf, panel){
        $('.splitter').fadeIn(300);
        var fileZone = panel.find('.fileZone');
        
        genHtml(1, fileZone);
        render(pdf, fileZone, 1);
        //pdf.getMetadata().then(function(metadata){console.log('metadata',metadata);})
        setTab(panel, file);
        fileZone.css({'border': '1px solid #999', 'height': _EH}).scroll(function(e){
            hideEditMenu();         
        });
        if(panel[0].id=='pdf-frame'){                      // add page number to select pagelist
            //createPageList($('.link-editable-menu select.pageList'), pdf);
            $('.link-editable-menu select.pageList').attr("data-numPages", pdf.numPages);
            createPageList(pdfFrame.find('select.pageList'), pdf.numPages);
        }else {
            createPageList(pdfEditor.find('select.pageList'), pdf.numPages);
            var edits = pdfFile['pdf-editor'].edits;                            
            if(edits){                                                          console.log("get edits: ", edits);   
                replaceEdits(edits, 1, fileZone.find(".page-wrap"));
            }
        }
    }
    function closeFile(div){
        var panel;
        if($(div).parents('div.pdf-editor').length){
            if(!pdfFile['pdf-editor'].saved && hasValidOP(operationCount)){
                var response = confirm("There are some valid edits. Are you sure that you want to quit editting!");
                if(response==false) return; 
            }
            panel = $(div).parents('div.pdf-editor');
            panel.find('.pdfTab').html('PDF file to edit');                           //console.log(pdfFile);
            operationCount = 0;
            removeOperationCache();
        }else if($(div).parents('div.pdf-frame').length) {
            panel = $(div).parents('div.pdf-frame');                                    
            panel.find('.pdfTab').html('PDF file to view');                          //console.log(pdfFile); 
        }   
        closePanel(panel);
        panel.find('span.pageControl').hide(); 
        
        if(pdfEditor.attr('data-loaded')=='false' && pdfFrame.attr('data-loaded')=='false'){
                toggleSplitter(false);
        }else{
                //toggleSplitter(true);
        }
    } 
    function closePanel(panel){
        panel.attr('data-loaded', 'false');
        panel.find('.fileZone').fadeOut(100, function(){//$(this).empty();
            $(this).remove();
            $('<div class="fileZone"><div class="load-process">Loading...</div></div>').insertAfter(panel.find('.drop-file-zone'));
        });
        panel.find('.drop-file-zone').fadeIn(300);
    }
    pdfEditor.resize({
        minWidth: 350,
        maxWidth: $('.panel-container').width()-200,
        handleSelector: ".splitter",
        resizeHeight: false,
        onDragStart: function(e, $el, opts){ hideEditMenu(); },
        onDragEnd: function(e, $el, opts ){  
            for(var key in pdfFile){
                var o = pdfFile[key];                                           //console.log("pdfFile", o);
                if(o.panel){
                    var fileZone = o.panel.find('.fileZone');
                    if(o.panel.attr('data-loaded')=="true") render(o.pdf, fileZone, parseInt(fileZone.find(".page-wrap").attr("data-page-num")));
                }
            }
            var ob = pdfFile['pdf-editor'];                         //console.log('ob: ', ob);
            if(ob){ 
                scaleOperations( pdfEditor.find('.fileZone'));
            }
        }
    });
    function toggleSplitter(show){
        if(show){
            $('.splitter').show();
        }else{
            $('.splitter').hide();
        }
    }
    function scaleOperations(editZone){
        if(hasValidOP(operationCount)){
            //var scale = (editZone.width()-window.browserScrollbarWidth)/ob.pdfWidth;    //console.log('scale2',scale);                     
            var opList = getOpList();                                     
            for(var op in opList){
                if(opList[op].length>0){                                   
                    var operations = opList[op];                                //console.log(operations);
                    for(var i=0; i<operations.length; i++) {
                        var operation = operations[i];                            //console.log(operation);
                        var scale = (editZone.width()-window.browserScrollbarWidth)/operation.pw;
                        if(operation.boundingBox)                  // link edit 
                            $('#'+operation.id).css({
                                'width': operation.boundingBox.width * scale,
                                'height': operation.boundingBox.height * scale,
                                'top': operation.boundingBox.top * scale,
                                'left': operation.boundingBox.left * scale
                            });   
                        if(operation.position)                  // text edit 
                             $('#'+operation.id).css({
                                'left': operation.position.x * scale,
                                'top': operation.position.y * scale,
                                'font-size': operation.style.fontSize * scale,
                                'line-height': (operation.style.fontSzie+2) * scale
                            });  
                        //if(operation.page)       scaleTemplate(ob, scale, editZone.find('.page-wrap'));
                    }
                }
            }
        }else console.log('did not edit at all');        
    }
    function hasValidOP(op){
        if(op===0) return false;
        for(var i=op; i>=1; i--){
            var target = pdfEditor.find('.operation_'+i);
            if(target.length && target.is(":visible")) {return true; }
        }
        return false;
    }
    
    function genHtml(pageNum, fileZone) {                                                                  //console.log('page Num: ', pageNum);
        var pageWrap = $('<div class="page-wrap"><canvas class="page"></canvas></div>').attr("data-page-num", pageNum);  
            fileZone.append(pageWrap);
        var w = fileZone.width(), h = _EH;                                                                    
        pageWrap.find("canvas.page").attr("height", h).attr("width", w).css("visibility", "hidden");                     //console.log('filezone width ', fileZone, fileZone.width());
    }
    ////**************have not used the function getMetadata()************************************/
    /*function getMetadata(pdf) {
        pdf.getMetadata().then(function(t) {                                          //console.log('pdf metadata: ', t);
            t && t.info && t.info.Creator && t.info.Creator.indexOf("Canon") >= 0 && alert("Editing a scanned PDF? Warning: support for this type of documents is limited.", "warning")
        }).catch(function(t) {
            console.log(t);
        });
    }
    */
   
    function render(pdf,fileZone, e) {                                          //console.log("page: ", e);
                                                            
        pdf.getPage(e).then(function(page) {
               
            var n = page.getViewport(1),                                          
                scale = (fileZone.width()-window.browserScrollbarWidth)/ n.width,                                                 
                viewport = page.getViewport(scale),
                //pageWrap = fileZone.find(".page-wrap[data-original-page-num=" + e + "]").attr("data-scale", o).addClass("rendered").attr('data-pw', n.width);
                pageWrap = fileZone.find(".page-wrap").attr("data-scale", scale).attr('data-pw', n.width).attr("data-page-num", e);
           
            var canvas = pageWrap.find("canvas.page").get(0),
                ctx = canvas.getContext("2d");
                canvas.height = viewport.height,
                canvas.width = viewport.width;                                                //console.log('scale0: ', o);
            scaleFileZone(canvas, fileZone);
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
    }
    function showEdits(op, pageNum){
        if(op===0) return false;
        
        for(var i=op; i>=1; i--){
            var target = pdfEditor.find('.operation_'+i);
            if(target.length && target.is(":visible")) {target.css("z-index", -1);}
            var num = target.attr("data-page-num"); 
            if(num && num==pageNum) target.css("z-index", 10);
        }
        hideEditMenu();
    }
    function replaceEdits(edits, pageNum, pageWrap){                            //console.log("page no: ", pageNum)
        var linkEdits = edits["linkOperations"];                                
        var textEdits = edits["textOperations"];
        var editZone = pdfEditor.find('.fileZone');                             
        
        if(linkEdits && linkEdits.length>0){
            for (var i=0; i<linkEdits.length; i++){                               //console.log("page num: ", linkEdits[i].page);
                var lastOpNum = linkEdits[i].id.split("-")[2];
                if(operationCount<lastOpNum) operationCount = lastOpNum;
                //if(pageNum == parseInt(linkEdits[i].page)){ 
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
                
                var edit = createTargetShape(t, l, w, h, pageWrap, false, {id: id, tfid: tfid, page: page, tpage: tpage, uri: uri});
                if(pageNum !== parseInt(linkEdits[i].page)){
                    edit.css("z-index", -1);
                }
                //}
            }
        }
        if(textEdits && textEdits.length>0){
            for (var i=0; i<textEdits.length; i++){                               //console.log("page num: ", linkEdits[i].page);
                
                var lastOpNum = textEdits[i].id.split("-")[2];                   //console.log("edit no: ", lastOpNum);
                if(operationCount<lastOpNum) operationCount = lastOpNum;
               
                var scale = (editZone.width()-window.browserScrollbarWidth)/textEdits[i].pw;                  
                var t = textEdits[i].position.y * scale,
                        l = textEdits[i].position.x * scale, 
                        style = textEdits[i].style, 
                        id = textEdits[i].id, 
                        text = textEdits[i].text;
                        page = textEdits[i].page;
                style.fontSize = style.fontSize * scale;
                var edit = createTextEdit(pageWrap, t, l, text, {id: id, page: page, style: style});
                if(pageNum !== parseInt(textEdits[i].page)){
                    edit.css("z-index", -1);
                }
            }
        }
        hideEditMenu();
    }
   
    function scaleFileZone(canvas, fileZone){
        if(canvas.height < _EH){ 
                fileZone.animate({"height": canvas.height}, 300, function(){
                    $('.splitter').css({"height": canvas.height});
                });
            }else{
                fileZone.animate({"height": _EH}, 300, function(){
                     $('.splitter').css("height", _EH);
                });
            }
        //App.initSlimScroll(fileZone);
    }
    
    $(".right-tabs select.pageList").on('change', function(){
        var pageNum= parseInt($(this).find('option:selected').text()), panel, pdf;                                //alert($(this).find('option:selected').text());
        if($(this).parents('div.pdf-editor').length) {
            panel = $(this).parents('div.pdf-editor');
            pdf = pdfFile['pdf-editor'].pdf;
            showEdits(operationCount, pageNum);
        } else{
            panel = $(this).parents('div.pdf-frame');
            pdf = pdfFile['pdf-frame'].pdf;
        } 
        render(pdf, panel.find(".fileZone"), pageNum);
        
    });
    $("a.prePage").click(function(e){          //alert("a prePage click");
        var pageNum, pdf, panel;
        if($(this).parents('div.pdf-editor').length) {
            panel = $(this).parents('div.pdf-editor');
            pageNum = parseInt(panel.find(".page-wrap").attr("data-page-num"));
            pdf = pdfFile['pdf-editor'].pdf;
        } else{
            panel = $(this).parents('div.pdf-frame');
            pageNum = parseInt(panel.find(".page-wrap").attr("data-page-num"));
            pdf = pdfFile['pdf-frame'].pdf;
        } 
        if(pageNum >1){ 
            render(pdf, panel.find(".fileZone"), --pageNum);
            panel.find(".right-tabs select.pageList").val(pageNum);
            if($(this).parents('div.pdf-editor').length) showEdits(operationCount, pageNum);
        }
    });
    $("a.nextPage").click(function(e){          //alert("a prePage click");
        var pageNum, pdf, panel;
        if($(this).parents('div.pdf-editor').length) {
            panel = $(this).parents('div.pdf-editor');
            pageNum = parseInt(panel.find(".page-wrap").attr("data-page-num"));
            pdf = pdfFile['pdf-editor'].pdf;
            
        } else{
            panel = $(this).parents('div.pdf-frame');
            pageNum = parseInt(panel.find(".page-wrap").attr("data-page-num"));
            pdf = pdfFile['pdf-frame'].pdf;
        } 
        if(pageNum < pdf.numPages){ 
            render(pdf, panel.find(".fileZone"), ++pageNum);
            panel.find(".right-tabs select.pageList").val(pageNum);
            if($(this).parents('div.pdf-editor').length) showEdits(operationCount, pageNum);
        }
    });
    $(".pageNum").keydown(function(event){
        if(event.keyCode==13){
            var pageNum = parseInt($(this).val()), 
                pdf = $(this).parents("div.pdf-editor").length ? pdfFile['pdf-editor'].pdf : pdfFile['pdf-frame'].pdf , panel;            //alert(pageNum);
            if(!pageNum || pageNum<=0){ toastr.warning("Invalid page number !"); return;} 
            else if(pageNum < pdf.numPages){ 
                if($(this).parents("div.pdf-editor").length){
                    panel = $(this).parents('div.pdf-editor');
                    showEdits(operationCount, pageNum);
                }else{
                    panel = $(this).parents('div.pdf-frame');
                    //pdf = pdfFile['pdf-frame'].pdf;
                }
                render(pdf, panel.find(".fileZone"), pageNum);
                panel.find(".right-tabs select.pageList").val(pageNum);
            }
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
    
    //////////////////////////////////////////////
    //        edit pdf
    //////////////////////////////////////////////
    function toggleTool(t) {
        hideEditMenu(); removeTool(); if(!isTool(t)) setTool(t);
        //isTool(t) ? removeTool() : setTool(t);                                                       //console.log('tool ',editPages.attr("data-tool")); 
    }
    function isTool(t) {
        return pdfEditor.attr("data-tool") == t;
    }
    
    var  toolsMenu = $("#tools-menu");//,hint = $("#global-help-hint"),Ct,;
    function removeTool() {
        toolsMenu.find("[data-tool]").removeClass("active"),                    
            pdfEditor.attr("data-tool", "none");
    }
    function setTool(t) {
        var a = toolsMenu.find("[data-tool=" + t + "]");
        //removeTool(),
            pdfEditor.attr("data-tool", t),
            a.addClass("active");
    }
    function hideEditMenu(){
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
    pdfEditor.on("click", function(evt) {                                                                 
        var e = $(evt.target);                  //console.log("Mouse clicked at ", e); // X(e, class) - e.hasClass(class)
        if (!(X(e, "text-editable-menu") || X(e, "link-editable-menu") || X(e, "text-editable") || X(e, "target-editable"))) {                                                                  
           hideEditMenu();
            if ((e.hasClass("page") || e.hasClass("not-editable"))&&isTool('text')) {      //console.log('mouse click at canvas')
                if (Et)return;
                //Analytics.trackEvent("pdf-editor-usage", "text-tool", "inserted");
                var u = e.parents(".page-wrap"),
                    top = evt.pageY - u.offset().top - window.lastTextEditSettings.size,
                    left = evt.pageX - u.offset().left - 7; 
                createTextEdit(u,top, left, "www.sample.com" );
                    /*f = $("<div></div>").css({
                        position: "absolute",
                        "z-index": "10",
                        top: evt.pageY - u.offset().top - window.lastTextEditSettings.size,
                        left: evt.pageX - u.offset().left - 7
                    });                                                     
                u.append(f),                                                   //console.log('textinput ', f.offset().left);
                    f.html("www.sample.com").inlineEditor();*/
            }
        }
    });
    function X(t, e) {
        return t.hasClass(e) || t.parents("." + e).length > 0;
    }
    function createTextEdit(pageWrap, top, left, text, obj){                    //console.log("page no: ", pageWrap.attr("data-page-num"));
        var f = $("<div></div>").css({
                "position": "absolute",
                "z-index": "10",
                "top": top,               //evt.pageY - u.offset().top - window.lastTextEditSettings.size,
                "left": left                   //evt.pageX - u.offset().left - 7
            });
        if(obj&&obj.page)  f.attr({ "data-page-num": obj.page});  
        else f.attr({ "data-page-num": pageWrap.attr("data-page-num")});                                                     
        pageWrap.append(f),                                                   //console.log('textinput ', f.offset().left);
            f.html(text).inlineEditor(obj);
        pdfFile["pdf-editor"].saved = false;
        return f; 
    }
    jQuery.fn.inlineEditor = function(obj) {                //
            var o = $(this[0]);
            removeOperationCache();
            if(obj && obj.id) o.attr("id", obj.id).addClass('operation_'+obj.id.split("-")[2]);
            else o.attr("id", "text-editable-" + ++operationCount).addClass('operation_'+operationCount);
            o.addClass("text-editable").attr("contenteditable", "true").on("focus", function(t) {
                    setPosnFont(o, r),
                        o.draggable("disable")
                }),
                o.click(function(t) {
                    o.is('[contenteditable="false"]') && (o.attr("contenteditable", "true"),
                        o.focus())
                }),
                o.keypress(function(t) {
                    return 13 != t.which
                }),
                o.dblclick(function() {
                    //o.selectText()
                }),
                o.blur(function(t) {
                    Et = !0,
                        setTimeout(function() {
                            Et = !1
                        }, 100)
                }),
                o.on("paste", function(t) {
                    t.preventDefault();
                    var e = "";
                    t.clipboardData || t.originalEvent.clipboardData ? e = (t.originalEvent || t).clipboardData.getData("text/plain") : window.clipboardData && (e = window.clipboardData.getData("Text"));
                    try {
                        document.queryCommandSupported("insertText") ? document.execCommand("insertText", !1, e) : document.execCommand("paste", !1, e)
                    } catch (t) {
                        document.execCommand("paste", !1, e)
                    }
                });
            var r = o.parents(".page-wrap"),
                u = parseFloat(r.attr("data-scale")),
                weight = void 0,
                size = obj? obj.style.fontSize : 0,
                color = obj? obj.style.color : 0,
                font = 0,
                d = void 0;                                                     console.log("color: ", color);
            (size = size || u * window.lastTextEditSettings.size + "px",
                    font = font || window.lastTextEditSettings.font,
                    color = color || window.lastTextEditSettings.color,
                    weight = weight || window.lastTextEditSettings.weight,
                    d = d || window.lastTextEditSettings.style),
                o.css({
                    "font-size": size,
                    //"line-height": size+2,
                    color: color,
                    "font-family": font,
                    "font-weight": weight,
                    "font-style": d
                }),
                o.draggable({
                    containment: r
                }),
                o.focus();
        };
    function setPosnFont(textinput, pageWrap) {
        var a = $("#text-editable-menu");
        var u = parseFloat(pageWrap.attr("data-scale")),
            s = textinput.css("font-size").slice(0,-2) / u;
        a.find("input[name=fontSize]").val(s),
            a.css({
                position: "absolute",
                "z-index": "1000",
                top: textinput.offset().top + textinput.height() -35,
                left: textinput.offset().left
            }).attr("data-target-id", textinput.attr("id")).show();                               //console.log('text edit menu', textinput.offset().left);
    }
    
    var Et = !1, operationCount=10, operationCache=[], backIndex=0; // Et - editable
    $(document).keydown(function(e){                 // hand undo/redo hotkey
        if( e.which === 89 && e.ctrlKey ){
            if(pdfEditor.attr('data-loaded')==='true') forwardHandler();                                                   //alert('control + y'); 
        }else if( e.which === 90 && e.ctrlKey ){
            if(pdfEditor.attr('data-loaded')==='true') backwardHandler();                                                      //alert('control + z'); 
        }          
    }).keyup(function(e) {27 == e.keyCode && removeTool() });
    
    toolsMenu.find("[data-tool=backward]").click(function(){backwardHandler()});
    toolsMenu.find("[data-tool=forward]").click(function(){forwardHandler()});
    toolsMenu.find("[data-tool=refresh]").click(function(){
        removeTool("refresh");
        if(pdfEditor.attr('data-loaded')==='true'){
            render(pdfFile['pdf-editor'].pdf, pdfEditor.find('.fileZone'), parseInt(pdfEditor.find(".page-wrap").attr("data-page-num")));
        }
        if(pdfFrame.attr('data-loaded')==='true'&& pdfFrame.find(".fileZone").is(":visible")) 
            render(pdfFile['pdf-frame'].pdf, pdfFrame.find('.fileZone'), parseInt(pdfFrame.find(".page-wrap").attr("data-page-num")));
    });
    function forwardHandler(){
        removeTool("forward");   
        toolsMenu.find("[data-tool=forward]").addClass('active', {duration: 100}).removeClass('active', {duration: 100});                                                       //console.log(operationCache)
        if(operationCache.length){
            var _id = operationCache.pop(); 
            var target = pdfEditor.find('.operation_'+_id);            
            if(target.length){
                target.show(); 
                backIndex=_id; 
            } 
        }                                                                       //console.log('cache', operationCache)
    }function backwardHandler(){
        removeTool("backward");
        toolsMenu.find("[data-tool=backward]").addClass('active', {duration: 100}).removeClass('active', {duration: 100});
        if(backIndex===0 && operationCount>0 &&!operationCache.length) 
            backIndex = operationCount;
        removeLastOperation();                                                  console.log('back index: ', backIndex, operationCache);
                                                           
    }function removeLastOperation(){
        if(backIndex<=0) return; 
        var target = pdfEditor.find('.operation_'+backIndex);                           console.log('target',target, backIndex)
        if(target.length && target.is(":visible")){
            /*if(target[0].id.toString().indexOf('page')<0)*/ 
            $('body').find("[data-target-id="+target[0].id+"]").hide();
            target.hide();//target.css('visibility', 'hidden'); 
            operationCache.push(backIndex); backIndex--; return;
        } else {backIndex--; removeLastOperation();}
    }function removeOperationCache(){
        if(operationCache.length){
          while(operationCache.length){
            var target = pdfEditor.find('.operation_'+operationCache.pop());            
            if(target.length){
                target.remove();
                //if(target[0].id.toString().indexOf('page')>=0) resetPageNum();  //if operation is insert page, reset page number
            } 
          }
          
        }              backIndex=0;                                                         //console.log('cache', operationCache)
    }
  
    toolsMenu.find("[data-tool=text]").click(function() {
        //    Analytics.trackEvent("pdf-editor-usage", "text-tool", "pressed"),W()
        toggleTool("text");        
    });
    toolsMenu.find("[data-tool=link]").click(function() {
            // Analytics.trackEvent("pdf-editor-usage", "link-tool", "pressed"),
        toggleTool("link");
    });
    toolsMenu.find("[data-tool=select]").click(function() {
            // Analytics.trackEvent("pdf-editor-usage", "select-tool", "pressed"),
        if(pdfFrame.attr('data-loaded')=='true' && pdfFile['pdf-frame']) toggleTool("select");
    });
    /*toolsMenu.find("[data-tool=delete]").click(function(){
        // Analytics.trackEvent("pdf-editor-usage", "delete-tool", "pressed"),
        removeTool('delete');                                                   //console.log(window.currentPage());
    });*/
    $(".link-editable-menu .delete-opts").click(function() {
            //Analytics.trackEvent("pdf-editor-usage", "link-tool", "delete");
            var t = $(this),
                e = $("#" + t.parents(".link-editable-menu").attr("data-target-id"));
            e.remove(),
                t.parents(".link-editable-menu").hide();
        });
    $(".text-editable-menu .font-size-opts input[name=fontSize]").on("input change", function(t) {
            //Analytics.trackEvent("pdf-editor-usage", "text-tool", "font-size");
            var e = $(this),
                a = parseInt(this.value),
                i = getTextTarget($(this)),
                r = parseFloat(i.parents(".page-wrap").attr("data-scale"));
            setStyle(e, "font-size", r * a + "px"),
                setStyle(e, "line-height", r * a + "px"),
                setStyle(e, "height", ""),
                window.lastTextEditSettings.size = a
                $('.font-size-opts').attr('title',window.lastTextEditSettings.size);
        }),
        $(".text-editable-menu .color-opts a").click(function() {
            //Analytics.trackEvent("pdf-editor-usage", "text-tool", "color");
            var t = $(this),
                e = t.css("background-color");
            setStyle(t, "color", e),
                window.lastTextEditSettings.color = e;
        }),
        $(".text-editable-menu .font-family-opts a").click(function(){
            var t = $(this),
                e = t.attr("data-font");
            setStyle(t, "font-family", e),
                window.lastTextEditSettings.font = e
        });
    $(".text-editable-menu .font-bold-opts").click(function() {
            //Analytics.trackEvent("pdf-editor-usage", "text-tool", "bold");
            window.lastTextEditSettings.weight = r($(this), "font-weight", "bold", "400")
        }),
        $(".text-editable-menu .font-italic-opts").click(function() {
            //Analytics.trackEvent("pdf-editor-usage", "text-tool", "italic");
            window.lastTextEditSettings.style = r($(this), "font-style", "italic", "normal")
        }),
    $(".text-editable-menu .delete-opts").click(function() {
            //Analytics.trackEvent("pdf-editor-usage", "text-tool", "delete");
            var t = $(this),
                e = $("#" + t.parents(".text-editable-menu").attr("data-target-id"));
            e.hasClass("existingTextEdit") ? e.text("") : e.remove(),
                t.parents(".text-editable-menu").hide();
    });
    $(".link-editable-menu select.fileList").on('change', function(){
        var sOption= $(this).find('option:selected');                                //console.log("tfid: ", sOption.attr('id'));
        //$("#" + $(this).parents(".link-editable-menu").attr("data-target-id")).attr({"data-uri": sOption.text(), "data-target-fid":sOption.attr('id') }); 
        //var filePath= JsTree.getPathById(sOption.attr('id'));                   console.log(filePath);
        $("#" + $(this).parents(".link-editable-menu").attr("data-target-id")).attr({"data-target-fid":sOption.attr('id'), "data-uri": sOption.text()}); 
    });
    $(".link-editable-menu select.pageList").on('change', function(){
        var sOption= $(this).find('option:selected');                                console.log(sOption.text());
        $("#" + $(this).parents(".link-editable-menu").attr("data-target-id")).attr("data-target-page", sOption.text());
        var ob = pdfFile["pdf-frame"]; if (pdfFrame.attr('data-loaded')=='true'){ render(ob.pdf, pdfFrame.find(".fileZone"), parseInt(sOption.text())); }

    });
    // selection for link
    (function() {
            var el, x1 = 0,  x2 = 0,                // el - element $(this)
                y1 = 0, y2 = 0,
                u = $("#selectionBorder"),
                s = !1;
           
            $(document).on("mousedown", ".page-wrap", function(e) {
                hideEditMenu();  
                if((isTool("link")||isTool("select")) && $(this).parents('.pdf-editor').length){
                    e.preventDefault(),
                    s = !0,
                    el = $(this),
                    u.show(),
                    x2 =  x1 = e.pageX,
                    y2 = y1 = e.pageY,
                    setPositions();                                             //console.log('mousedown', el)
                }
                    /*(isTool("link")||isTool("select")) && $(this).parents('.pdf-editor').length && (
                            e.preventDefault(),
                        s = !0,
                        el = $(this),
                        u.show(),
                        x2 =  x1 = e.pageX,
                        y2 = y1 = e.pageY,
                        setPositions());     */                                  // console.log('pdf-editor:', $(this).parents('.pdf-editor'));
                }),
                $(document).on("mousemove", function(e) {
                    (isTool("link")||isTool("select")) && s && (x2 = e.pageX,
                        y2 = e.pageY,
                        setPositions());
                }),
                $(document).on("mouseup", function(t) {
                    u.hide();
                    if ( (isTool("link")||isTool("select")) && s) {             
                        //u.hide();
                        var leftX = Math.min(x1, x2),
                            rightX = Math.max(x1, x2),
                            topY = Math.min(y1, y2),
                            bottomY = Math.max(y1, y2),
                            g = el.find("canvas.page"),                                 
                            h = leftX - g.offset().left,
                            m = topY - g.offset().top,
                            width = rightX - leftX,
                            height = bottomY - topY;                                            //console.log('page position: ', g.offset().left, g.offset().top);
                                                                                                
                        if (width < 5 || height < 5)
                            return;
                        createTargetShape(m, h, width, height, el, isTool('select'));
                            s = !1;
                            removeTool();                                       //console.log('editable', s)
                    }
                });
              
            function setPositions() {
                var t = Math.min(x1, x2),
                    e = Math.max(x1, x2),
                    i = Math.min(y1, y2),
                    s = Math.max(y1, y2);
                u.css({
                    left: t + "px",
                    top: (i-50)  + "px",
                    width: e - t + "px",
                    height: s - i + "px"
                });
            }
        })();

    function createTargetShape(t, l, w, h, pageWrap, select, link) {                  // t- top, l - left, i - width, n - height, 
                                                                                                     //console.log('rectangle: ', link);
        w = w || 200, h = h || 100;
        var target = $('<div class="target-editable"></div>');                                           // link retangle
        if(link && link.id) target.attr({"id": link.id, "data-target-fid": link.tfid, "data-page-num": link.page, "data-target-page": link.tpage, "data-uri": link.uri})
                                    .addClass('operation_'+link.id.split("-")[2]);
        else target.attr({"id": "target-editable-" + ++operationCount, "data-page-num":pageWrap.attr("data-page-num")}).addClass('operation_'+operationCount);
        removeOperationCache();                                                                                 //parseFloat(o.attr("data-scale"));
        target.css({
                width: w + "px",
                height: h + "px",
                position: "absolute",
                top: t + "px",
                left: l + "px" 
                
            }).draggable().resizable({
                handles: "all"
            }).addClass("active").addClass("shape-rectangle");
                    
        if(!link) setTimeout(function() { openLinkEdit(target, select);  }, 100);    

            target.click(function(t) {
                var e = $(this);
                openLinkEdit(e, select),
                    target.find(".ui-resizable-handle").show(),
                    target.addClass("active");
            }).on("resizestart", function() {
                //e()
            }).on("resizestop", function() {
                setTimeout(function() {
                    openLinkEdit(target, select);
                }, 100);
            }).on("dragstart", function() {
                $("#link-editable-menu").hide();
            }).on("dragstop", function() {
                setTimeout(function() {
                    //c(target)
                    openLinkEdit(target, select);
                }, 100);
            }).on("mouseover", function() {
                target.find(".ui-resizable-handle").show();
            }).on("mouseout", function() {
                //var t = $("#target-editable-menu");
                var t=$('#link-editable-menu');
                target.hasClass("active") || t.is(":visible") && t.attr("data-target-id") == target.attr("id") || target.find(".ui-resizable-handle").hide()
            });
            if(select) 
                target.attr({"data-uri": pdfFile['pdf-frame'].name, "data-target-fid":pdfFile['pdf-frame'].fid });
           
            pageWrap.append(target);                                            //console.log("append edit: ", pageWrap);
            pdfFile["pdf-editor"].saved = false;
            return target;
    }
    function openLinkEdit(t, select) {                                                                           //  console.log("f1");
        var e = $("#link-editable-menu"), fileListSelect = $('.link-editable-menu select.fileList'), pageList =$('.link-editable-menu select.pageList'); 
        if(select) {
            if(t.attr('data-target-fid') && t.attr('data-uri'))                                     // pageList is not first time loaded 
                fileListSelect.val( t.attr('data-uri')).attr('disabled', 'disabled');
            else fileListSelect.val( pdfFile['pdf-frame'].name).attr('disabled', 'disabled');      // pageList is loaded first time 
            
            if(t.attr("data-numPages")){ 
                createPageList(pageList, t.attr("data-numPages"));           //pageList
                pageList.val(t.attr('data-target-page'));
            }else if(pageList.attr("data-numPages")){
                createPageList(pageList, pageList.attr("data-numPages"));
                t.attr("data-numPages", pageList.attr("data-numPages"));
            }else 
                pageList.val(t.attr('data-target-page')).attr('disabled', 'disabled');;
            pageList.show();
        }else {
            if(t.attr('data-target-page')>1 && t.attr('data-uri')){             console.log(t.attr('data-target-page'));
                fileListSelect.val( t.attr('data-uri')).attr('disabled', 'disabled');
                createPageList(pageList, t.attr('data-target-page'));
                pageList.val(t.attr('data-target-page')).attr('disabled', 'disabled').show();
            }else{
                var sText;
                $("select.fileList option").each(function(){ 
                    if(t.attr('data-target-fid') && $(this).attr('id')==t.attr('data-target-fid')) {
                        $(this).attr('selected' ,'selected'); sText = $(this).text();
                    }else $(this).removeAttr('selected');
                });

                fileListSelect.removeAttr('disabled').val(sText);
                pageList.hide();
            }
            
            
        } //else{ fileListSelect.val( pdfFile['pdf-frame'].name).attr('disabled', 'disabled'); }
       
        //e.find("input").val(t.attr("data-uri") || ""),
        e.css({
                position: "absolute",
                "z-index": "1000",
                top: t.offset().top + t.height()-30,
                left: t.offset().left
            }).attr("data-target-id", t.attr("id")).show();
    }
    function getTextTarget(t) {
        return $("#" + t.parents(".text-editable-menu").attr("data-target-id"))
    }
    function setStyle(t, e, a) {
        var i = {};
        i[e] = a, getTextTarget(t).css(i).focus();   
    }
    function r(t, e, a, i) {
        var r = getTextTarget(t).css(e);
        return r == i ? (setStyle(t, e, a),
            a) : (setStyle(t, e, i),
            i);
    }
    
    //////////////////////////////////////////// //////////////////////////////
    //              Saving PDF file
    ///////////////////////////////////////////////////////////////////////////
    //var opList = {};
    var operations = ["textOperations", "linkOperations"];
    $("#save-pdf-btn").click(function(t) {
        if(!pdfFile['pdf-editor']) {alert('file not opened!!!'); return;}       //console.log(hasValidOP(operationCount));
        if(!hasValidOP(operationCount)) {alert('file not edited!!!'); return;}
        
        removeOperationCache();                                   // to remove operations deleted but saved in cache
            t.preventDefault();
            var e = [];
            // debugger;
            pdfEditor.find(".text-editable").each(function() {                  //console.log("text-editable: ", $(this));          
                    var t = $(this);
                    "www.sample.com" == t.text() && e.push(t);
                }),
                e.length > 0 && removeTextPrompt(function(t) {    
                    "yes" == t && e.forEach(function(t) {
                            t.remove();});
                        });
            pdfEditor.find(".target-editable").each(function(){                 //console.log("target-editable: ", $(this));
               if(!$(this).attr('data-target-fid')) $(this).remove(); 
            });
            sendOpList(getOpList());                                            //it(getOpList()); // it - submit
    });function sendOpList(opList){                                             //console.log("opList", opList)
        //if(!hasValidOP(operationCount)) {alert('file not edited!!!'); return;}
        var opl = opList;
        for(var op in opl){
            if(opl[op].length<=0) delete opl[op];
        }
        var ob = pdfFile['pdf-editor'];                                         console.log("opList: ", JSON.stringify(opl));
        
        var postData = {"action": JSON.stringify(opl), "state": "0"};
        angular.element("#JstreeCtrl").scope().saveEdits(ob.fid, postData).then(function(result){ console.log(result);
            if(result && result.id) toastr.success("edits saved");
            ob.saved = true; 
        });
    }
    /*$("#save-pdf-btn").click(function(t) {
        if(pdfEditor.attr('data-loaded')=='false') return;
        var ob = pdfFile['pdf-editor'];
        if(!ob.tempname){
           alert("Please check the file before saveing !!!"); return;
        }
        if(ob.tempname && ob.lastOp !== operationCount){
           alert("There has been some edits before last check. Please check again !!!"); return; 
        }
        hideEditMenu();
        $.post('php/savefile.php',{name: ob.name, tempname: ob.tempname }, function(result){
            closeFile(pdfEditor.find('div.fileZone'), true);
            if(result=="") { 
                delete ob.tempname;
                pdfCache[ob.fid].saved=true;                            console.log('pdf cache',pdfCache);
            }
        });
    });*/
    function removeTextPrompt(confirm) {                                  console.log('text-editable checking before submit' );
        var e = $("#removeUnusedTextPrompt");
        e.find(".btn-yes").off("click").on("click", function() {
                confirm("yes"),
                    e.modal("hide")
            }),
            e.find(".btn-no").off("click").on("click", function() {
                confirm("no"),
                    e.modal("hide")
            }),
            e.modal("show")
    } 
    function applyFun(t, e) {
        return function() {
            try {
                e.apply(this)
            } catch (e) {
                console.log("Exception occurred", t, e);//Raven.captureException(e)      
            }
        }
    }
    function getOpList() {                                                                //console.log("caller is " + arguments.callee.caller.toString());
        var t = {};
        operations.forEach(function(e) {  // Tt - editor tool functions array
            t[e] = []; 
        });
         pdfEditor.find(".text-editable").each(applyFun(".text-editable", function() {   
                var e = $(this);                                                //console.log(e);                       
                //if (!e.hasClass("existingTextEdit")) {
                    var a = e.parents(".page-wrap"),
                        i = a.find("canvas.page"),
                        n = a.attr("data-scale"), //Big(a.attr("data-scale"))
                       
                        r = e.css("font-family").split(",")[0].trim().toLowerCase(),
                        u = "times_roman";                                                  //console.log('font-fam: ',r)
                    r.indexOf("helvetica") >= 0 && (u = "helvetica"),
                        r.indexOf("Courier New") >= 0 && (u = "courier");
                    var s = e.css("font-size").slice(0, -2),
                        d = s/n,  //Big(s).div(n),
                        //l = e.height(),
                        //c = (l-d)/2, //Big(l).minus(d).div(2),
                        f = {
                            id: $(this)[0].id,
                            text: Y(e.text()),
                            pw: parseInt(a.attr('data-pw')),
                            position: {
                                x: parseInt(e.css("left").slice(0, -2)/n),//Big(e.css("left").slice(0, -2)).div(n),
                                y: parseInt((e.offset().top-i.offset().top)/n) //Big(i.attr("height")).minus(Big((e.css("top")))).minus(l).plus(c).div(n)
                               
                            },
                            style:{
                                font: u,
                                fontSize: d,
                                color: getColor(e.css("color")),
                                bold: "bold" == e.css("font-weight"),
                                italic: "italic" == e.css("font-style")
                            },  
                            page: e.attr("data-page-num"),
                        };
                    "" != f.text.trim() && t.textOperations.push(f)
                //}
            })),
        pdfEditor.find(".target-editable").each(applyFun(".target-editable", function(){       //console.log('inside at function - target', new Big(1, 5));
                 
                var  a =  $(this).parents(".page-wrap"),
                    n = parseFloat(a.attr("data-scale")),
                   // u = this.getBoundingClientRect(),
                    d =  $(this).offset(),
                    id = $(this)[0].id,
                    l = a.offset(),
                    f = {
                        left: (d.left - l.left)/n,                   //parseInt(new Big(d.left - l.left).div(n).round()),
                        top: (d.top - l.top)/n,                       //parseInt(new Big(parseInt(i.attr("height")) - (d.top - l.top)).div(n).round()),
                        width: parseInt($(this).width()/n),
                        height: parseInt($(this).height()/n)
                    };
                //f.left >= 0 && f.top >= 0 && f.right >= 0 && f.bottom >= 0 && f.top > f.bottom && f.left < f.right ? c.push(f) : console.log("Ignoring invalid link bounding box", f);
                                                                                                            //console.log('id',id);
                var p = {
                    id: id,
                    boundingBox: f,
                    pw: parseInt(a.attr('data-pw')),
                    page: $(this).attr("data-page-num"),
                    tfid: $(this).attr('data-target-fid'),         // target-fid
                    uri:  $(this).attr("data-uri"),           //$(this).attr('data-fid');               no need in real application because of tfid
                    tpage: $(this).attr("data-target-page")?$(this).attr("data-target-page"):1
                };
                p.id /*&& p.uri*/ && t.linkOperations.push(p);                    //console.log(c); to JSON.stringify(p) before sending to server
            }));
            return t;
    }
    
    function getColor(t) {
        if ("rgba(0, 0, 0, 0)" != t.trim() && "transparent" != t.trim()) {
            if (0 == t.trim().indexOf("rgb(")) {
                var e = t.slice(4, -1).split(","); return e;  
            }
        }
        return [0,0,0];
    }
    function Y(t) {
        var kt = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
        return t.replace(kt, "").replace(/\u3000/g, " ").replace(/\u2003/g, " ").replace(/\u2002/g, " ").replace(/\u2005/g, " ").replace(/\u2006/g, " ").replace(/\u2000/g, " ").replace(/\u202F/g, " ").replace(/\u0009/g, "").replace(/\u200B/g, "").replace(/\u2028/g, "")
    }
   
    /*
    $("#download-btn").click(function(){                                        
        var appUid = angular.element("#JstreeCtrl").scope().getAppUid();         
        var userData = angular.element("#JstreeCtrl").scope().getUserData();        console.log("downloading .....", appUid, userData);
        
        var url = Base_URL + "/a/application/file/getZipFilesByAppUid/" + appUid +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        
        xhr.onload = function(e) {
            if (this.status === 200) {                                          //console.log("zip file: ",this.response);
                var blob = new Blob([this.response], {type: 'application/zip'}),
                file = URL.createObjectURL(blob);           
                
                var link = document.createElement('a');
                link.href = file;
                link.download = "ectd";
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        };
        xhr.send();
        
    });*/

