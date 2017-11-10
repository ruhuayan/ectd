    //if(JsTree) delete JsTree;
    var _EH = $(window).height()-200;
    function Jstree(id, height){
        Filetree.call(this, id, height);
        this.ctrlId = "#EditTreeCtrl";
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
        },
        setFileDragListener: function(){
            var _this = this;
            $(document).on('dnd_move.vakata', function (e, data) {                    //console.log(data.element.text.indexOf(".pdf"))
                if(data.element.text.indexOf(".pdf")<1) return;

                var t = $(data.event.target);
                if(t.parents('div.pdf-editor').length && t.parents('div.pdf-editor').attr('data-loaded')=='false' )
                    data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
                if(t.parents('div.pdf-frame').length )
                    data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
                var nodeId = $(data.element);
                var preNode = $('#jsECTDtree').jstree(true).get_selected(true);
                if(preNode) $('#jsECTDtree').jstree(true).deselect_node(preNode);
                $('#jsECTDtree').jstree("select_node", nodeId, true);

            }).on('dnd_stop.vakata', function (e, data) {

                var fileName = $.trim(data.element.text), fileId = data.data.nodes[0]; // filePath = data;            console.log(filePath);
                if(fileName.indexOf('.pdf')<1) return;

                var t = $(data.event.target);                             //console.log(data);
                //if(fileName.indexOf('.pdf')>0) {

                if(t.parents('div.pdf-editor').length && pdfEditor.panel.attr('data-loaded')=='false')
                    pdfEditor.setEditCount()
                        .loadEdits(fileId)
                        .openPanel(fileName, fileId, function(_this){
                            pdfEditor.replaceEdits(_this);
                            pdfEditor.fileUnsaved = false;
                        });
                else if(t.parents('div.pdf-frame').length && pdfFrame.panel.attr('data-loaded')=='false'){
                    pdfFrame.panel.attr("data-replace", "false");
                    pdfFrame.openPanel(fileName, fileId, function(){
                        pdfFrame.panel.attr("data-replace", "true");
                    });
                } else if(t.parents('div.pdf-frame').length && pdfFrame.panel.attr("data-replace")!="false"){
                    if(pdfFrame.fileName == fileName) return;                             // prevent from opeing the same file

                    pdfFrame.fileZone.empty().append('<div class="load-process">Loading...</div>');
                    pdfFrame.openPanel(fileName, fileId, function(){
                        var linkMenu = $(".link-editable-menu");
                        if(linkMenu.css('display') == 'block'){                        // when link edit menu is on focus, change the file and page list
                            var pageList = $(".link-editable-menu select.pageList"), target = $("#" + linkMenu.attr("data-target-id")) ;
                            pdfEditor.createPageList(pdfFrame.pdf.numPages, pageList);
                            $(".link-editable-menu select.fileList").val(fileName);               //console.log(target);
                            target.attr({"data-uri": pdfFrame.fileName, "data-target-fid": pdfFrame.fid, "data-numpages": pdfFrame.pdf.numPages, "data-target-page": 1});
                        }
                    });

                }
                //}
            }).keyup(function(e) {27 == e.keyCode && pdfEditor.removeTool() });
        }
    };
    Jstree.prototype.__proto__ = Filetree.prototype;
    var JsTree = new Jstree("#jsECTDtree", _EH );
    JsTree.setFileDragListener();

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
            this.fileZone.show();                              //console.log(JsTree.userData);

            //this.__userData = this.__userData || angular.element(JsTree.ctrlId).scope().getUserData();
            var url = Base_URL + "/a/application/file/get_by_file_id/" + fileId + "/?uid=" + JsTree.userData.uid +"&apptoken=" + JsTree.userData.access_token;
            //var url = Base_URL + "/a/application/file/download/" + fileId +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;

            var _this = this;
            $.get(url, function(result){
                if(!result || !result.ectdFileStateList.length ) return;
                var uuid = result.ectdFileStateList[0].uuid;
                var fileURL = Base_URL + "/a/application/file/download/" + uuid +"/?uid=" + JsTree.userData.uid +"&apptoken=" + JsTree.userData.access_token;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', fileURL, true);
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
                            _this.panel.find('div.load-process').show();
                            _this.panel.find('div.load-process').css('width', ((progress.loaded/progress.total)*100)+'%');
                        };
                        loadingTask.promise.then(function(pdf){
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
            });
                                                            //console.log(_this.panel);

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
                                                                                                            //console.log("before edits")
            //if(this.id == "pdf-editor") this.replaceEdits();      // for pdfEditor
            //if(this.setPageList) this.setPageList();        // for pdfFrame
            if(callback) callback(_this);
        },
        genHtml: function() {                                                                  
            var pageWrap = $('<div class="page-wrap"><canvas class="page"></canvas></div>').attr("data-page-num", 1);  
            this.fileZone.append(pageWrap);                                                                 
            pageWrap.find("canvas.page").attr("height", _EH).attr("width", this.fileZone.width()).css("visibility", "hidden");
            this.pageWrap = pageWrap;
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
                    viewport = page.getViewport(scale);
                _this.pageWrap.attr("data-scale", scale).attr('data-pw', n.width).attr("data-page-num", e);
                                                                                        //console.log("scale", scale);
                var canvas = _this.pageWrap.find("canvas.page").get(0),
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
                    _this.pageWrap.find("canvas.page").css("visibility", "visible");
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
        setPageControlHandler: function(){
            var pageList = this.panel.find('.right-tabs select.pageList');
            var _this = this;
            pageList.on("change", function(){
                var pageNum= parseInt($(this).find('option:selected').text());                               //alert($(this).find('option:selected').text());
                _this.render(pageNum);
                if(_this.showEdits) _this.showEdits(pageNum);                         //if pdf-Editor, show edits
            });

            _this.panel.find("a.prePage").click(function(e){          //alert("a prePage click");

                var pageNum = parseInt(_this.pageWrap.attr("data-page-num"));
                if(pageNum >1){
                    _this.render(--pageNum);
                    pageList.val(pageNum);
                    if(_this.showEdits) _this.showEdits(pageNum);
                }
            });
            _this.panel.find("a.nextPage").click(function(e){          //alert("a prePage click");

                var pageNum = parseInt(_this.pageWrap.attr("data-page-num"));

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
            if(this.fileUnsaved) angular.element(JsTree.ctrlId).scope().setModal(this.fid, this.getEditList());

            var panel = this.panel.attr('data-loaded', 'false');
            panel.find('.pdfTab').html(tabText);
            panel.find('.right-tabs .pageNum').val("");
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

    var pdfFrame = new PdfPanel("pdf-frame");
    pdfFrame.setPageControlHandler();

    function PdfEditor(id){
        PdfPanel.call(this, id);
        this.editCount = 0;
        this.toolsMenu = $("#tools-menu");
    }
    PdfEditor.prototype = {
        setEditCount: function(){
            this.editCount = 0;
            return this;
        },
        scaleEdits: function(){
            if(this.hasValidOP()){
                var opList = this.getEditList();
                for(var op in opList){
                    if(opList[op].length>0){
                        var operations = opList[op];                                //console.log(operations);
                        for(var i=0; i<operations.length; i++) {
                            var operation = operations[i];                            //console.log(operation);
                            var scale = (this.fileZone.width()-window.browserScrollbarWidth)/operation.pw;
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
                        }
                    }
                }
            }else console.log('did not edit at all');
            return this;
        },
        hasValidOP: function(){
            if(this.editCount===0) return false;
            for(var i=this.editCount; i>=1; i--){
                var target = this.panel.find('.operation_'+i);
                if(target.length && target.is(":visible")) {return true; }
            }
            return false;
        },
        getEditList: function(){
            var _this = this, edits = {'linkOperations':[], 'textOperations': []}, pageWrap = this.pageWrap;
            this.panel.find(".target-editable").each(function(index, value){       //console.log('inside at function - target', new Big(1, 5));
                var n = parseFloat(pageWrap.attr("data-scale")),
                    d =  $(this).offset(),
                    id = $(this)[0].id,
                    l = pageWrap.offset(),
                    f = {
                        left: (d.left - l.left)/n,                   //parseInt(new Big(d.left - l.left).div(n).round()),
                        top: (d.top - l.top)/n,                       //parseInt(new Big(parseInt(i.attr("height")) - (d.top - l.top)).div(n).round()),
                        width: parseInt($(this).width()/n),
                        height: parseInt($(this).height()/n)
                    };
                var p = {
                    id: id,
                    boundingBox: f,
                    pw: parseInt(pageWrap.attr('data-pw')),
                    page: $(this).attr("data-page-num"),
                    tfid: $(this).attr('data-target-fid'),         // target-fid
                    uri:  $(this).attr("data-uri"),           //$(this).attr('data-fid');               no need in real application because of tfid
                    tpage: $(this).attr("data-target-page")?$(this).attr("data-target-page"):1
                };
                p.id && edits.linkOperations.push(p);                    //console.log(c); to JSON.stringify(p) before sending to server
            });
            this.panel.find(".text-editable").each(function(index, value) {
                var e = $(this);                                                //console.log(e);
                var //i = pageWrap.find("canvas.page"),
                    n = pageWrap.attr("data-scale"),
                    r = e.css("font-family").split(",")[0].trim().toLowerCase(),
                    u = "Times New Roman";                                                  //console.log('font-fam: ',r)
                r.indexOf("helvetica") >= 0 && (u = "helvetica"),
                r.indexOf("Courier") >= 0 && (u = "courier");
                var s = e.css("font-size").slice(0, -2),
                    d = parseInt(s/n),
                    f = {
                        id: $(this)[0].id,
                        text: _this._getText(e.text()),
                        pw: parseInt(pageWrap.attr('data-pw')),
                        position: {                                                            // to add 10 px to text inlineHeight
                            x: parseInt(e.css("left").slice(0, -2)/n),//Big(e.css("left").slice(0, -2)).div(n),
                            y: parseInt((e.offset().top-pageWrap.offset().top)/n)+10 //Big(i.attr("height")).minus(Big((e.css("top")))).minus(l).plus(c).div(n)

                        },
                        style:{
                            font: u,
                            fontSize: d,
                            color: _this._getColor(e.css("color")),
                            bold: "bold" == e.css("font-weight"),
                            italic: "italic" == e.css("font-style")
                        },
                        page: e.attr("data-page-num"),
                    };
                "" != f.text.trim() && edits.textOperations.push(f)
                //}
            });
            return edits;
        },
        _getColor: function (t) {
            if ("rgba(0, 0, 0, 0)" != t.trim() && "transparent" != t.trim()) {
                if (0 == t.trim().indexOf("rgb(")) {
                    var e = t.slice(4, -1).split(","); return e;
                }
            }
            return [0,0,0];
        },
        _getText: function(t) {
            var kt = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
            return t.replace(kt, "").replace(/\u3000/g, " ").replace(/\u2003/g, " ").replace(/\u2002/g, " ").replace(/\u2005/g, " ").replace(/\u2006/g, " ").replace(/\u2000/g, " ").replace(/\u202F/g, " ").replace(/\u0009/g, "").replace(/\u200B/g, "").replace(/\u2028/g, "")
        },
        loadEdits: function(fid){
            var _this = this;
            angular.element(JsTree.ctrlId).scope().getFileById(fid).then(function(result){
                if(result.errors) return;
                if(result && result.ectdFileStateList){
                    var lastState = result.ectdFileStateList[result.ectdFileStateList.length-1];                               //console.log("edits: ", JSON.parse(lastState.action) );
                    _this.edits = JSON.parse(lastState.action);                        console.log("actions: ", _this.edits);
                }
            });
            //angular.element("#JstreeCtrl").scope().getFileById(fid).then(function(result){});
            return this;
        },
        replaceEdits: function(_this){                                                                 console.log("edits", _this.edits);
            if(!_this.edits || _this.edits.length<=0) return false;
            var edits = _this.edits, editZone = _this.fileZone;
            var linkEdits = edits["linkOperations"];
            var textEdits = edits["textOperations"];

                if(linkEdits && linkEdits.length>0){
                    for (var i=0; i<linkEdits.length; i++){                               //console.log("page num: ", linkEdits[i].page);
                        var lastOpNum = linkEdits[i].id.split("-")[2];
                        if(_this.editCount<lastOpNum) _this.editCount = lastOpNum;
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

                        var edit = _this.createTargetShape({t: t, l: l, w: w, h: h, id: id, tfid: tfid, page: page, tpage: tpage, uri: uri}, false);
                        if(1 !== parseInt(linkEdits[i].page)){
                            edit.css("z-index", -1);
                        }
                    }
                }
                if(textEdits && textEdits.length>0){
                    for (var i=0; i<textEdits.length; i++){                               //console.log("page num: ", linkEdits[i].page);

                        var lastOpNum = textEdits[i].id.split("-")[2];                   //console.log("edit no: ", lastOpNum);
                        if(_this.editCount<lastOpNum) _this.editCount = lastOpNum;

                        var scale = (editZone.width()-window.browserScrollbarWidth)/textEdits[i].pw;
                        var t = textEdits[i].position.y * scale -10,                     // to remove 10px inline height
                            l = textEdits[i].position.x * scale,
                            style = textEdits[i].style,
                            id = textEdits[i].id,
                            text = textEdits[i].text;
                        page = textEdits[i].page;
                        style.fontSize = style.fontSize * scale;
                        var edit = _this.createTextEdit(t, l, text, {id: id, page: page, style: style});
                        if(1 !== parseInt(textEdits[i].page)){
                            edit.css("z-index", -1);
                        }
                    }
                }
                _this.hideEditMenu();
                return _this;
        },
        showEdits: function(pageNum){                // best to loop through this.edits
            if(this.editCount===0) return false;
            for(var i=this.editCount; i>=1; i--){
                var target = this.panel.find('.operation_'+i);
                if(target.length && target.is(":visible")) {target.css("z-index", -1);}
                var num = target.attr("data-page-num");
                if(num && num==pageNum) target.css("z-index", 10);
            }
            this.hideEditMenu();
        },
        createTextEdit: function(top, left, text, obj){                    //console.log("page no: ", pageWrap.attr("data-page-num"));
            var pageWrap = this.pageWrap;
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
            //pdfFile["pdf-editor"].saved = false;
            return f;
        },
        createTargetShape: function(link, select){
            var _this = this;
            var w = link.w || 200, h = link.h || 100, pageWrap = this.pageWrap;
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
            //if(select) target.attr({"data-uri": pdfFrame.fileName, "data-target-fid": pdfFrame.fid });

            pageWrap.append(target);                                            //console.log("append edit: ", pageWrap);
            //pdfFile["pdf-editor"].saved = false;
            return target;
        },
        openLinkEdit: function(target, select){                        //console.log(select)
            var fileListSelect = $('.link-editable-menu select.fileList'), pageList =$('.link-editable-menu select.pageList');
            if(select) {
                if(target.attr('data-target-fid') && target.attr('data-uri'))                                     // pageList is not first time open edit
                    fileListSelect.val( target.attr('data-uri')).attr('disabled', 'disabled');
                else {
                    fileListSelect.val( pdfFrame.fileName).attr('disabled', 'disabled');
                    target.attr({"data-uri": pdfFrame.fileName, "data-target-fid": pdfFrame.fid});
                }                                                                                // pageList is loaded first time open edit

                if(target.attr("data-numPages")) {                                          //  pageList is not first time loaded
                    this.createPageList( target.attr("data-numPages"), pageList);
                    pageList.val(target.attr('data-target-page')).show().attr('disabled', 'disabled');              //console.log(pdfFrame.fileName,target.attr('data-uri' ));
                    if( pdfFrame.fileName == target.attr('data-uri' )) pageList.removeAttr("disabled");
                }else if(pdfFrame.pdf.numPages>1){
                    this.createPageList(pdfFrame.pdf.numPages, pageList);
                    target.attr({"data-numpages": pdfFrame.pdf.numPages, "data-target-page": 1});
                    pageList.show().removeAttr("disabled");
                }else pageList.hide();


            }else {                                                                          // target-fid >1 (select) or target-fid =1 (link)
                if(target.attr('data-target-page')>1 && target.attr('data-uri')){
                    fileListSelect.val( target.attr('data-uri')).attr('disabled', 'disabled');
                    this.createPageList( target.attr('data-target-page'), pageList);
                    pageList.val(target.attr('data-target-page')).attr('disabled', 'disabled').show();
                    if( pdfFrame.fileName == target.attr('data-uri' )) pageList.removeAttr("disabled");
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
        },
        // working with tools Menu
        isTool: function(t) {
            return this.panel.attr("data-tool") == t;
        },
        setTool: function (t) {
            var a = this.toolsMenu.find("[data-tool=" + t + "]");
            this.panel.attr("data-tool", t),
                a.addClass("active");
        },
        removeTool: function() {
            this.toolsMenu.find("[data-tool]").removeClass("active"),
                this.panel.attr("data-tool", "none");
        },
        toggleTool: function (t) {
            this.hideEditMenu();
            this.removeTool();
            if(!this.isTool(t))
                this.setTool(t);
        },

        setToolsMenuListener: function(){
            var _this = this;
            _this.toolsMenu.find("[data-tool=text]").click(function() {
                _this.toggleTool("text");
            });
            _this.toolsMenu.find("[data-tool=link]").click(function() {
                _this.toggleTool("link");
            });
            _this.toolsMenu.find("[data-tool=select]").click(function() {
                if(pdfFrame.panel.attr('data-loaded')=='true') _this.toggleTool("select");
            });
            _this.toolsMenu.find("[data-tool=save]").click(function(t) {
                t.preventDefault();
                if(_this.panel.attr('data-loaded')!=='true') {alert('file not opened!!!'); return;}
                if(!_this.hasValidOP()) {alert('file not edited!!!'); return;}
                _this.saveEdits();
            });
            return this;
        },
        setLinkMenuListener: function(){
            var _this = this;
            $(".link-editable-menu .delete-opts").click(function() {                     //console.log("delete")
                var t = $(this),
                    e = $("#" + t.parents(".link-editable-menu").attr("data-target-id"));
                e.remove(),
                    t.parents(".link-editable-menu").hide();
                _this.fileUnsaved = true;
            });
            $(".link-editable-menu select.fileList").on('change', function(){
                var sOption= $(this).find('option:selected');                            console.log("file", sOption);
                $("#" + $(this).parents(".link-editable-menu").attr("data-target-id")).attr({"data-target-fid":sOption.attr('id'), "data-uri": sOption.text()});
                _this.fileUnsaved = true;
            });
            $(".link-editable-menu select.pageList").on('change', function(){
                var sOption= $(this).find('option:selected');                                //console.log(sOption.text());
                $("#" + $(this).parents(".link-editable-menu").attr("data-target-id")).attr({"data-target-page": sOption.text()});
                if (pdfFrame.panel.attr('data-loaded')=='true'){
                    var pageNum = sOption.text();
                    pdfFrame.render(parseInt(pageNum));
                    pdfFrame.panel.find('.right-tabs select.pageList').val(pageNum);
                    pdfFrame.panel.find('.right-tabs .pageNum').val(pageNum);

                }
                _this.fileUnsaved = true;
            });
            return this;
        },
        setTextMenuListener: function(){
            var _this = this;
            $(".text-editable-menu .font-size-opts input[name=fontSize]").on("input change", function(t) {
                var e = $(this),
                    a = parseInt(this.value),
                    i = _this._getTextTarget($(this)),
                    r = parseFloat(i.parents(".page-wrap").attr("data-scale"));
                _this._setStyle(e, "font-size", r * a + "px"),
                    _this._setStyle(e, "line-height", r * a + "px"),
                    _this._setStyle(e, "height", ""),
                    window.lastTextEditSettings.size = a
                $('.font-size-opts').attr('title',window.lastTextEditSettings.size);
            });
            $(".text-editable-menu .color-opts a").click(function() {
                    var t = $(this),
                        e = t.css("background-color");
                    _this._setStyle(t, "color", e),
                        window.lastTextEditSettings.color = e;
                });
            $(".text-editable-menu .font-family-opts a").click(function(){
                    var t = $(this),
                        e = t.attr("data-font");
                    _this._setStyle(t, "font-family", e),
                        window.lastTextEditSettings.font = e
                });
            $(".text-editable-menu .font-bold-opts").click(function() {
                window.lastTextEditSettings.weight = _this._checkStyle($(this), "font-weight", "bold", "400")
            });
            $(".text-editable-menu .font-italic-opts").click(function() {
                    window.lastTextEditSettings.style = _this._checkStyle($(this), "font-style", "italic", "normal")
            });
            $(".text-editable-menu .delete-opts").click(function() {
                    var t = $(this),
                        e = $("#" + t.parents(".text-editable-menu").attr("data-target-id"));
                    e.hasClass("existingTextEdit") ? e.text("") : e.remove(),
                        t.parents(".text-editable-menu").hide();
            });
            return _this;
        },
        _getTextTarget: function(t) {
            return $("#" + t.parents(".text-editable-menu").attr("data-target-id"));
        },
        _checkStyle: function(t, e, a, i){
            var r = this._getTextTarget(t).css(e);
            return r == i ? (this._setStyle(t, e, a),
                a) : (this._setStyle(t, e, i),
                i);
        },
        _setStyle: function (t, e, a) {
            var i = {};
            i[e] = a, this._getTextTarget(t).css(i).focus();
        },
        _isValidate: function(t, e){
            return t.hasClass(e) || t.parents("." + e).length > 0;
        },
        setDrawListener: function(){
            var el, x1 = 0,  x2 = 0,                // el - element $(this)
                y1 = 0, y2 = 0,
                u = $("#selectionBorder"),
                s = !1;
            var _this = this, pageWrap = this.pageWrap;
            $(document).on("mousedown", ".page-wrap", function(e) {
                _this.hideEditMenu();
                if((_this.isTool("link")||_this.isTool("select"))&& $(this).parents('.pdf-editor').length){
                    e.preventDefault(),
                        s = !0,
                        el = $(this),
                        u.show(),
                        x2 =  x1 = e.pageX,
                        y2 = y1 = e.pageY,
                        setPositions();                                             //console.log('mousedown', el)
                }
            }).on("mousemove", function(e) {
                    (_this.isTool("link")||_this.isTool("select")) && s && (x2 = e.pageX,
                        y2 = e.pageY,
                        setPositions());
            }).on("mouseup", function(t) {
                    u.hide();
                    if ( (_this.isTool("link")||_this.isTool("select")) && s) {
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
                        _this.createTargetShape({t: m, l: h, w: width, h: height}, _this.isTool('select'));
                        s = !1;
                        _this.removeTool();                                       //console.log('editable', s)
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
            return _this;
        },
        setClickListener: function(){
            var _this = this;
            _this.panel.on("click", function(evt) {
                var e = $(evt.target), u = $(this).find(".page-wrap");
                if (!(_this._isValidate(e, "text-editable-menu") || _this._isValidate(e, "link-editable-menu") || _this._isValidate(e, "text-editable") || _this._isValidate(e, "target-editable"))) {
                    _this.hideEditMenu();
                    if ((e.hasClass("page") || e.hasClass("not-editable")) && _this.isTool('text')) {      //console.log('mouse click at canvas')
                        if (Et) return;
                        var top = evt.pageY - u.offset().top - window.lastTextEditSettings.size,
                            left = evt.pageX - u.offset().left - 7;
                        _this.createTextEdit(top, left, "www.sample.com");
                        _this.removeTool();
                    }
                }
            });
            return _this;
        },
        saveEdits: function(){
            var _this = this;
            this.panel.find(".text-editable").each(function() {                  //console.log("text-editable: ", $(this));
                if("www.sample.com" == $(this).text()) $(this).remove();
            });

            this.panel.find(".target-editable").each(function(){                 //console.log("target-editable: ", $(this));
                if(!$(this).attr('data-target-fid')) $(this).remove();
            });

            var opl = this.getEditList();
            for(var op in opl){
                if(opl[op].length<=0) delete opl[op];
            }

            var postData = JSON.stringify(opl);                   console.log(postData)
            angular.element(JsTree.ctrlId).scope().saveEdits(this.fid, postData).then(function(result){ //console.log(result);
                if(result){
                    toastr.success("edits saved");
                    _this.fileUnsaved = false;
                }
            });
        }
    };

    PdfEditor.prototype.__proto__ = PdfPanel.prototype;
    
    var pdfEditor = new PdfEditor("pdf-editor");
    pdfEditor.setPageControlHandler()
        .setToolsMenuListener()
        .setTextMenuListener()
        .setLinkMenuListener()
        .setDrawListener()
        .setClickListener();
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
                pdfEditor.scaleEdits();
            }
        }
    });

    var Et = !1;
    jQuery.fn.inlineEditor = function(obj) {                //
        var o = $(this[0]);
        //removeOperationCache();
        if(obj && obj.id) o.attr("id", obj.id).addClass('operation_'+obj.id.split("-")[2]);
        else o.attr("id", "text-editable-" + ++pdfEditor.editCount).addClass('operation_'+pdfEditor.editCount);
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
            color = obj? "rgb(" + obj.style.color.toString()+")" : 0,
            font = obj? obj.style.font: "Times New Roman"
            d = void 0;                                                     console.log("font: ", font);
        (size = size || u * window.lastTextEditSettings.size + "px",
            //font = font || window.lastTextEditSettings.font,
            color = color || window.lastTextEditSettings.color,
            weight = weight || window.lastTextEditSettings.weight,
            d = d || window.lastTextEditSettings.style),
            o.css({
                "font-size": size,
                //"line-height": size+2,
                "color": color,
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
                "position": "absolute",
                "z-index": "1000",
                "top": textinput.offset().top + textinput.height() -35,
                "left": textinput.offset().left
            }).attr("data-target-id", textinput.attr("id")).show();                               //console.log('text edit menu', textinput.offset().left);
    }

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



