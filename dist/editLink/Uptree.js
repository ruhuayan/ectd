    function Jstree(id, height){
        this.tree = $(id); 
        this.height = height;
        this.ctrlId = "#FileUploadCtrl";
        this.uptree = $('#uploadFileTree');
        this.plugins = ["contextmenu", "dnd", "types", "state"];
    }
    Jstree.prototype = {
        constructor: Jstree,
        initUploadTree: function(fileJson){                              console.log(this);
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
                    'items' : uptreeMenu, select_node : true
                }
            }).bind("loaded.jstree", function (event, data) {
                $(this).jstree("open_all");
            }).bind("hover_node.jstree", function(event, data){
                $("#"+data.node.id).prop("title",data.node.original.fileId );//console.log(data.node.original.uuid) 
            }).on('changed.jstree', function (e, data) { 
                $(this).jstree().open_node('up1');
            }).bind("dblclick.jstree", function(event){
                if(_this.dblclickHandler) _this.dblclickHandler(event);
            });
        },
        setDblclickHandler: function(dblclickHandler){
            this.dblclickHandler = dblclickHandler;
            return this;
        },
        setUpTreeBorder: function(){
            this.uptree.css("border-top", "solid 1px #999");
        },
        refreshUploadTree: function(fileJson){    console.log("this.uptree",this.uptree);                              
            this.uptree.css("border-top", "solid 1px #999");                    
            this.uptree.jstree(true).settings.core.data = fileJson;            console.log("file", fileJson)
            //this.uptree.jstree(true).refresh();
        },
        createNode: function(parent_node, new_node_id, new_node_text, position) {
                $('#jstree').jstree('create_node', $(parent_node), { "text":new_node_text, "id":new_node_id }, position, false, false);	
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
        },
        showWarningModal: function(title, body, btn, callback){
            $("#myModal").modal(); 
            $("#myModal").find("#confirmBtn").click(function(e){
                $("#myModal").modal("hide");
                callback(); 
            });
        }
    };
    
    Jstree.prototype.__proto__ = Filetree.prototype;                            
    var JsTree = new Jstree("#jsECTDtree", $(window).height()-250 );             
    
    JsTree.setContextmenu(subtreeMenu)
        .setDblclickHandler(function(event){
            var nodeId = $(event.target).closest("li")[0].id;
            var node = JsTree.uptree.jstree(true).get_node(nodeId);             //console.log(nodeId); 
            if(node && node.type=="file"){ 
                var uuid = node.id;                                   
                var userData = angular.element(JsTree.ctrlId).scope().getUserData();  //console.log("UUID: ",uuid, userData );

                var url = Base_URL + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;
                JsTree.openIframe( url);
            }
        })
        .setCopyNodeHandler(function(data){
            
            var jsECTDtree = JsTree.tree.jstree(true);
            var parentNode = jsECTDtree.get_node(data.parent);           
            if(parentNode.type=="tag"){                              //One files only
                if(parentNode.children.length>1){
                    jsECTDtree.delete_node(data.node.id);
                    $('#uploadFileTree').jstree(true).show_node(data.node.id);
                    angular.element("#FileUploadCtrl").scope().showUpfileNode(data.node.id);
                    toastr.warning("One tag can't contain two files!"); 
                    return;
                }
                setTagNode(parentNode, data.node.text, data.original.id, jsECTDtree);                                   //console.log(parentNode);                                  
            }
            jsECTDtree.open_node(parentNode.id);                                             
            jsECTDtree.set_id(data.node, data.original.id);                                       // to keep original file id
            $('#uploadFileTree').jstree(true).hide_node(data.original.id);                        //console.log( 'path', data.original.original.path);

            angular.element("#FileUploadCtrl").scope().hideUpfileNode(data.original.id);
            
        }).setMoveNodeHandler(function(data){
            var jsECTDtree = this.tree.jstree(true);
            var parentNode = jsECTDtree.get_node(data.parent), old_parentNode = jsECTDtree.get_node(data.old_parent);;
            if(parentNode.type=="tag"){ 
                if(parentNode.children.length>1){
                    toastr.warning("One tag can't contain two files!");
                    jsECTDtree.move_node(data.node, data.old_parent);
                    if(old_parentNode.type=="tag") jsECTDtree.set_icon(old_parentNode.id, "glyphicon glyphicon-file");
                    jsECTDtree.set_icon(parentNode.id, "glyphicon glyphicon-file");
                    return;
                }                                                               //console.log(data);
                setTagNode(parentNode, data.node.text, data.node.id, jsECTDtree); 
            }

            if(old_parentNode.type=="tag"){ 
                resetTagNode(old_parentNode, jsECTDtree);
            }

            jsECTDtree.open_node(data.parent);
        }).setDeleteNodeHandler(function(data){
            var jsECTDtree = this.tree.jstree(true);
            var node = data.node; 
            if(node.children_d.length>0){                                                   // if deleted node has child nodes - file node does not contain child node
                    var childNodes = node.children_d;
                    for(var i=0; i<childNodes.length; i++) 
                        $('#uploadFileTree').jstree(true).show_node(childNodes[i]);
            }else{

                var parentNode = jsECTDtree.get_node(data.parent);           
                if(parentNode.type=="tag" && parentNode.children.length==0){                 //check if its parent is tag
                    resetTagNode(parentNode, jsECTDtree);
                }                                                                                               //console.log(parentNode);

                $('#uploadFileTree').jstree(true).show_node(data.node.id);
                angular.element("#FileUploadCtrl").scope().showUpfileNode(data.node.id);
            }  
        });    
        $('#uploadFileTree').jstree('create_node', $("#up"), { "text":"new_node", "id":"new_node_id", "type":"file"}, "first", false, false);
        function subtreeMenu(){
            var items = {
                'create':{  //create new node
                    'label': 'create',
                    'action': function(data){
                        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);              console.log("create: ",data, obj)
                        
                        /*inst.create_node(obj, {"text": "new_folder", "type": "folder"}, "last", function (new_node) { console.log("new node", new_node)
				try {
                                    inst.edit(new_node);
				} catch (ex) {
                                    setTimeout(function () { inst.edit(new_node); },0);
				}
			});*/
                    }
                },
                'rename': { // The "rename" menu item
                    'label': "Rename",
                    'action': function (data) {                                                  
                            var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);                                        //console.log('rename obj', obj);
                            if(obj.type!="file" && obj.type!="folder"){ 
                                angular.element(JsTree.ctrlId).scope().translateMsg("WARNING_RENAME");
                                //toastr.warning(msg); //{{'Name' | translate}}                            //"CAN NOT RENAME ECTD STRUCTUR FOLDER!" 
                                return;
                            }                           
                            if(obj.text.indexOf('.pdf')>0) {
                                var default_text = obj.text.substr(0, obj.text.indexOf('.pdf'))
                                inst.edit(obj, default_text, function(){                          //console.log('text: ', obj.text);
                                    if(obj.text.match(/\s/g)){                                       // does not work
                                        angular.element(JsTree.ctrlId).scope().translateMsg("WARNING_SPACE");
                                        //toastr.warning("File name can't contain space!!!");
                                        JsTree.tree.jstree(true).set_text(obj, default_text+".pdf");
                                    }else 
                                        JsTree.tree.jstree(true).set_text(obj, obj.text+'.pdf');
                                }); 
                            }else{
                                inst.edit(obj, obj.text, function(){                                   // console.log('text: ', obj.text);
                                    JsTree.tree.jstree(true).set_text(obj, obj.text);
                                });
                            }
                    }
                },
                "duplicate": {
                    "label": "Duplicate",
                    "action": function(data){
                         var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference); 
                        if(obj.type == "file"){    // not yet finished
                            angular.element(JsTree.ctrlId).scope().duplicateNode(obj);
                        }
                    }
                },
                'remove': { // The "delete" menu item
                    'label': "Delete",
                    'action': function (data) { //console.log(data);
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);                            //console.log(obj);
                        if(obj.type!="file" && obj.type!="folder"){
                                angular.element(JsTree.ctrlId).scope().translateMsg("WARNING_DELETE");
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
        }
        function uptreeMenu() {                                            
            var items = {
                "duplicate": {
                    "label": "Duplicate",
                    "action": function(data){                                   
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);                
                        if(obj.type == "file"){                                     // not yet finished
                           angular.element(JsTree.ctrlId).scope().duplicateNode(obj);
                        }
                    }
                },
                'remove': { // The "delete" menu item
                    'label': "Delete",
                    'action': function (data) { 
                         var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference); 
                        JsTree.showWarningModal("Delete Item", "Are you sure to delete the item ?", "Delete", function(){
                            JsTree.uptree.jstree(true).hide_node(obj.id);                        //console.log( data);
                            angular.element(JsTree.ctrlId).scope().deleteFileNode(obj.id);
                        });         
                    }
                }
            };

            return items;
        }
    
    

