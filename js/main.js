$(document).ready(function(){if("serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js"),$("#header > #nav > ul > .icon").click(function(){$("#header > #nav > ul").toggleClass("responsive")}),$(".post").length){var e=$("#menu"),o=$("#menu > #nav"),i=$("#menu-icon, #menu-icon-tablet");if(1440<=$(document).width()&&(e.css("visibility","visible"),i.addClass("active")),i.click(function(){return"hidden"===e.css("visibility")?(e.css("visibility","visible"),i.addClass("active")):(e.css("visibility","hidden"),i.removeClass("active")),!1}),e.length&&$(window).on("scroll",function(){var i=e.offset().top;!o.is(":visible")&&i<50?o.show():o.is(":visible")&&100<i&&o.hide(),!$("#menu-icon").is(":visible")&&i<50?($("#menu-icon-tablet").show(),$("#top-icon-tablet").hide()):!$("#menu-icon").is(":visible")&&100<i&&($("#menu-icon-tablet").hide(),$("#top-icon-tablet").show())}),$("#footer-post").length){var t=0;$(window).on("scroll",function(){var i=$(window).scrollTop();t<i?$("#footer-post").hide():$("#footer-post").show(),t=i,$("#nav-footer").hide(),$("#toc-footer").hide(),$("#share-footer").hide(),i<50?$("#actions-footer > #top").hide():100<i&&$("#actions-footer > #top").show()})}}});