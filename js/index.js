$(document).ready(function(){
    // 이미지로드
    $('#work').imagesLoaded().done( function( instance ) {
        console.log('DONE  - all images have been successfully loaded');
      });

      // 마우스 커서
    $(window).mousemove(function (e) {
        $(".ring").css(
            "transform",
            `translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
        );
    });
    $("#wrap.main #main .wall1 .txt2").hover(function(){
        $("#cursor").addClass("type2");
    }, function(){
        $("#cursor").removeClass("type21");
    });	

    $("#wrap.main #main .wall2 .txt2").hover(function(){
        $("#cursor").addClass("type2");
    }, function(){
        $("#cursor").removeClass("type2");
    });	

    // profile
    $("#wrap.main #main .wall1 .profile").click(function(){
        $("#work").addClass("active");
    });

    // work
    $("#wrap.main #main .wall2 .work").click(function(){
        $("#profile").addClass("active");
    });

    $("#work .content .item").click(function(){
        $(".webSwiper").addClass("wide");
        $(this).addClass("active");
        swiper.destroy();
    });



    $("section.side .close").click(function(){
        $("section.side").removeClass("active");
    });

    // 스와이퍼
    var swiper = new Swiper(".webSwiper", {
        direction: 'vertical',
        slidesPerView: 7,
        centeredSlides: false,
        spaceBetween: 10,
        grabCursor: true,
        mousewheel: true,
    });
});