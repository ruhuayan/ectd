 var Base_URL = "http://192.168.88.187:8080/ectd";
 //var Base_URL = "http://52.4.14.123/ectd";

 // to prevent client from leaving the page
 $(window).bind("beforeunload", function(e){
     toastr.warning("Please right click to open the link in a new tab!", "OPEN PDF LINKS", {
         "closeButton": true,
         "debug": false,
         "newestOnTop": false,
         "progressBar": false,
         "positionClass": "toast-bottom-full-width",
         "preventDuplicates": true,
         "onclick": null,
         "showDuration": "300",
         "hideDuration": "1000",
         "timeOut": "5000",
         "extendedTimeOut": "1000",
         "showEasing": "swing",
         "hideEasing": "linear",
         "showMethod": "fadeIn",
         "hideMethod": "fadeOut"
     });
     //console.log("document href: ", e.activeElement, window.status )
     //return "Right click the link inside pdf to open a tab";
     return 0;
 });
