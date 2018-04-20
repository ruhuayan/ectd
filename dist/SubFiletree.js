
    function Subtree(id, height){
        Filetree.call(this, id, height);
        this.ctrlId = "#AllSubsCtrl";
    }
    Subtree.prototype = {
        constructor: Subtree,
        selectNodeHandler: function(data){     //console.log(data.node);
            if(data.node.children.length==0){                console.log(data.node.id);
                angular.element(this.ctrlId).scope().showAppTree(data.node.id);
            }
        }, 
        setTheme: function(){
            $(this.id).jstree("set_theme","default");
        }
    };
    Subtree.prototype.__proto__ = Filetree.prototype;            
    var SubTree = new Subtree("#subtree", $(window).height()-250 );
    // $("#subtree").jstree("set_theme","default");

    function Apptree(id, height){
        Filetree.call(this, id, height);
        this.ctrlId = "#AllSubsCtrl";
        this.firstLoad = true;
    }
    Apptree.prototype = {
        constructor: Subtree,
        refreshTree: function(fileJson){                                  //console.log("this.uptree",this.uptree);                              
            this.tree.css("border-top", "solid 1px #999");                    
            this.tree.jstree(true).settings.core.data = fileJson;             
            this.tree.jstree(true).refresh();
        },
        loadedHandler: function(){
            this.firstLoad = false;
            var _this = this; 
            _this.tree.css("height", _this.height);                                 //console.log("this.height: ", this.height);
            $(_this.tree.jstree().get_json("#", {flat: true}))
                .each(function(index, value) {
                    var node = _this.tree.jstree().get_node(this.id);
                    if(node.type === "tag" && node.children.length) 
                        _this.tree.jstree().set_icon(node.id, "fa fa-file");
                    else if(node.type ==="file") _this.paintParents(node.parents);
                });
            
            App.initSlimScroll(_this.tree);
        },  
        test: function(){
            console.log("test");
        }
    };
    Apptree.prototype.__proto__ = Filetree.prototype;            
    var AppTree = new Apptree("#apptree", $(window).height()-250 );


    