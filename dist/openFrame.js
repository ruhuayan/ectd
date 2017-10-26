function openIframe(url){
        var w = $(window).width(), h = $(window).height(), gap = 100;
        var layer = $("<div>").attr("id", "layer")
                .css({"position": "absolute", "top": 0, "left": 0, "width": w, "height": $(document).height(), "background-color": "rgba(0, 0, 0, 0.5)", "text-align": "center", "z-index": 1001 });
        var iframe = $("<iframe>").attr("id", "frame")
                .css({"position": "absolute","top":gap,"left":w/4 ,"width": w/2, "height": h-gap*2, "border": "solid 1px #999"});        

        $("body").append(layer);
        $("#layer").click(function(){
            $(this).remove();
        });
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onprogress = function(e){        //console.log (e);
            if (e.lengthComputable) {
                var progress = e.loaded/e.total; 
                                                                                    //console.log(progress); 
            }
        };
        xhr.onload = function(e) {
            if (this.status === 200) {
                var blob = new Blob([this.response], {type: 'application/pdf'}),
                file = URL.createObjectURL(blob);                                   //console.log(file);
                layer.append(iframe);
                $("#frame").attr("src", file);
            }
        };
        xhr.send();
    }
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

