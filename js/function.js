/*!
 *
 * Evgeniy Ivanov - 2021
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var app = {
    pageScroll: '',
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= app.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= app.mdWidth && $(window).width() < app.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= app.smWidth && $(window).width() < app.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < app.smWidth; } // < 768
function isIOS() { return app.iOS(); } // for iPhone iPad iPod
function isTouch() { return app.touchDevice(); } // for touch device


$(document).ready(function() {
    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	// Запрет "отскока" страницы при клике по пустой ссылке с href="#"
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    // Inputmask.js
    // $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });
    // formSubmit();

    checkOnResize();

});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (app.resized == windowWidth) { return; }
    app.resized = windowWidth;

	checkOnResize();
});

function checkOnResize() {
}

function openMobileNav() {
    $('.navbar__toggle').on('click', function() {
        let wrapp = $('.nav');

        $('body').toggleClass('nav__open');
        wrapp.toggleClass('open');
        $(this).toggleClass('active');
    });
}
openMobileNav();

// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
function srollToId() {
    $('[data-scroll-to]').click( function(){
        if ($('body').hasClass('nav__open')) {
            $('body').removeClass('nav__open');
            $('.nav').removeClass('open');
            $('.navbar__toggle').removeClass('active');
        }
        let scrolled = $(this).attr('href');
        if ($(scrolled).length != 0) {
            $('html, body').animate({ scrollTop: $(scrolled).offset().top }, 500);
        }
        return false;
    });
}
srollToId();

function toggleCollapse() {
    let toggle = $('.collapsed__name');
    toggle.on('click', function() {
        let item = $(this).closest('.collapsed__item');
        item.toggleClass('open');
        item.find('.collapsed__body').slideToggle();
    });
}
toggleCollapse();

// Видео youtube для страницы
function uploadYoutubeVideo() {
    if ($(".js-youtube")) {

        $(".js-youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            // создаем iframe со включенной опцией autoplay
            let wrapp = $(this).closest('.js-youtube'),
                videoId = wrapp.attr('id'),
                iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";

            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            let iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
                'allow': "autoplay"
            })

            // Заменяем миниатюру HTML5 плеером с YouTube
            $(this).closest('.video__wrapper').append(iframe);

        });
    }
}
uploadYoutubeVideo();

// Простая проверка форм на заполненность и отправка аяксом
function formSubmit() {
    $("[type=submit]").on('click', function (e){
        e.preventDefault();
        let form = $(this).closest('.form'),
            url = form.attr('action'),
            form_data = form.serialize(),
            field = form.find('[required]'),
            empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }
        });

        if (empty > 0) {
            return false;
        } else {
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    showMessage(response);
                    console.log(response);
                },
                error: function (response) {
                    showMessage(response);
                }
            });
        }

    });

    $('[required]').on('blur', function() {
        if ($(this).val() != '') {
            $(this).removeClass('invalid');
        }
    });

    function showMessage(text) {
        $('.modal.in').modal('hide');
        $('#modalRezult').find('.modal-body ').html(`<h3>${text}</h3>`);
        $('#modalRezult').modal('show');
    }
}

formSubmit();
