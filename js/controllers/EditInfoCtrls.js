/**
 * Created by richardy on 11/9/2017.
 */

angular.module('MetronicApp').controller('JstreeCtrl', ['$rootScope','$scope','$state', 'CookiesApiService', 'ApplicationApiService',
    function($rootScope, $scope, $state,  CookiesApiService, ApplicationApiService) {
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
            });
        }else{
            JsTree.initTree($rootScope.subFiles);                                   //console.log('subFiles: ', $rootScope.subFiles);
        }
        $scope.toggleTree = function(){
            JsTree.toggle($rootScope.open);
            $rootScope.open = ! $rootScope.open; // ? false : true;
        };
       /* if(!$rootScope.tagEdit)  $rootScope.tagEdit = false;
        $rootScope.togglePortlet = function(){
            //JsTree.getNodeContent();
            $rootScope.tagEdit = ! $rootScope.tagEdit;
            if($rootScope.tagEdit) JsTree.getNodeContent();
        };*/
    }]);

angular.module('MetronicApp').controller('AdinfoCtrl', ['$rootScope','$scope','$state','$cookies', 'CookiesApiService', 'GenInfoApiService',
    function($rootScope, $scope, $state, $cookies, CookiesApiService, GenInfoApiService) {

        //function AdinfoCtrl($rootScope, $scope, $state, $translate, CookiesApiService, GenInfoApiService){  //console.log($rootScope.subFiles);
        var appUid;                                                //console.log("user Data", CookiesApiService.GetCookies());
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;
        }

        $scope.getUserData = function(){
            return $rootScope.userData;
        };
        var adminData ={"appNumber": $rootScope.appData.folder, "subId": $rootScope.appData.version}; // = $cookies.get("adminData")? JSON.parse($cookies.get("adminData")):{};
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
        $scope.appTypes = ["New Drug application (NDA)", "abbreviated new drug application (ANDA)","Biologic License Application (BLA)", "Investigational New Drug (IND)",
            "Drug Master File (DMF)", "Emergency Use Authorization (EUA)"];
        $scope.subTypes =["Original Application", "Efficacy Supplement", "Chemistry Manufacturing Controls Supplement","Labeling Supplement", "Annual Report", "Product Correspondence",
            "Postmarketing Requirements or Postmarketing Commitments", "Promotional Labeling Advertising", "IND Safety Reports", "Periodic Safety Reports"];
        $scope.effTypes =["Prior Approval Supplement (PAS)", "Changes Being Effected-0 (CBE-0)", "Changes Being Effected-30 (CBE-30)"];
        $scope.subSubTypes = ["Original", "Presubmisssion", "Application", "Amendment", "Resubmission", "Report", "Correspondence"];


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
//                $.post('php/adinfo.php', {'appData': jsonData}, function(result){
//                    if(result) {
//                        toastr.success('Reference information Saved');
//                        //$scope.uneditable = true;
//                        //Portlet.write(result);
//                    }
//                });
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

        $scope.stfTypes = ["Pre-clinical study report", "Complete clinical study report", "2 Study Report Synopsis", "1,3-15 Study Report Body", "16.1.1 Protocol and/or Amendment",
            "16.1.2 Sample CRF", "16.1.3 IEC and IRB and Consent Form Listings", "16.1.4 Description of Investigators and Sites",
            "16.1.5 Signatures of principal or coordinating investigator(s)or sponsor's reponsible medical officer", "16.1.6 Listing of patients receiving test drug(s) from specified batch",
            "16.1.7 Randomisation Scheme","16.1.8 Audit Certificates or similar documentation", "16.1.9 Documentation of statistical methods and interim analysisis plans",
            "16.1.10 Documentation of Inter-laboratory Standardization and Quality Assurance" ] ;
        $scope.specieTypes = ["none", "mouse", "rat", "hamster", "other-rodent", "rabbit", "dog", "non-human-primate", "other-non-rodent-mammal", "non-mammals"];
        $scope.routeTypes = ["none", "oral", "intravenous", "intramuscular", "intraperitioneal", "subcutaneous", "inhalation", "topical", "other"];
        $scope.durationTypes = ["none", "short", "medium", "long"];
        $scope.controlTypes = ["none", "placebo", "no-treatment", "dose-reponse-without-placebo", "active-control-without-placebo", "external"];

        $scope.init = function(){
            $scope.uneditable = true;
            $scope.substanceTag = false;
            $scope.productTag = false;
            $scope.stfTag = false;
        };
        $scope.genData = angular.copy(jsonx);
        $scope.toggleEditable = function(){
            $scope.uneditable = !$scope.uneditable;
        };

        $scope.submitTag = function(){
            if($scope.genForm.$valid){
                $scope.genData.nodeId = nodeId;
                $scope.genData.species = "";
                if($scope.genData.createdAt){
                    delete $scope.genData.createdAt;
                    delete $scope.genData.updatedAt;
                }
                $scope.genData.tag = $scope.substanceTag? "substance" : $scope.productTag? "product" : $scope.stfTag ? "stf" : null;
                var genData = JSON.stringify($scope.genData);                                  console.log("tag: " , $scope.genData);

                TagApiService.CreateTag($rootScope.userData, appUid, genData).then(function(result){           console.log(result)
                    if(result.id){
                        toastr.success('Tag info');
                        if($scope.genData.nodeId=="m32s"||$scope.genData.nodeId=="m23S"){
                            var addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.substance+"]";
                            JsTree.addNodeText($scope.genData.nodeId, addText);
                        }else if($scope.genData.nodeId=="m32p"||$scope.genData.nodeId=="m23P"){
                            var addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.prodName+"]["+$scope.genData.dosage+"]";
                            JsTree.addNodeText($scope.genData.nodeId, addText);
                        }
                    }
                });
                /*$.post('php/tag.php', {'appData': genData}, function(result){
                 if(result) {
                 toastr.success('Tag info');
                 //Portlet.write(result, true);

                 if($scope.genData.nodeId=="m32s"||$scope.genData.nodeId=="m23S"){
                 var addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.substance+"]";
                 JsTree.addNodeText($scope.genData.nodeId, addText);
                 }else if($scope.genData.nodeId=="m32p"||$scope.genData.nodeId=="m23P"){
                 var addText = "["+$scope.genData.manufacturer+"]["+$scope.genData.prodName+"]["+$scope.genData.dosage+"]";
                 JsTree.addNodeText($scope.genData.nodeId, addText);
                 }

                 var findTag = false;
                 if(tagData.length>=1){
                 for(var i=0; i<tagData.length; i++ ){
                 if(tagData[i].nodeId == nodeId){                    //console.log(tagData[i].nodeId, nodeId);
                 tagData[i]=angular.copy($scope.genData);
                 findTag = true;
                 }
                 }
                 }
                 if(!findTag) tagData.push(angular.copy($scope.genData));
                 $cookies.putObject("tagData", tagData);
                 }
                 });*/
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
            nodeId = node.id;                                                                  //console.log('id',nodeId)
            var studyTag = showTags(node);

            TagApiService.GetTagByNid(appUid, nodeId, $rootScope.userData).then(function(result){    //console.log("tag:", result);
                if(result && result.id){
                    jsonx = result;                                             console.log("result: ", jsonx);
                    $scope.genData = angular.copy(jsonx);
                }else{
                    var title = node.text.slice(node.text.indexOf(" ")+1, node.text.length).replace(/<\/?[^>]+(>|$)/g, "");
                    jsonx = studyTag? {"title": "Study Title", "eCode":"Study Report (STF 2.2)"} : {'sNumber': sNumber, 'title': title, 'eCode':node.text.replace(/<\/?[^>]+(>|$)/g, "")};
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
            }else if(node.type==="file" && (node.parents.indexOf("m4")>=0||node.parents.indexOf("m5")>=0)){             //array.includes only IE>=12
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