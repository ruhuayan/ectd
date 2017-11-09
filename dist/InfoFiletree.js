
    var Portlet = function(){
        return{
            write: function(data, tag){
                if(tag) $('.tag-portlet').find('.portlet-body').html(data);
                else $('.admin-portlet').find('.portlet-body').html(data);
            },
            togglePanel: function(el, x){                                          //console.log($(el))
                var accordin = $(el).parents(".form-panels");
                accordin.find(".panel").each(function(index){                    
                    //$(this).find(".panel-collapse.collapse").collapse("toggle");
                    var title = $(this).find("a.panel-title");
                    if(index===x){                                     //console.log(title.attr("aria-expanded"))                                  
                        if(title.attr("aria-expanded")==="true"){ 
                            title.attr("aria-expanded", "false");
                            $(this).find(".panel-collapse.collapse").collapse('hide');
                        }else{
                            title.attr("aria-expanded", "true");
                            $(this).find(".panel-collapse.collapse").collapse('show');
                        }
                    }else{
                        title.attr("aria-expanded", "false");
                        $(this).find(".panel-collapse.collapse").collapse('hide');
                    } 
                });
            }
        };
    }();

                                                                                                    //console.log(Filetree.prototype);
    function Jstree(id, height){
        Filetree.call(this, id, height);
        this.ctrlId = "#AdinfoCtrl";
    }
    Jstree.prototype = {
        constructor: Jstree,
        setHandler: function(){
            var _this = this;
            this.tree.jstree(true).bind("select_node.jstree", function (e, data) {
                _this.tree.jstree(true).getNodeContent(data.node);                                      //console.log("node_id: " + data.node.id);
            });
        },
        getSelectedNode: function(){
            var node = this.tree.jstree(true).get_selected(true);
            return node.length ? node[0] : false;
        },
        addNodeText:function(id, text){
            //var node = $('#jsECTDtree').find("[id="+id+"]"); console.log(node);
            var node = this.tree.jstree(true).get_node(id);                     console.log(node);
            this.tree.jstree(true).set_text(node, node.text+' '+text);
        },
        getNodeContent: function(selectedNode){
            if(selectedNode){
                var node = selectedNode;
                angular.element("#TagCtrl").scope().setTagTitle(node, true);
            }else{
                var node = this.getSelectedNode();                        //console.log(node);
                if(node) angular.element("#TagCtrl").scope().setTagTitle(node, false);
            }
        }
    };
    Jstree.prototype.__proto__ = Filetree.prototype;
    //Jstree.prototype = Object.create(Filetree.prototype);
    var JsTree = new Jstree("#jsECTDtree", $(window).height()-250 );

    JsTree.setSelectNodeHandler(function(data){
        JsTree.getNodeContent(data.node);                                      //console.log("node_id: " + data.node.id);
    });