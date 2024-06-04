$(document).ready(function(){
    // $(window).on('resize', function(){
    //     window.location.reload();
    // });

    // 마우스 커서
    var w = $(window).outerWidth();  
    if (w > 1024) {
        $(window).mousemove(function (e) {
            $(".ring").css(
                "transform",
                `translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
            );
        });
    }


    $("#wrap #main .wall .txt2").hover(function(){
        $("#cursor").addClass("type1");
    }, function(){
        $("#cursor").removeClass("type1");
    });	

    // Profile
    $("#wrap #main .wall1 .profile").click(function(){
        $("#profile").addClass("active");
        $("#cursor").addClass("type2");
        gsap.fromTo("#profile .main-title", {x: -150}, {duration: 1.5, x: 150});
    });

    $("#profile .mail-icon").click(function(){
        if(!$("#profile .mail .form").hasClass("active")){
            $("#profile .mail .form").addClass("active");
            if (w > 1024) {
                gsap.fromTo("#profile .mail .form", {x: 0, opacity:0, display:'none'}, {duration: 0.6, x: -70, opacity:1, display:'block'});
            }else{
                gsap.fromTo("#profile .mail .form", {y: 0, opacity:0, display:'none'}, {duration: 0.6, y: -30, opacity:1, display:'block'});
            }
        }else{
            $("#profile .mail .form").removeClass("active");
            if (w > 1024) {
                gsap.fromTo("#profile .mail .form", {x: -70, opacity:1, display:'block'}, {duration: 0.6, x: 0, opacity:0,  display:'none'});
            }else{
                gsap.fromTo("#profile .mail .form", {y: -30, opacity:1, display:'block'}, {duration: 0.6, y: 0, opacity:0,  display:'none'});
            }
        }
    });

    $("#profile .mail .form .success .close").click(function(){
        $("#profile .mail .form").removeClass("active");
        $('input[name=submit]').removeClass("submit");
        if (w > 1024) {
            gsap.fromTo("#profile .mail .form", {x: -70, opacity:1, display:'block'}, {duration: 0.6, x: 0, opacity:0,  display:'none'});
        }else{
            gsap.fromTo("#profile .mail .form", {y: -30, opacity:1, display:'block'}, {duration: 0.6, y: 0, opacity:0,  display:'none'});
        }
        
        setTimeout(() => {
            $("#profile .mail .form form").show();
            $("#profile .mail .form .success").hide();
        }, 600);
    });

    // Work
    var hoverInterval;

    $("#wrap #main .wall2 .work").click(function(){
        $("#work").addClass("active");
        $("#cursor").addClass("type2");
        gsap.fromTo("#work .main-title", {x: 150}, {duration: 1.5, x: -150});
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

    function moveX(){
        var thisX = $(".webSwiper .swiper-wrapper")
        if(w > 1024){
            thisX.animate({left:-100+'px'});
        }
    }

    $("section.side>.close").click(function(){
        $("section.side").removeClass("active");
        $("#cursor").removeClass("type2");
        mySwiper.slideTo(0);
        $("#work .content .item").removeClass("active");
        clearInterval(hoverInterval);
    });


    
    //infoSwiper
    var swiper = new Swiper(".infoSwiper", {
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        grabCursor: false,
        allowTouchMove: false,
        speed: 1000,
    });

    //webSwiper
    var mySwiper = new Swiper('.webSwiper', {
        slidesPerView:'auto',  
        direction:"horizontal",
        slideToClickedSlide:true,
        centeredSlides: true,
        grabCursor: true,
        mousewheel: true,
        speed: 1000,
        keyboard: {
            enabled: true,
        },
        on: {
            slideChange : function() {
                moveX();
            },
        },
    });
    
});
