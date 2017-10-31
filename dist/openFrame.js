
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

//function closeMe(evt) {
//    if (typeof evt == 'undefined') {
//        evt = window.event; }
//    if (evt && evt.clientX >= (window.event.screenX - 150) &&
//        evt.clientY >= -150 && evt.clientY <= 0) {
//        return "Do you want to log out of your current session?";
//    }
//}
//window.onbeforeunload = closeMe;

