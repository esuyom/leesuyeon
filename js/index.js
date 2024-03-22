$(document).ready(function(){
    // 마우스 커서
    $(window).mousemove(function (e) {
        $(".ring").css(
            "transform",
            `translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
        );
    });
    $("#wrap.main #main .wall1 .txt2").hover(function(){
        $("#cursor").addClass("type1");
    }, function(){
        $("#cursor").removeClass("type1");
    });	

    $("#wrap.main #main .wall2 .txt2").hover(function(){
        $("#cursor").addClass("type2");
    }, function(){
        $("#cursor").removeClass("type2");
    });	

    // profile
    $("#wrap.main #main .wall1 .profile").click(function(){
        $("#profile").addClass("active");
    });

    // work
    $("#wrap.main #main .wall2 .work").click(function(){
        $("#work").addClass("active");
    });

    $("section.side .close").click(function(){
        $("section.side").removeClass("active");
    });
});