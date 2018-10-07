/**
 * Created by richardy on 11/9/2017.
 */

angular.module('MetronicApp').controller('JstreeCtrl', ['$rootScope','$scope','$state', 'CookiesApiService', 'ApplicationApiService', "TagApiService",
    function($rootScope, $scope, $state,  CookiesApiService, ApplicationApiService, TagApiService) {
        var appId;                                                //console.log("edit info");
        if(CookiesApiService.GetCookies()){
            appId = $rootScope.appData.id;
            JsTree.userData = $rootScope.userData;
        }

        if(!$rootScope.subFiles || $rootScope.subFiles.length==0){
            ApplicationApiService.GetAppNodes($rootScope.userData, appId).then(function(result){     //console.log("appData ", result);
                if(result){
                    $rootScope.subFiles = result;                
                    JsTree.initTree($rootScope.subFiles);                               //console.log('subFiles: ', $rootScope.subFiles);
                    $rootScope.substanceTags = {};
                    getSubTags(appId, $rootScope.userData); 
                }
            });
        }else{
            JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);                                   console.log('subFiles: ',  $rootScope.substanceTags);
            // getSubTags(appId, $rootScope.userData);
        }
        $scope.toggleTree = function(){
            JsTree.toggle($rootScope.open);
            $rootScope.open = ! $rootScope.open; 
        };

        function getSubTags(appId, userData){
            var promises = [];
            
            angular.forEach(["m23S", "m23P", "m32S", "m32P"], function(value, key){
                promises.push(
                    TagApiService.GetTagByNid(userData, appId, value)
                );
            });
            Promise.all(promises).then(x=>{ 
                return x.filter(entry => entry.node);
            }).then(x => {                      //console.log(x);
                x.map(entry => {
                    $rootScope.substanceTags[entry.node.id] = entry;
                    JsTree.addSubstanceTag(entry.node.id, entry);
                });
            });
        }
    }]);

angular.module('MetronicApp').controller('AdinfoCtrl', ['$rootScope','$scope','$state','$cookies', 'CookiesApiService', 'GenInfoApiService',
    function($rootScope, $scope, $state, $cookies, CookiesApiService, GenInfoApiService) {

        var appId, adminData;                                               
        if(CookiesApiService.GetCookies()){
            appId = $rootScope.appData.id;
        }              

        $scope.getUserData = function(){
            return $rootScope.userData;
        };
        if(appId){
            $scope.appData ={number: $rootScope.appData.number, sequence: $rootScope.appData.sequence}; 
            //$scope.adminData = angular.copy(adminData);    console.log($scope.adminData)
        } 
        
        var referenceData={};
        $scope.appTypes=[], $scope.subTypes=[], $scope.subSubTypes=[];
        $scope.appTypes = ["New Drug Application (NDA)", "Abbreviated New Drug Application (ANDA)","Biologic License Application (BLA)", "Investigational New Drug (IND)", 
            "Drug Master File (DMF)", "Emergency Use Authorization (EUA)"];
        $scope.subTypes =["Original Application", "Efficacy Supplement", "Chemistry Manufacturing Controls Supplement","Labeling Supplement", "Annual Report", 
            "Product Correspondence", "Postmarketing Requirements or Postmarketing Commitments", "Promotional Labeling Advertising", "IND Safety Reports", "Periodic Safety Reports"];
        $scope.subSubTypes = ["Original", "Presubmission", "Application", "Amendment", "Resubmission", "Report", "Correspondence"];
        
        $scope.contactTypes = [{code: "REG", name: "Regulatory Contact"}, {code: "TEC", name:"Technical Contact"}, 
                                {code: 'AGT', name:"United States Agent"}, {code: "PRO", name: "Promotional Labelling and Advertising Regulatory Contact"}];
        $scope.effTypes =["Prior Approval Supplement (PAS)", "Changes Being Effected-0 (CBE-0)", "Changes Being Effected-30 (CBE-30)"];
        $scope.telephoneTypes = [{code: 'BUS', name:"Business Telephone Number"},{code: 'FAX', name: "Fax Telephone Number" } , {code: "MOB", name:"Mobile Telephone Number"}];
        
        $scope.referenceData = angular.copy(referenceData);
        // var typeArr=[], subTypeArr = [];
        // GenInfoApiService.GetAppType($scope.userData).then(
        //     function(result){
        //         if(result && result.length){         //console.log(result);
        //             typeArr = result;
        //             GenInfoApiService.GetGenInfo(appId, $rootScope.userData).then(
        //                 function(result){            //console.log(result);
        //                     if(result && result.id){
        //                         if (result.appType){
        //                             subTypeArr = getTypeList(typeArr, result.appType);   
        //                             $scope.subTypes = getTypes(subTypeArr);         console.log($scope.subTypes)
        //                         }
        //                         if(result.subType){
        //                             var subSubTypeArr = getTypeList(subTypeArr, result.subType);  //console.log(subTypeArr, result.subType);
        //                             $scope.subSubTypes = getTypes(subSubTypeArr);   console.log($scope.subSubTypes)
        //                         }
        //                         adminData = result;
        //                     }
        //                     $scope.adminData = angular.copy(adminData);
        //                 });
        //         }
        //     });
        GenInfoApiService.GetAppInfo($rootScope.userData, appId).then(
            function(result){                       console.log(result);
                if(result&&result.application){    
                    adminData = result;
                    $scope.adminData = angular.copy(adminData);
                }
            }
        );

        var contacts = [], contact={};
       
        GenInfoApiService.GetAppContacts($rootScope.userData, appId).then(
            function(res){                    console.log(res);
                if(res && res.length>0){
                    contacts = res;
                    contact = contacts[0];
                    $scope.contactData = angular.copy(contact);
                }
                
            }
        );
        
        // $scope.selectAppType = function(appType){   //console.log(appType);
        //     subTypeArr = getTypeList(typeArr, appType);   
        //     $scope.subTypes = getTypes(subTypeArr);         console.log($scope.subTypes);
        //     $scope.adminData.subType = '';
        //     $scope.adminData.subSubType = '';
        // }
        // $scope.selectSubType = function(subType){
        //     var subSubTypeArr = getTypeList(subTypeArr, subType);
        //     Scope.subSubTypes = getTypes(subSubTypeArr);
        // }
        $scope.toggleEditable = function(){
            $scope.uneditable =!$scope.uneditable;
        };

        $scope.submitAdinfo = function(){
            if($scope.adminForm.$valid){
                if(adminData.application){
                    const jsonData =JSON.stringify( $scope.adminData);       //console.log($scope.adminForm)
                    GenInfoApiService.UpdateAppInfo($rootScope.userData, adminData.application, jsonData).then(res=>{
                        if(res && res.application){  
                            toastr.success('Admin info updated');
                        }
                    });
                }else{
                    $scope.adminData['application'] = appId;
                    const jsonData =JSON.stringify( $scope.adminData);                                 console.log("submit admin", jsonData);
                    GenInfoApiService.CreateAppInfo($rootScope.userData, jsonData).then(function(result){
                        if(result && result.application){
                            toastr.success('Admin info created');
                            //$rootScope.appData.folder = $scope.adminData.appNumber;
                            //$rootScope.appData.version = $scope.adminData.subId;
                            $scope.uneditable = true;
                        }
                    });
                }
               
            }
        };
        $scope.cancelAdinfo = function(){                                              //console.log(jsonx);
            $scope.adminData = angular.copy(adminData);
            $scope.adminForm.$setPristine();
            $scope.adminForm.$setUntouched();
            $scope.adminForm.$setValidity();
        };
        $scope.submitContact = function(){
    
            if($scope.contactForm.$valid){
                if($scope.contactData.id){
                    const jsonData =JSON.stringify($scope.contactData);               console.log("contact data: ", jsonData);
                    GenInfoApiService.UpdateContact($rootScope.userData, $scope.contactData.id, jsonData).then(
                        function(res){              console.log(res);
                            if(res && res.id){
                                contact = res;
                                toastr.success('Contact info updated');
                                $scope.uneditable = true;
                                updateContact(contact);
                            }
                        }
                    );
                }else{
                    $scope.contactData['application'] = appId;
                    const jsonData =JSON.stringify($scope.contactData);               console.log("contact data: ", jsonData);
                    GenInfoApiService.CreateContact($rootScope.userData, jsonData).then(
                        function(result){                                       console.log(result);
                            if(result && result.id){
                                contact = result;
                                toastr.success('Contact info created');
                                $scope.uneditable = true;
                                updateContact(contact);
                            }
                        });
                }    
            }
        };
        $scope.cancelContact = function(){                                          //console.log(contact);
            $scope.contactData = angular.copy(contact);
            $scope.contactForm.$setPristine();
            $scope.contactForm.$setUntouched();
            $scope.contactForm.$setValidity();
        };
        $scope.updateContact = function(){
            if(contacts.length>=1){                                             //console.log(contacts);
                contact = {"contactType": $scope.contactForm.contactType.$viewValue};
                for(var i=0; i<contacts.length; i++ ){                          //console.log(contacts[i].contactType);
                    if(contacts[i].contactType == $scope.contactForm.contactType.$viewValue) {contact = contacts[i];}
                };
                $scope.contactData = angular.copy(contact);
            }
            //$scope.contactForm.$setPristine();
            $scope.contactForm.$setUntouched();
            //$scope.contactForm.$setValidity();
        };
        function updateContact(newContact){
            var found = false;
            for(var i=0; i<contacts.length; i++ ){                          //console.log(contacts[i].contactType);
                if(contacts[i].contactType == newContact.contactType) {contacts[i] = newContact; found = true; }
            };
            if(!found) contacts.push(newContact);
        }
       
        $scope.submitReference = function(){
            if($scope.referenceForm.$valid){
                var jsonData =JSON.stringify( $scope.referenceData);                                 //console.log(jsonData);
            }
        };
        $scope.cancelReference = function(){
            $scope.referenceData = angular.copy(referenceData);
            $scope.referenceForm.$setPristine();
            $scope.referenceForm.$setUntouched();
            $scope.referenceForm.$setValidity();
        };
        // function getAppType(userData, callback){
        //     GenInfoApiService.GetAppType(userData).then(
        //         function(result){
        //             if(result && result.length){         console.log(result);
        //                 typeArr = result;
        //                 if(callback) callback();
        //             }
        //         });
        // }
        // function getTypeList(list, type){
        //     var arr = false;
        //     angular.forEach(list, function(v, k){       
        //         if(v.type.substr(0,5) == type.substr(0,5)){         //console.log(v.subSubTypeList)
        //             if(v.subTypeList) arr = v.subTypeList;
        //             if(v.subSubTypeList) arr = v.subSubTypeList;
        //         } 
        //     });
        //     return arr;
        // }
        // function getTypes(typelist){   
        //     var arr = [];
        //     angular.forEach(typelist, function(v, k){
        //         arr.push(v.type);
        //     });
        //     return arr;
        // }
    }]).controller('TagCtrl', ['$rootScope','$scope','$state','CookiesApiService', 'TagApiService',
    function($rootScope, $scope, $state,  CookiesApiService, TagApiService) {

        if(CookiesApiService.GetCookies()){
            appId = $rootScope.appData.id; 
        }
        var jsonx= {}, nodeId;
      
        $scope.stfTypes = ["Pre-Clinical Study Report", "Legacy Clinical Study Report", "Synopsis", "Study Report Body", "Protocol or Amendment", 
            "Sample Case Report Form", "IEC IRB Consent Form List", "List Description Investigator Site", "Signatures Investigators", 
            "List Patients with Batches", "Randomisation Scheme", "Audit Certificates Report", "Statistical Methods Interim Analysis Plan", 
            "Inter Laboratory Standardisation Methods Quality Assurance", "Publications Based on Study", "Publications Referenced in Report", 
            "Discontinued Patients", "Protocol Deviations", "Patients Excluded from Efficacy Analysis", "Demographic Data", "Compliance and Drug Concentration Data", 
            "Individual Efficacy Response Data", "Adverse Event Listings", "Listing Individual Laboratory Measurements by Patient", "Case Report Forms", "Available on Request"];
        $scope.specieTypes = ["none", "mouse", "rat", "hamster", "other-rodent", "rabbit", "dog", "non-human-primate", "other-non-rodent-mammal", "non-mammals"];
        $scope.routeTypes = ["none", "oral", "intravenous", "intramuscular", "intraperitoneal", "subcutaneous", "inhalation", "topical", "other"];
        $scope.durationTypes = ["none", "short", "medium", "long"];
        $scope.controlTypes = ["none", "placebo", "no-treatment", "dose-response-without-placebo", "active-control-without-placebo", "external"];    
        

        $scope.init = function(){
            $scope.uneditable = true;
            $scope.substanceTag = false;
            $scope.productTag = false;
            $scope.stfTag = false;
            $scope.isNodefile = false;
        };
        $scope.genData = angular.copy(jsonx);
        $scope.toggleEditable = function(){
            $scope.uneditable = !$scope.uneditable;
        };

        $scope.submitTag = function(){          
            if($scope.genForm.$valid){
                
                $scope.genData.tag = $scope.substanceTag? "substance" : $scope.productTag? "product" : $scope.stfTag ? "stf" : null;
                if($scope.species && $scope.species.length) $scope.genData.species =  $scope.species.toString();

                if($scope.genData.node){
                    nodeId = $scope.genData.node.id;
                    const tagId = $scope.genData.node.nid;
                    delete $scope.genData.node;
                    const genData = JSON.stringify($scope.genData);       console.log("tag: " , genData);
                    TagApiService.UpdateTag($rootScope.userData, tagId, genData).then(function(res){
                        if(res && res.node){                                console.log(res)
                            toastr.success('Tag info updated');
                            if(nodeId=="m32S" || nodeId=="m23S"){
                                const addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.substance+"]";
                                JsTree.addNodeText(nodeId, addText);
                                $rootScope.substanceTags[nodeId] = JsTree.substanceTags[nodeId] = res;
    
                            }else if(nodeId=="m32P"||nodeId=="m23P"){
                                const addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.productName+"]["+$scope.genData.dosage+"]";
                                JsTree.addNodeText(nodeId, addText);
                                $rootScope.substanceTags[nodeId] = JsTree.substanceTags[nodeId] = res;
                            }
                        }
                    });
                
                }else{
                    const genData = JSON.stringify($scope.genData);       console.log("tag: " , $scope.genData);

                    TagApiService.CreateTag($rootScope.userData, appId, nodeId, genData).then(function(result){           
                        if(result && result.node){                  console.log(result)
                            toastr.success('Tag info created');
                            if(nodeId=="m32S" || nodeId=="m23S"){
                                const addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.substance+"]";
                                JsTree.addNodeText(nodeId, addText);
                                $rootScope.substanceTags[nodeId] = JsTree.substanceTags[nodeId] = result;
    
                            }else if(nodeId=="m32P"||nodeId=="m23P"){
                                const addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.prodName+"]["+$scope.genData.dosage+"]";
                                JsTree.addNodeText(nodeId, addText);
                                $rootScope.substanceTags[nodeId] = JsTree.substanceTags[nodeId] = result;
                            }
                        }
                    });

                }
                $scope.uneditable = true;
                //toastr.success('Stf done');
            }
        };
        $scope.cancelTag = function(){
            $scope.genData = angular.copy(jsonx);
            $scope.genForm.$setPristine();
            $scope.genForm.$setUntouched();
            $scope.genForm.$setValidity();
        };
        $scope.setTagTitle = function(node){                                 //console.log(node);

            var sNumber = node.original.sNumber; // node.type=="tag"? node.text.split(" ")[0].replace(/<\/?[^>]+(>|$)/g, "") :
            nodeId = node.id;                                                                  
            var studyTag = showTags(node);
            $scope.isNodeFile = node.type === "file";                                                   //console.log('isNodeFile',$scope.isNodefile);

            TagApiService.GetTagByNid($rootScope.userData, appId, nodeId).then(function(result){    //console.log("tag:", result);
                if(result && result.node){
                    if(node.type==="file" && !result.operation) result.operation = "New";
                       
                    jsonx = result;                                             //console.log("result: ", jsonx);
                    $scope.genData = angular.copy(jsonx);
                    if($scope.genData.species) 
                        $scope.species = $scope.genData.species.split(",");     //console.log($scope.genData.species);
                }else{
                    var title = node.text.slice(node.text.indexOf(" ")+1, node.text.length).replace(/<\/?[^>]+(>|$)/g, "");
                    jsonx = studyTag? {"title": "Study Title", "eCode":"Study Report (STF 2.2)"} : {'sNumber': sNumber, 'title': title, 'eCode':node.text.replace(/<\/?[^>]+(>|$)/g, "")};
                    if(node.type==="file") jsonx.operation = "New";
                    $scope.genData = angular.copy(jsonx);
                }

            });
        };
        if(!$rootScope.tagEdit)  $rootScope.tagEdit = false;
        $rootScope.togglePortlet = function(){
            $rootScope.tagEdit = ! $rootScope.tagEdit;
            var node = JsTree.getSelectedNode();
            if($rootScope.tagEdit && node) //JsTree.getNodeContent();
                $scope.setTagTitle(node);
        };
        function showTags(node){ //console.log(node);

            if(node.id==="m32S"||node.id==="m23S"){
                $scope.substanceTag = true;
                $scope.productTag = false;
                $scope.stfTag = false;
            }else if(node.id==="m32P"||node.id==="m23P"){
                $scope.productTag = true;
                $scope.stfTag = false;
                $scope.substanceTag = false;
            }else if(/*node.type==="file" &&*/ (node.parents.indexOf("m4")>=0||node.parents.indexOf("m5")>=0)){             //array.includes only IE>=12
                $scope.substanceTag = false;
                $scope.productTag = false;
                $scope.stfTag = true;
                return true;
                //$scope.genData.eCode = "Study Report (STF 2.2)";
            }else{
                $scope.substanceTag = false;
                $scope.productTag = false;
                $scope.stfTag = false;
            }
        }
        
    }]);