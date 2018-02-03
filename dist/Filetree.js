/*      ------ Super class -----          
 *     prototype of jstree for info page (InfoFiletree), upload page (UpFiletree) and edit link page tree
 *     and publish page tree
 * 
 * ****/

function Filetree(id, height){
    this.tree = $(id); 
    this.height = height >650 ? height: 650;                   //this.ctrlId, this.userData
    this.substanceTags = {};
    //this.isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
};
Filetree.prototype ={
    constructor: Filetree,
    initTree: function(json, substanceTags){
        var _this = this;  
        if(substanceTags){                     console.log(substanceTags);
            _this.substanceTags = substanceTags;
        }                                                                 //console.log("this.plugins", this.plugins);
        this.tree.jstree({
                "core" : {
                    //"animation" : 0,
                    "multiple": false,
                    "check_callback" : false,
                    "themes" : { "stripes" : true },
                    "data" : json
                },
                "types" : { "#" : {"max_children" : 8, "max_depth" :8, "valid_children" : ["root"]},
                    "root" : { "icon" : "assets/tree_icon.png","valid_children" : ["default"] },
                    "default" : {"valid_children" : ["folder", "file"]},
                    "folder": {"valid_children" : ["folder","file"]},
                    "tag": {"icon" : "fa fa-file-o", "valid_children" : ["file"]},
                    "file" : { "icon" : "fa fa-file-pdf-o", "valid_children" : []}
                },
                "search": {
                    "case_insensitive": true,
                    "show_only_matches" : true
                },
                "plugins" : _this.plugins || ["types", "state", "dnd", "search"]
            }).bind("hover_node.jstree", function(event, data){
                 //$("li#"+data.node.id).prop("title", data.node.text);               // selector for id with dot does not work
                _this.hoverHandler(data);
            }).bind("loaded.jstree", function (event, data) {                               //console.log(_this.height);
                //$(this).css("height", _this.height);       
                _this.loadedHandler();
            }).bind("select_node.jstree", function (e, data) { 
                if(_this.selectNodeHandler) _this.selectNodeHandler(data);
            }).bind("dblclick.jstree", function(event){
                _this.dblclickEventHandler(event);                              
            }).on('copy_node.jstree', function (e, data) {
                if(_this.copyNodeHandler) _this.copyNodeHandler(data);
            }).on('delete_node.jstree', function (e, data) {
                if(_this.deleteNodeHandler) _this.deleteNodeHandler(data);
            }).on('move_node.jstree', function (e, data) {
                if(_this.moveNodeHandler) _this.moveNodeHandler(data);
            });
        
    },
    addSubstanceTag(id, tag){           // add substance and product tag
        if(id=="m32S"||id=="m23S"){
            var addText = "["+tag.manufacturer+"]["+tag.substance+"]";
            this.addNodeText(id, addText);
        }else if(id=="m32P"||id=="m23P"){
            var addText = "["+tag.manufacturer+"]["+tag.prodName+"]["+tag.dosage+"]";
            this.addNodeText(id, addText);
        }
    },
    addNodeText:function(id, text){

        var node = this.tree.jstree(true).get_node(id);                     //console.log(node);
        if(node.text.indexOf("<b>")>=0){
            var title = node.text.replace(/<\/?[^>]+(>|$)/g, "");
            title = "<b>" + title.slice(0, title.indexOf("["))+' '+text + "</b>"
            this.tree.jstree(true).set_text(node, title.slice(0, title.indexOf("["))+' '+text);
        }else
            this.tree.jstree(true).set_text(node, node.text.slice(0, node.text.indexOf("["))+' '+text);
    },
    loadedHandler: function(){
        var _this = this; 
        _this.tree.css("height", _this.height);                                 //console.log("this.height: ", this.height);
        $(_this.tree.jstree().get_json("#", {flat: true}))
            .each(function(index, value) {
                  var node = _this.tree.jstree().get_node(this.id);
                  if(node.type === "tag" && node.children.length) 
                      _this.tree.jstree().set_icon(node.id, "fa fa-file");
                  else if(node.type ==="file") _this.paintParents(node.parents);
                  else if(_this.substanceTags && ( node.id=="m23S" || node.id=="m32S")){  //console.log(_this.substanceTags[node.id])//$.inArray(node.id, ["m32s", "m32S", "m23S", "m23s"])
                    if(_this.substanceTags[node.id])
                        _this.addSubstanceTag(node.id, _this.substanceTags[node.id]);
                  }else if(_this.substanceTags && (node.id=="m32P"||node.id=="m23P")){                      //$.inArray(node.id, ["m32s", "m32S", "m23S", "m23s"])
                    if(_this.substanceTags[node.id])
                        _this.addSubstanceTag(node.id, _this.substanceTags[node.id]);
                  }

            });
        
        App.initSlimScroll(_this.tree);
        var search = $("input[name='query']").val();
        if(search.length) _this.tree.jstree('search', search);
        $("input[name='query']").keyup(function(){
                var searchString = $(this).val();
                _this.tree.jstree('search', searchString);                //console.log($(this).val());
        });
    },
    hoverHandler: function(data){
        var title = data.node.text.replace(/<\/?[^>]+(>|$)/g, "");
        $('li[id="'+ data.node.id + '"]').prop("title", title);
    },
    setSelectNodeHandler: function(selectNodeHandler){
        this.selectNodeHandler = selectNodeHandler;
        return this;
    },
    setController: function(ctrlId){
        this.ctrlId = ctrlId;
        return this;
    },
    toggle: function(open){
        if (open)
            this.tree.jstree().close_node(["m1", "m2", "m3", "m4", "m5"]); 
        else
            this.tree.jstree("open_all");
    },
    paintParents: function(parents){                                              //console.log(parents);
        for(var i =0; i<parents.length-2; i++){
            var parent = this.tree.jstree(true).get_node(parents[i]);
            if( parent.text.indexOf("<b>")<0) this.tree.jstree(true).set_text(parent, "<b>"+parent.text+"</b>");
            //$("#"+parent.id+"_anchor").addClass("hasFile"); //console.log($("#"+parent.id+"_anchor"))
        }
    },
    dblclickEventHandler: function(event, uptree){
        var tree = uptree || this.tree;
        var nodeId = $(event.target).closest("li")[0].id;
        var node = tree.jstree(true).get_node(nodeId);             //console.log("node", nodeId);
        if(!node) return;
        if(node.type=="file"){
            var fileId = node.id;
            var userData = this.userData; // || angular.element(this.ctrlId).scope().getUserData();                         //console.log("userData: ",this.userData );
            var url = Base_URL + "/a/application/file/get_by_file_id/" + fileId + "/?uid=" + userData.uid +"&apptoken=" + userData.access_token;              //console.log(url);
            //var url = Base_URL + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;              //
            this.openIframe( url, userData);
        }else if(node.type=="default"){                                         //console.log(node.state);
            if(!node.state.opened){
                tree.jstree().close_node(nodeId);
            } else{
                if(!node.children_d ||!node.children_d.length ) return;
                tree.jstree(true).open_node(nodeId);
                for(var i=0; i<node.children_d.length; i++){
                    //this.tree.jstree(true).open_node(node.children_d[i]);
                    tree.jstree(true).open_node(node.children_d[i]);
                }
            }
        }
    },
    openIframe: function(url, userData){
        var w = $(window).width(), h = $(window).height(), gap = 50;
        var layer = $("<div>").attr("id", "layer")
                .css({"position": "absolute", "top": 0, "left": 0, "width": w, "height": $(document).height(), "background-color": "rgba(0, 0, 0, 0.5)", "text-align": "center", "z-index": 10001 })
                .appendTo($("body"));
        var progressbar = $('<div class="load-process">Loading...</div>')
            .css({"position": "absolute","top":gap-2, "left":w/6 ,"width": w*2/3, "height": 2, "background": "#ff0000"}).appendTo(layer);
        var iframe = $("<iframe>").attr("id", "frame")
                .css({"position": "absolute","top":gap,"left":w/6 ,"width": w*2/3, "height": h-gap*2, "border": "solid 1px #999"}).appendTo(layer);
        var closeTab = $('<a><i class="fa fa-times" aria-hidden="true"></i></a>')
                        .css({"position": "absolute", "color": "#fff", "top": 10, "left": w*5/6-25, "font-size": "25px"}).appendTo(layer);
        //$("body").append(layer);
        $("#layer").click(function(){
            $(this).remove();
        });
        var _this = this;
        $.when($.ajax(url)).then(function(result, textStatus, jqXHR){                         console.log("result", result);
            if(jqXHR.status !== 200) return;
            if(!result.ectdFileStateList) return;

            // for IE browser
            var isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
            if(isIE){
                var fileURL = Base_URL + result.ectdFileStateList[result.ectdFileStateList.length-1].path;
                $("#frame").attr("src", fileURL);
                return;
            }
            // for other browser
            var uuid = result.ectdFileStateList[result.ectdFileStateList.length-1].uuid;             //console.log("file", uuid);
            var fileURL = Base_URL + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;              //console.log(fileURL);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', fileURL, true);
            xhr.responseType = 'blob';

            xhr.onprogress = function(e){        //console.log (e);
                if (e.lengthComputable) {
                    var progress = e.loaded/e.total;
                    progressbar.show().css("width", progress +"%");                                                              //console.log(progress);
                }
            };
            xhr.onload = function(e) {
                if (this.status === 200) {
                    var blob = new Blob([this.response], {type: 'application/pdf'}),
                        file = URL.createObjectURL(blob);                               //console.log(file);
                    progressbar.hide();
                    //layer.append(iframe);
                    $("#frame").attr("src", file);
                }
            };
            xhr.send();
        });
        /*$.get(url, function(result){
            if(!result || !result.ectdFileStateList.length ) return;
        });*/

    }
};


