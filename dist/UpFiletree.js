var JsTree = function (){
        function resetTagNode(node, tree){     
            tree.set_icon(node.id, "fa fa-file-o");
            delete node.original.name;
            delete node.original.fileId; 
        }
        function setTagNode(node, name, fileId, tree){
            tree.set_icon(node.id, "glyphicon glyphicon-file");
            node.original.name = name;
            node.original.fileId= fileId;        
        }
        function dblclickEventHandler(event){                                   //console.log(event);
            var nodeId = $(event.target).closest("li")[0].id;
            var node = $('#uploadFileTree').jstree(true).get_node(nodeId);        //console.log("node: ", node);        
            if(node && node.type=="file"){ 
                var uuid = node.id;                                   
                var userData = angular.element("#FileUploadCtrl").scope().getUserData();  //console.log("UUID: ",uuid, userData );
                //var portlet = $(".upload-portlet");
                var url = Base_URL + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;
                //var url = 'http://192.168.88.187:8080/ectd' + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid +"&apptoken=" + userData.access_token;
                //openFrame(portlet, $(".jstree-portlet").height(), url);
                openIframe(url);
            }
            
        }
        function subtreeMenu(node) {
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
        }
        function uptreeMenu(node) {
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
                        JsTree.showWarningModal("Delete Item", "Are you sure to delete the item ?", "Delete", function(){
                            $('#uploadFileTree').jstree(true).hide_node(obj.id);                        //console.log( data);
                            angular.element("#FileUploadCtrl").scope().deleteFileNode(obj.id);
                        });         
                    }
                }
            };

            return items;
        }
        return {
            initTree: function(json){
                var jsECTDtree; 
                $('#jsECTDtree').css("height", $(window).height()-250).jstree({
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
                        'items' : subtreeMenu, select_node : true
                    }
                    
                }).bind("before.jstree", function (event, data) {
                   //console.log("node: ", data)  
                }).bind("loaded.jstree", function (event, data) {
                    //$(this).css("height", $(window).height()-250);
                    jsECTDtree = $('#jsECTDtree').jstree(true);
                    var $tree = $(this);
                    $($tree.jstree().get_json("#", {flat: true}))
                        .each(function(index, value) {
                                var node = $tree.jstree().get_node(this.id);
                                if(node.type === "tag" && node.children.length){ 
                                    $tree.jstree().set_icon(node.id, "glyphicon glyphicon-file");
                                }
                                if(node.type ==="file") JsTree.paintParents(node.parents);
                        });
                    App.initSlimScroll("#jsECTDtree");
                    var search = $("input[name='query']").val();
                    if(search.length) $('#jsECTDtree').jstree('search', search);
                    $("input[name='query']").keyup(function(){
                        var searchString = $(this).val();
                        $('#jsECTDtree').jstree('search', searchString);                //console.log($(this).val());
                    });
                    
                }).bind("dblclick.jstree", function(event){
                    dblclickEventHandler(event);
                }).bind("hover_node.jstree", function(event, data){
                    $("#"+data.node.id).prop("title", data.node.text );
                    
                }).on('copy_node.jstree', function (e, data) { 
                    
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
                    
                }).on('delete_node.jstree', function(e, data){                     
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
                }).on('move_node.jstree', function (e, data) {  
                    
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
                    
                }).on('open_node.jstree', function (event, data) { 
                });
                
            },
            initUploadTree: function(fileJson){
                $('#uploadFileTree').jstree({
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
                    dblclickEventHandler(event);
                });
            },
            setUpTreeBorder(){
                $('#uploadFileTree').css("border-top", "solid 1px #999");
            },
            refreshUploadTree: function(fileJson){
                $('#uploadFileTree').css("border-top", "solid 1px #999").jstree(true).settings.core.data = fileJson;
                $('#uploadFileTree').jstree(true).refresh();
            } ,
            /*refreshSubTree: function(fileJson){
                $('#jsECTDtree').jstree(true).settings.core.data = fileJson;
                $('#jsECTDtree').jstree(true).refresh();
            },*/
            get_fileJson: function(){
                var json = $('#jsECTDtree').jstree(true).get_json('#', {flat:true});
                var fileArray=[];
                for(var i=0; i<json.length; i++){
                    if(json[i].type==="file" || json[i].type ==="folder"){ 
                        /*json[i].original = $('#jsECTDtree').jstree(true).get_node(json[i].id).original; 
                        if($('#uploadFileTree').jstree(true).get_node(json[i].id)){ 
                            json[i].name = $('#uploadFileTree').jstree(true).get_node(json[i].id).original.path;            
                                                                                            //console.log(json[i]);
                        }*/
                        var node = {"id": json[i].id, "text": json[i].text, "type": json[i].type, "parent": json[i].parent};
                        fileArray.push(node);
                    }
                }
                if(fileArray.length>0) return fileArray;
                else return false;
            },
            getNodes: function(){
                var nodes = $('#jsECTDtree').jstree(true).get_json('#', {flat:true});
                return nodes;
            },
            toggle: function(open){
                if (open)
                    $('#jsECTDtree').jstree(true).close_node(["m1", "m2", "m3", "m4", "m5"]); 
                else
                    $('#jsECTDtree').jstree("open_all");
                    //JsTree.openChildren("sub1");

            }, 
            showWarningModal: function(title, body, btn, callback){
                //$("#myModal").find(".modal-title").html(title);
                //$("#myModal").find(".modal-body").html(body);
                $("#myModal").modal(); 
                $("#myModal").find("#confirmBtn").click(function(e){
                    $("#myModal").modal("hide");
                    callback(); 
                });
            },
            openChildren: function(id){
                var node = $('#jsECTDtree').jstree(true).get_node(id);          //console.log(node);
                var children = node.children; 
                if(children.length==0) return;
                
                for(var i =0; i<children.length; i++){
                    var childNode = $('#jsECTDtree').jstree(true).get_node(children[i]);
                    if (!node.state.opened && childNode.type!=="tag" &&childNode.type!=="file") $('#jsECTDtree').jstree(true).open_node(id) 
                    if(childNode.children.length>1) JsTree.openChildren(children[i]);
                }

            }, 
            paintParents: function(parents){                                              //console.log(parents);
                for(var i =0; i<parents.length-2; i++){
                    var parent = $('#jsECTDtree').jstree(true).get_node(parents[i]);    //console.log(parent) 
                    if(parent.type!=="tag" && parent.text.indexOf("<b>")<0) $('#jsECTDtree').jstree(true).set_text(parent, "<b>"+parent.text+"</b>");
                    //$("#"+parent.id+"_anchor").addClass("hasFile"); //console.log($("#"+parent.id+"_anchor"))
                }
            }
        }   
    }(); 
    
    
        
