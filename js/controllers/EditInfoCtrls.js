/**
 * Created by richardy on 11/9/2017.
 */

angular.module('MetronicApp').controller('JstreeCtrl', ['$rootScope','$scope','$state', 'CookiesApiService', 'ApplicationApiService', "TagApiService",
    function($rootScope, $scope, $state,  CookiesApiService, ApplicationApiService, TagApiService) {
        //function JstreeCtrl($rootScope, $scope, CookiesApiService, ApplicationApiService){
        var appUid;                                                console.log("edit info");
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;
            JsTree.userData = $rootScope.userData;
        }

        if(!$rootScope.subFiles || $rootScope.subFiles.length==0){
            ApplicationApiService.GetApplication(appUid, $rootScope.userData).then(function(result){     //console.log("appData ", JsTree);
                $rootScope.subFiles = result.nodeList;
                //$rootScope.appData.NumOfFiles = result.nodeList.length;
                
                JsTree.initTree($rootScope.subFiles);                               //console.log('subFiles: ', $rootScope.subFiles);
                $rootScope.substanceTags = {};
                getSubTags(appUid, $rootScope.userData);
                
            });
        }else{
            JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);                                   console.log('subFiles: ',  $rootScope.substanceTags);
            // getSubTags(appUid, $rootScope.userData);
        }
        $scope.toggleTree = function(){
            JsTree.toggle($rootScope.open);
            $rootScope.open = ! $rootScope.open; 
        };

        function getSubTags(appUid, userData){
            var promises = [];
            
            angular.forEach(["m23S", "m23P", "m32S", "m32P"], function(value, key){
                promises.push(
                    TagApiService.GetTagByNid(appUid, value, userData)
                );
            });
            Promise.all(promises).then(x=>{
                return x.filter(entry => entry.id);
            }).then(x => {                      //console.log(x);
                x.map(entry => {
                    $rootScope.substanceTags[entry.nodeId] = entry;
                    JsTree.addSubstanceTag(entry.nodeId, entry);
                })
                // angular.forEach( x, (y, i)=>{        //console.log(y);
                //     if(y.id){
                //         $rootScope.substanceTags[y.nodeId] = y;
                //         JsTree.addSubstanceTag(y.nodeId, y);
                //     }
                // });
            });
        }
    }]);

angular.module('MetronicApp').controller('AdinfoCtrl', ['$rootScope','$scope','$state','$cookies', 'CookiesApiService', 'GenInfoApiService',
    function($rootScope, $scope, $state, $cookies, CookiesApiService, GenInfoApiService) {

        //function AdinfoCtrl($rootScope, $scope, $state, $translate, CookiesApiService, GenInfoApiService){  //console.log($rootScope.subFiles);
        var appUid, adminData;                                                //console.log("user Data", CookiesApiService.GetCookies());
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;
        }

        $scope.getUserData = function(){
            return $rootScope.userData;
        };
        if(appUid) adminData ={"appNumber": $rootScope.appData.folder, "subnum": $rootScope.appData.version}; // = $cookies.get("adminData")? JSON.parse($cookies.get("adminData")):{};
        GenInfoApiService.GetGenInfo(appUid, $rootScope.userData).then(
            function(result){
                if(result && result.id){
                    adminData = result;
                }
                $scope.adminData = angular.copy(adminData);
            });
        var contacts = [], contact={};
        GenInfoApiService.GetContacts(appUid, $rootScope.userData).then(
            function(result){                                               //console.log("contact data: ", result);
                if(result){ contacts = result;
                    contact = contacts[0];
                }
                $scope.contactData = angular.copy(contact);
            });
        /*if($cookies.get("contactData")) {
         contacts = JSON.parse($cookies.get("contactData"));
         contact = contacts[0];
         };*/
        var referenceData={};
        
        $scope.contactTypes = ["Regulatory Contact", "Technical Contact", "United States Agent", "Promotional Labelling and Advertising Regulatory Contact"];
        $scope.appTypes = ["New Drug Application (NDA)", "Abbreviated New Drug Application (ANDA)","Biologic License Application (BLA)", "Investigational New Drug (IND)", 
            "Drug Master File (DMF)", "Emergency Use Authorization (EUA)"];
        $scope.subTypes =["Original Application", "Efficacy Supplement", "Chemistry Manufacturing Controls Supplement","Labeling Supplement", "Annual Report", 
            "Product Correspondence", "Postmarketing Requirements or Postmarketing Commitments", "Promotional Labeling Advertising", "IND Safety Reports", "Periodic Safety Reports"];
        $scope.effTypes =["Prior Approval Supplement (PAS)", "Changes Being Effected-0 (CBE-0)", "Changes Being Effected-30 (CBE-30)"];
        $scope.subSubTypes = ["Original", "Presubmission", "Application", "Amendment", "Resubmission", "Report", "Correspondence"];
        $scope.telephoneTypes = ["Business Telephone Number", "Fax Telephone Number", "Mobile Telephone Number"];
        // var subsubTypes =[["original", "Presubmission", "Application"], ["a", "b", "c"], ["c", "d"]]; 
        // subsubTypes[$scope.subTypes.indexOf(string)]
        //$scope.adminData = angular.copy(adminData);
        //$scope.contactData = angular.copy(contact);                         //console.log("initial contact", contacts[0]);
        $scope.referenceData = angular.copy(referenceData);

        $scope.toggleEditable = function(){
            $scope.uneditable =!$scope.uneditable;
        };

        $scope.submitAdinfo = function(){

            if($scope.adminForm.$valid){
                if($scope.adminData.createdAt) {
                    delete $scope.adminData.createdAt;
                    delete $scope.adminData.updatedAt;
                }
                var jsonData =JSON.stringify( $scope.adminData);                                 console.log("submit admin", jsonData);
                GenInfoApiService.CreateGenInfo(appUid, $rootScope.userData, jsonData).then(function(result){
                    if(result.id){
                        toastr.success('Admin info Saved');
                        //$rootScope.appData.folder = $scope.adminData.appNumber;
                        //$rootScope.appData.version = $scope.adminData.subId;
                        $scope.uneditable = true;
                    }
                });
                /*$.post('php/adinfo.php', {'appData': jsonData}, function(result){
                 if(result) {
                 toastr.success('Admin info Saved');
                 $cookies.putObject("adminData",$scope.adminData);
                 }
                 });*/
            }
        };
        $scope.cancelAdinfo = function(){                                              //console.log(jsonx);
            $scope.adminData = angular.copy(adminData);
            $scope.adminForm.$setPristine();
            $scope.adminForm.$setUntouched();
            $scope.adminForm.$setValidity();
        };
        $scope.submitContact = function(){
            //if(!$scope.isStringNumberic($scope.contactForm.phone.$viewValue)) return;
            //$scope.contactData.appUid = appUid;                                        console.log(JSON.stringify($scope.contactData));
            if($scope.contactForm.$valid){
                if($scope.contactData.createdAt) {
                    delete $scope.contactData.createdAt;
                    delete $scope.contactData.updatedAt;
                }
                var jsonData =JSON.stringify($scope.contactData);               console.log("contact data: ", jsonData);

                GenInfoApiService.CreateContact(appUid, $rootScope.userData, jsonData).then(
                    function(result){                                       console.log(result);
                        if(result && result.id){
                            contact = result;
                            toastr.success('Contact info Saved');
                        }
                        $scope.uneditable = true;
                        updateContact(contact);
                    });

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
        };//}
    }]).controller('TagCtrl', ['$rootScope','$scope','$state','CookiesApiService', 'TagApiService',
    function($rootScope, $scope, $state,  CookiesApiService, TagApiService) {

        //function TagCtrl($rootScope, $scope, $state, CookiesApiService, TagApiService){
        var appUid;                                                //console.log("user Data", CookiesApiService.GetCookies());
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;
        }
        var jsonx= {}, nodeId;
        /*if($cookies.get("tagData")) {
         tagData = JSON.parse($cookies.get("tagData"));                      console.log(tagData);
         };*/


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
                $scope.genData.nodeId = nodeId;
                //$scope.genData.species =  $scope.species.toString();
                if($scope.genData.createdAt){
                    delete $scope.genData.createdAt;
                    delete $scope.genData.updatedAt;
                }
                $scope.genData.tag = $scope.substanceTag? "substance" : $scope.productTag? "product" : $scope.stfTag ? "stf" : null;
                if($scope.species && $scope.species.length) $scope.genData.species =  $scope.species.toString();
                var genData = JSON.stringify($scope.genData);                                                 //console.log("tag: " , $scope.genData);

                TagApiService.CreateTag($rootScope.userData, appUid, genData).then(function(result){           console.log(result)
                    if(result.id){
                        toastr.success('Tag info');
                        if($scope.genData.nodeId=="m32S"||$scope.genData.nodeId=="m23S"){
                            var addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.substance+"]";
                            JsTree.addNodeText($scope.genData.nodeId, addText);
                            $rootScope.substanceTags[$scope.genData.nodeId] = JsTree.substanceTags[$scope.genData.nodeId] = result;

                        }else if($scope.genData.nodeId=="m32P"||$scope.genData.nodeId=="m23P"){
                            var addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.prodName+"]["+$scope.genData.dosage+"]";
                            JsTree.addNodeText($scope.genData.nodeId, addText);
                            $rootScope.substanceTags[$scope.genData.nodeId] = JsTree.substanceTags[$scope.genData.nodeId] = result;
                        }
                    }
                });
               
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

            TagApiService.GetTagByNid(appUid, nodeId, $rootScope.userData).then(function(result){    //console.log("tag:", result);
                if(result && result.id){
                    if(node.type==="file" && !result.operation) result.operation = "New";
                       
                    jsonx = result;                                             console.log("result: ", jsonx);
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

            /*var title = node.text.slice(node.text.indexOf(" ")+1, node.text.length);
             if(!findTag) jsonx = studyTag? {"title": "Study Title", "eCode":"Study Report (STF 2.2)"} : {'sNumber': sNumber, 'title': title, 'eCode':node.text};
             if(edit)
             $scope.$apply(function(){
             $scope.genData = angular.copy(jsonx);
             });
             else{
             $scope.genData = angular.copy(jsonx);;
             } */

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