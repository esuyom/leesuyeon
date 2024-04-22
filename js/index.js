$(document).ready(function(){
    // 이미지 로딩
    $('#work').imagesLoaded().done( function( instance ) {
        console.log('이미지 로딩 완료');
    });

    // 마우스 커서
    $(window).mousemove(function (e) {
        $(".ring").css(
            "transform",
            `translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
        );
    });
    
    $("#wrap.main #main .wall .txt2").hover(function(){
        $("#cursor").addClass("type1");
    }, function(){
        $("#cursor").removeClass("type1");
    });	

    
    

    // Profile
    $("#wrap.main #main .wall1 .profile").click(function(){
        $("#profile").addClass("active");
        $("#cursor").addClass("type2");
        gsap.fromTo("#profile .main-title", {x: -150}, {duration: 1.3, x: 150});
    });

    // Work
    var hoverInterval;

    $("#wrap.main #main .wall2 .work").click(function(){
        $("#work").addClass("active");
        $("#cursor").addClass("type2");
        gsap.fromTo("#work .main-title", {x: 150}, {duration: 1.3, x: -150});
    });

    $("#work .content .item").click(function(){
        if(!$(this).hasClass("active")){
            $("#work .content .item").removeClass("active");
            $("#work .content .item .txt").hide();
            $("#work .content .item .bg").animate({ scrollTop: 0 }, 1000);
            mySwiper.mousewheel.disable();
            $(this).addClass("active");
            checkInterval();
            setTimeout(() => {
                $(this).find(".txt").fadeIn();
            }, 500);
        }
    });

    function checkInterval(){
        hoverInterval = setInterval(() => {
            $("#work .content .item.active .bg").hover(function(){
                mySwiper.mousewheel.disable();
            }, function(){
                mySwiper.mousewheel.enable();
            });	
        }, 50);
        
    }

    $("section.side .close").click(function(){
        $("section.side").removeClass("active");
        $("#cursor").removeClass("type2");
        mySwiper.slideTo(0);
        $("#work .content .item").removeClass("active");
        clearInterval(hoverInterval);
    });

    //Swiper
    var mySwiper = new Swiper('.webSwiper', {
        slidesPerView:'auto',
        direction:"horizontal",
        centeredSlides: true,
        spaceBetween: 40,
        grabCursor: true,
        mousewheel: true,
        speed: 1000,
        keyboard: {
            enabled: true,
        },
        on: {
            click(event) { //클릭시 가운데 위치로
                mySwiper.slideTo(this.clickedIndex);	
            },
        },
    });
    

});
