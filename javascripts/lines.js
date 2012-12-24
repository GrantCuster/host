$(document).ready(function() {
    var paths =[];

    var section_offset = $('#section_three').offset().top;

    $('#section_three .annotate').each( function() {
        console.log('yea');
        var $annotate = $(this);
        var $dot = $annotate.find('.dot');

        var dot_top = $dot.offset().top - section_offset + 3;
        var dot_left = $dot.offset().left + 4;
        
        var an_index = $annotate.attr('rel');

        var $aside = $('.three_note').eq(an_index);
        var $aside_dot = $aside.find('.note_dot');
        var as_dot_top = $aside_dot.offset().top - section_offset + 3;
        var as_dot_left = $aside_dot.offset().left + 4;
        
        var myPath = new Path();
        myPath.style.strokeColor = 'black';
        myPath.style.strokeWidth = 3;
        var firstPoint = new Point(dot_left,dot_top);
        var secondPoint = new Point(as_dot_left,as_dot_top);
        myPath.add(firstPoint);
        myPath.add(secondPoint);

        $aside.mouseenter( function() {
            $annotate.addClass('active');
        });
        $aside.mouseleave( function() {
            $annotate.removeClass('active');
        });
    });
});