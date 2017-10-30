    function Jstree(id, height){
        this.tree = $(id); 
        this.height = height;
        this.ctrlId = "#FileUploadCtrl";
        this.uptree = $('#uploadFileTree');
    }
    Jstree.prototype = {
        constructor: Jstree,
        initTree: function(json){
            var _this = this;
            _this.tree.jstree({
                "core" : {
                    //"animation" : 0,
                    "check_callback" : function(op, node, node_parent, node_position, more) {
                        if(op=="move_node" && node.type!=="file"){
                            return false;
                        }
                        return true;
                    },
                    "themes" : { "stripes" : true },
                    "data" : json
                },
                "types" : { "#" : {"max_children" : 8, "max_depth" :8, "valid_children" : ["root"]},
                    "root" : { "icon" : "assets/tree_icon.png","valid_children" : ["default"]},
                    "default" : {"valid_children" : ["folder", "tag", "file"]},
                    "folder": {"valid_children" : ["folder","file"]},
                    "tag": {"icon" : "fa fa-file-o", "valid_children" : ["file"]},
                    "file" : { "icon" : "glyphicon glyphicon-file", "valid_children" : []} 
                },
                "search": {
                    "case_insensitive": true,
                    "show_only_matches" : true
                },
                "plugins" : ["contextmenu", "dnd", "types", "state", "search"],
                'contextmenu' : {
                    'items' : _this.subtreeMenu, select_node : true
                }

            }).bind("loaded.jstree", function (event, data) {
                $(this).css("height", _this.height);
                _this.loadedHandler();

            }).bind("dblclick.jstree", function(event){
                _this.dblclickEventHandler(event);
            }).bind("hover_node.jstree", function(event, data){
                $("#"+data.node.id).prop("title", data.node.text );

            }).on('copy_node.jstree', function (e, data) { 
                var jsECTDtree = _this.tree.jstree(true);
                var parentNode = jsECTDtree.get_node(data.parent);           
                if(parentNode.type=="tag"){                              //One file only to one tag
                    if(parentNode.children.length>1){
                        jsECTDtree.delete_node(data.node.id);
                        _this.uptree.jstree(true).show_node(data.node.id);
                        angular.element(_this.ctrlId).scope().showUpfileNode(data.node.id);
                        toastr.warning("One tag can't contain two files!"); 
                        return;
                    }
                    _this.setTagNode(parentNode, data.node.text, data.original.id, jsECTDtree);                                   //console.log(parentNode);                                  
                }
                jsECTDtree.open_node(parentNode.id);                                             
                jsECTDtree.set_id(data.node, data.original.id);                                       // to keep original file id
                _this.uptree.jstree(true).hide_node(data.original.id);                        //console.log( 'path', data.original.original.path);

                angular.element(_this.ctrlId).scope().hideUpfileNode(data.original.id);

            }).on('delete_node.jstree', function(e, data){   
                var jsECTDtree = _this.tree.jstree(true);
                var node = data.node; 
                if(node.children_d.length>0){                                                   // if deleted node has child nodes - file node does not contain child node
                        var childNodes = node.children_d;
                        for(var i=0; i<childNodes.length; i++) 
                            _this.uptree.jstree(true).show_node(childNodes[i]);
                }else{
                    var parentNode = jsECTDtree.get_node(data.parent);           
                    if(parentNode.type=="tag" && parentNode.children.length==0){                 //check if its parent is tag
                        _this.resetTagNode(parentNode, jsECTDtree);
                    }                                                                            //console.log(parentNode);

                    _this.uptree.jstree(true).show_node(data.node.id);
                    angular.element(_this.ctrlId).scope().showUpfileNode(data.node.id);
                }  
            }).on('move_node.jstree', function (e, data) {  
                var jsECTDtree = _this.tree.jstree(true);
                var parentNode = jsECTDtree.get_node(data.parent), old_parentNode = jsECTDtree.get_node(data.old_parent);
                if(parentNode.type=="tag"){ 
                    if(parentNode.children.length>1){
                        toastr.warning("One tag can't contain two files!");
                        jsECTDtree.move_node(data.node, data.old_parent);
                        if(old_parentNode.type=="tag") jsECTDtree.set_icon(old_parentNode.id, "glyphicon glyphicon-file");
                        jsECTDtree.set_icon(parentNode.id, "glyphicon glyphicon-file");
                        return;
                    }                                                               //console.log(data);
                    _this.setTagNode(parentNode, data.node.text, data.node.id, jsECTDtree); 
                }

                if(old_parentNode.type=="tag"){ 
                    _this.resetTagNode(old_parentNode, jsECTDtree);
                }

                jsECTDtree.open_node(data.parent);

            }).on('open_node.jstree', function (event, data) {});    
        },
        initUploadTree: function(fileJson){                              //console.log(this);
            var _this = this;
            this.uptree.jstree({
                "core" : {
                    //"animation" : 0,
                    "check_callback" : false,
                    "themes" : { "stripes" : true },
                "data" : fileJson
                },
                "types" : { "#" : { "valid_children" : ["root"]},
                    "root" : { "icon" : "assets/tree_icon.png","valid_children" : ["file"] },
                    "file" : { "icon" : "glyphicon glyphicon-file", "valid_children" : []} 
                },
                "plugins" : ["contextmenu", "dnd", "types", "state"],
                'contextmenu' : {
                    'items' : _this.uptreeMenu, select_node : true
                }
            }).bind("loaded.jstree", function (event, data) {
                $(this).jstree("open_all");
            }).bind("hover_node.jstree", function(event, data){
                $("#"+data.node.id).prop("title",data.node.original.fileId );//console.log(data.node.original.uuid) 
            }).on('changed.jstree', function (e, data) { 
                $(this).jstree().open_node('up1');
            }).bind("dblclick.jstree", function(event){
                _this.dblclickEventHandler(event);
            });
        },
        subtreeMenu: function(node) {                                           console.log(this.tree);
            var items = {
                'create':{  //create new node
                    'label': 'create',
                    'action': function(data){
                        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);            //console.log(inst)
                        inst.create_node(obj, {"text": "new_folder", "type": "folder"}, "last", function (new_node) { //console.log("new node", new_node)
				try {
                                    inst.edit(new_node);
				} catch (ex) {
                                    setTimeout(function () { inst.edit(new_node); },0);
				}
			});
                    }
                },
                'rename': { // The "rename" menu item
                    'label': "Rename",
                    'action': function (data) {                                                  
                            var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);                                        //console.log('rename obj', obj);
                            if(obj.type!="file" && obj.type!="folder"){ 
                                angular.element("#FileUploadCtrl").scope().translateMsg("WARNING_RENAME");
                                //toastr.warning(msg); //{{'Name' | translate}}                            //"CAN NOT RENAME ECTD STRUCTUR FOLDER!" 
                                return;
                            }
                            
                            if(obj.text.indexOf('.pdf')>0) {
                                var default_text = obj.text.substr(0, obj.text.indexOf('.pdf'))
                                inst.edit(obj, default_text, function(){                          //console.log('text: ', obj.text);
                                    if(obj.text.match(/\s/g)){                                       // does not work
                                        angular.element("#FileUploadCtrl").scope().translateMsg("WARNING_SPACE");
                                        //toastr.warning("File name can't contain space!!!");
                                        $('#jsECTDtree').jstree(true).set_text(obj, default_text+".pdf");
                                    }else 
                                        $('#jsECTDtree').jstree(true).set_text(obj, obj.text+'.pdf');
                                }); 
                            }else{
                                inst.edit(obj, obj.text, function(){                                   // console.log('text: ', obj.text);
                                    $('#jsECTDtree').jstree(true).set_text(obj, obj.text);
                                });
                            }
                    }
                },
                /*"duplicate": {
                    "label": "Duplicate",
                    "action": function(data){
                         var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference); 
                        if(obj.type == "file"){    // not yet finished
                            angular.element("#FileUploadCtrl").scope().duplicateNode(obj);
                        }
                    }
                },*/
                'remove': { // The "delete" menu item
                    'label': "Delete",
                    'action': function (data) { //console.log(data);
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);                            //console.log(obj);
                        if(obj.type!="file" && obj.type!="folder"){
                                angular.element("#FileUploadCtrl").scope().translateMsg("WARNING_DELETE");
                                //toastr.warning("Can not delete eCTD structure folder!!!");
                                return;
                            }
			if(inst.is_selected(obj)) {
				inst.delete_node(inst.get_selected());
			}else {
                            inst.delete_node(obj);
			}
                    }
                }
            };

            return items;
        },
        uptreeMenu: function(node) {
            var _this = this;
            var items = {
                /*"duplicate": {
                    "label": "Duplicate",
                    "action": function(data){
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference); 
                        if(obj.type == "file"){                                     // not yet finished
                           angular.element("#FileUploadCtrl").scope().duplicateNode(obj);
                        }
                    }
                },*/
                'remove': { // The "delete" menu item
                    'label': "Delete",
                    'action': function (data) { 
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference); 
                        showWarningModal("Delete Item", "Are you sure to delete the item ?", "Delete", function(){
                            $('#uploadFileTree').jstree(true).hide_node(obj.id);                        //console.log( data);
                            angular.element("#FileUploadCtrl").scope().deleteFileNode(obj.id);
                        });         
                    }
                }
            };

            return items;
        },
        setDblclickHandler: function(dblclickHandler){
            this.dblclickHandler = dblclickHandler;
            return this;
        },
        setUpTreeBorder: function(){
            this.uptree.css("border-top", "solid 1px #999");
        },
        refreshUploadTree: function(fileJson){                                  console.log("this.uptree",this.uptree);                              
            this.uptree.css("border-top", "solid 1px #999");                    
            this.uptree.jstree(true).settings.core.data = fileJson;            console.log("file", fileJson)
            //this.uptree.jstree(true).refresh();
        },
        createNode: function(parent_node, new_node_id, new_node_text, position) {
                this.tree.jstree('create_node', $(parent_node), { "text":new_node_text, "id":new_node_id }, position, false, false);	
        },
        get_fileJson: function(){                                   
            var json = this.tree.jstree(true).get_json('#', {flat:true});
            var fileArray=[];
            for(var i=0; i<json.length; i++){
                if(json[i].type==="file" || json[i].type ==="folder"){ 
                    var node = {"id": json[i].id, "text": json[i].text, "type": json[i].type, "parent": json[i].parent};
                    fileArray.push(node);
                }
            }
            if(fileArray.length>0) return fileArray;
            else return false;
        },
        resetTagNode: function(node, tree){     
            tree.set_icon(node.id, "fa fa-file-o");
            delete node.original.name;
            delete node.original.fileId; 
        },
        setTagNode: function (node, name, fileId, tree){
            tree.set_icon(node.id, "glyphicon glyphicon-file");
            node.original.name = name;
            node.original.fileId= fileId;        
        }
    };
    
    Jstree.prototype.__proto__ = Filetree.prototype;                            
    var JsTree = new Jstree("#jsECTDtree", $(window).height()-250 );             
   

     function showWarningModal(title, body, btn, callback){
            $("#myModal").modal(); 
            $("#myModal").find("#confirmBtn").click(function(e){
                $("#myModal").modal("hide");
                callback(); 
            });
        }