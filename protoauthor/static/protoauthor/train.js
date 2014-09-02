// DJANGO hack to be able to post with CSRF
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getState(){
    state = [];
    console.log($('#droppable').children());
    $('#droppable').children().each(function(idx, val){
        left = $(val).css('left');
        var item = {}
        item['left'] = $(val).css('left');
        item['top'] = $(val).css('top');
        item['width'] = $(val).css('width');
        item['height'] = $(val).css('height');
        if ($(val).find('span').length != 0){
            item['type'] = "Label";
        }
        else if ($(val).find('input').length != 0){
            item['type'] = "input";
        }
        else if ($(val).find('button').length != 0){
            item['type'] = "button";
        }
        
        console.log(val);
        console.log(item);

    });
}

$(function () {
    // BEGIN DJANGO AJAX
    // Call the functions for the DJANGO, so you can do AJAX
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    // END DJANGO AJAX

    getState();
    $('input').change(function(evt){
        console.log($(this).parent().attr('widget-id') + ", change, " + $(this).val());
        if ($(this).val() == "42"){
            //$(this).prop('disabled', true);

            $(this).val("CORRECT");

        }
    });
    $('button').click(function(){
        console.log($(this).parent().attr('widget-id') + ", click, " + $(this).val());
    });
});

