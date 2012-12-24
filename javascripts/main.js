$(document).ready(function() {

	var sections = {};
	var one = {};
	var two = {};
	var three = {};
	var four = {};

	function navSetup() {
		$('#nav li').not('#info').click(function() {
			var nav_i = $(this).index();
			var section = $('section').eq(nav_i);
			var section_top = section.offset().top + 1;
			$('html,body').animate({
				scrollTop: section_top
			}, 400);
		});
	}
	navSetup();

	function oneSetup() {
		one.section = $('#section_one');
		one.main = $('#section_one .main_column');
		one.section_top = $('#section_one').offset().top;
		one.marker = $('#marker');
		one.marker_height = one.marker.outerHeight();
		one.inner_offset = $('#section_one .container').offset().left;
		one.section_padding = parseInt($('#section_one').css('padding-top'));
		one.main_height = $('#section_one .main_column').height();
		one.rail_top = $('.rail').offset().top;
		one.rail_left = $('.rail').offset().left;
		one.asterspace = 100;

		one.annotates = $('#section_one .annotate');
		one.annotate_length = one.annotates.length;
		one.note_cont = $('#section_one .notes');
		one.notes = $('#section_one .note');
		one.note_annos = $('#section_one .anno');
		one.anno_notes = $('#section_one .anno_note');

		// Set up rels
		one.annotates.each(function(i) {
			$(this).attr('rel',i);
		});
		one.note_annos.each(function(i) {
			$(this).attr('rel',i);
		});
		one.notes.each(function() {
			$(this).find('p, blockquote').last().addClass('last');
		});

		var note_spacer = 0;
		var pointer_spacer = 0;
		var pointer_total_spacer = 0;
		one.annotates.each(function(i) {
			var $annotate = $(this);
			var annotate_top = $annotate.position().top - one.section_padding;
			var $note = one.notes.eq(i);
			var note_height = $note.outerHeight();
			var note_top = annotate_top + note_spacer + one.section_padding;
			var pointer_top = annotate_top + pointer_spacer + one.section_padding;

			var inner_spacer = 0;
			$note.find('.anno').each(function(i) {
				var $anno = $(this);
				var rel = $anno.attr('rel');
				var $anno_note = one.anno_notes.eq(rel);
				var anno_rel_top = $anno.position().top;
				var anno_note_height = $anno_note.outerHeight();
				var anno_abs_top = anno_rel_top + note_top + pointer_total_spacer;
				inner_spacer = inner_spacer + anno_note_height - one.marker_height;
				pointer_total_spacer = pointer_total_spacer + inner_spacer;
				$anno_note.css('top',anno_rel_top).attr('rel-top',anno_rel_top);
				$('.rail').append('<div class="inner_pointer">');
				$('.rail .inner_pointer').last().css({ top: anno_abs_top, height: anno_note_height }).attr('spacer',pointer_total_spacer);
			});
			var pointer_height = note_height + inner_spacer;

			$note.css('top',note_top);
			$('.rail').append('<div class="pointer"></div>');

			note_spacer = note_spacer + note_height - one.marker_height;
			pointer_spacer = pointer_spacer + pointer_height - one.marker_height;

			$('.pointer').last().css({ top: pointer_top, height: pointer_height }).attr('spacer', pointer_spacer);

			if ( i == (one.annotate_length - 1) ) {
				$('.rail').append('<div class="pointer"></div><div class="inner_pointer">');
				$('.pointer').last().css('bottom', '37px');
				$('.inner_pointer').last().css('bottom', '37px');
			}
		});

		one.space = one.main_height + pointer_spacer;
		one.section.height(one.space);
		$('#section_one .notes_container').height(one.space);
		$('.rail').height(one.space);
		$('#section_one .notes').height(one.space);

		one.pointers = $('#section_one .pointer');
		one.pointer_length = one.pointers.length;
		one.pointerTopsArray = one.pointers.map(function() {
			return $(this).offset().top;
		}).get();

		one.inner_pointers = $('#section_one .inner_pointer');
		one.inner_pointer_length = one.inner_pointers.length;
		one.innerPointerTopsArray = one.inner_pointers.map(function() {
			return $(this).offset().top;
		}).get();

		$('#section_one').addClass('set_up');

		one.removeActive = function() {
			one.annotates.removeClass('active');
			one.notes.removeClass('active');
			one.pointers.removeClass('active');
			one.marker.removeClass('active');
		}

		one.setActive = function(rel) {
			var $annotate = one.annotates.eq(rel);
			var $note = one.notes.eq(rel);
			var $pointer = one.pointers.eq(rel);

			$annotate.addClass('active');
			$note.addClass('active');
			$pointer.addClass('active');
			one.marker.addClass('active');
		}

		one.removeInnerActive = function() {
			one.note_annos.removeClass('active');
			one.anno_notes.removeClass('active');
			one.inner_pointers.removeClass('active');
			one.marker.removeClass('inner_active');
		}

		one.setInnerActive = function(rel) {
			var $note = one.note_annos.eq(rel);
			var $anno = one.anno_notes.eq(rel);
			var $pointer = one.inner_pointers.eq(rel);

			$anno.addClass('active');
			$note.addClass('active');
			$pointer.addClass('active');
			one.marker.addClass('inner_active');
		}

		one.setScrolled = function() {
			var penult = one.pointer_length - 2;
			var $penult = one.pointers.eq(penult);
			var penult_spacer = parseInt($penult.attr('spacer'));
			var inner_penult = one.inner_pointer_length - 2;
			var $inner_penult = one.inner_pointers.eq(inner_penult);
			var inner_penult_spacer = parseInt($inner_penult.attr('spacer'));

			one.removeActive();
			$('#section_one .main_column').css({
				'position' : 'absolute',
				'left' : 0,
				'top' : penult_spacer
			});
			one.removeInnerActive();
			one.marker.addClass('bottom').attr('style','');
		}

		one.resize = function() {
			one.inner_offset = $('#section_one .container').offset().left;
			one.rail_left = $('.rail').offset().left;
			if ( one.marker.hasClass('pinned') ) {
				one.marker.css('left',one.rail_left);
			}
		}
	}
	oneSetup();

	function twoSetup() {
		$('#section_two .annotate').each(function(i) {
			var $note = $('#section_two .note').eq(i);
			var rel = i;
			$(this).attr('rel',i);

			// Find out if anno note needs a spacer after it
			var $anno_notes = $note.find('.anno_note');
			$anno_notes.each(function() {
				var note_text = $note.text();
				var anno_note_text = $(this).text();
				var anno_note_length = anno_note_text.length;
				var index_of = note_text.indexOf(anno_note_text);
				var end_of = index_of + anno_note_length;
				var right_after = note_text.slice(end_of,end_of + 1);
				$(this).addClass('wtf');
				$(this).prepend('<span class="spacer">&nbsp;</span>');
				if (right_after == " ") {
					$(this).append('<span class="end_spacer">&nbsp;</span>')
				}
			});

			var note_content = $note.html();
			var marked_up = '<span class="annotation_container" rel="' + rel + '"><span class="spacer">&nbsp;</span><span class="annotation">' + note_content + '</span></span>';
			$(this).after(marked_up);
		});
		$('#section_two .anno').each(function(i) {
			$(this).attr('rel',i);
		});

		$('#section_two .annotate').click(function() {
			var rel = $(this).attr('rel');
			$('#section_two .annotation_container').eq(rel).toggleClass('active');
			sectionsSetup();
		});
		$('#section_two .anno').click(function() {
			var rel = $(this).attr('rel');
			$('#section_two .anno_note').eq(rel).toggleClass('active');
			sectionsSetup();
		});

		$('#all_link').click(function() {
			if ( $(this).hasClass('expanded') ) {
				$('#section_two .annotation_container').removeClass('active');
				$('#section_two .anno_note').removeClass('active');
				$(this).removeClass('expanded').text('expand all');
			} else {
				$('#section_two .annotation_container').addClass('active');
				$('#section_two .anno_note').addClass('active');
				$(this).addClass('expanded').text('collapse all');
			}
			sectionsSetup();
		});
	}
	twoSetup();

	function threeSetup() {
		var section_offset = $('#section_three').offset().top;
		var section_height = $('#section_three').outerHeight();
		var side_offset = $('#section_three .main_column').offset().left;
		var $notes = $('#section_three .note');

		$('#lineCanvas').attr('height', section_height);
		$('#lineCanvas').attr('width', $(window).width());

		var canvas = document.getElementById('lineCanvas');
		paper.setup(canvas);

		var note_paths = [];
		var anno_paths = [];
		$('#section_three .annotate').each( function(i) {
			var rel = i;
			$(this).attr('rel', rel);
			var content = $(this).html();
			var marked_up = '<span class="content">' + content + '</span><span class="dot"></span>';
			$(this).html(marked_up);
			var $dot = $(this).find('.dot');

			var $note = $notes.eq(i);
			$note.attr('rel',i);
			$note.append('<div class="note_dot"></div>');

			var $anno_notes = $note.find('.anno_note');
			var $note_dot = $note.find('.note_dot');
			var note_width = $note.outerWidth();
			var note_height = $note.outerHeight();
			var anno_top = $(this).offset().top + 50 - section_offset;
			var $anno_dot = $(this).find('.dot');
			var anno_left = Math.random() * ( $(window).width() - note_width );
			if ( (anno_top + note_height) > section_height ) {
				anno_top = section_height - note_height;
			}
			$note.css({
				'top': anno_top,
				'left': anno_left
			});

			if ( $anno_notes.length > 0 ) {
				$note.addClass('contains');
			}

			var dot_left = $dot.offset().left + 4;
			var dot_top = $dot.offset().top - section_offset + 3;

			var note_dot_left = $note_dot.offset().left + 4;
			var note_dot_top = $note_dot.offset().top - section_offset + 3;

			var line = new paper.Path();
			line.style.strokeColor = 'black';
			line.style.strokeWidth = 3;
			var start_point = new paper.Point(dot_left,dot_top);
			var end_point = new paper.Point(note_dot_left,note_dot_top);
			line.add(start_point);
			line.add(end_point);
			note_paths.push(line);

			var $annos = $note.find('.anno');
			if ( $annos.length > 0 ) {
				$annos.each( function(i) {
					var $anno = $(this);
					$anno.attr('rel',i);
					var content = $(this).html();
					var marked_up = '<span class="content">' + content + '</span><span class="dot"></span>';
					$anno.html(marked_up);
					var $anno_dot = $anno.find('.dot');
					var anno_top = $anno.position().top + 3;
					$anno_dot.css('top',anno_top);
					var $anno_note = $anno_notes.eq(i);
					$anno_note.attr('parent-rel',rel).attr('rel',i);
					$anno_note.append('<div class="note_dot"></div>');
					var anno_note_width = $anno_note.outerWidth();
					$anno_note.remove();
					$note.after($anno_note);
					var anno_note_top = $(this).offset().top - section_offset;
					var anno_note_left = Math.random() * ($(window).width() - anno_note_width);
					$anno_note.css({
						'top': anno_note_top,
						'left': anno_note_left
					});

					var $source_dot = $anno.find('.dot');

					var dot_left = $source_dot.offset().left + 4;
					var dot_top = $source_dot.offset().top - section_offset + 3;

					var $anno_note_dot = $anno_note.find('.note_dot');
					var note_dot_left = $anno_note_dot.offset().left + 4;
					var note_dot_top = $anno_note_dot.offset().top - section_offset + 3;

					var inner_line = new paper.Path();
					inner_line.style.strokeColor = 'black';
					inner_line.style.strokeWidth = 3;
					var start_point = new paper.Point(dot_left,dot_top);
					var end_point = new paper.Point(note_dot_left,note_dot_top);
					inner_line.add(start_point);
					inner_line.add(end_point);
					anno_paths.push(inner_line);

					$anno_note.draggable({
						containment: '#section_three',
						drag: function() {
							adjustInnerLine($anno_note);
						},
						stop: function() {
							adjustInnerLine($anno_note);
						}
					});

				});
			}

			$note.draggable({
				containment: '#section_three',
				drag: function() {
					adjustLine($note);
				},
				stop: function() {
					adjustLine($note);
				}
			});

			paper.view.draw();
		});

		function adjustInnerLine(anno_note) {
			var section_offset = $('#section_three').offset().top;
			var $all_anno_notes = $('#section_three .anno_note');
			var $anno_note = anno_note;
			var $anno_note_dot = $anno_note.find('.note_dot');

			var index = $all_anno_notes.index($anno_note);

			note_dot_left = $anno_note_dot.offset().left + 4;
			note_dot_top = $anno_note_dot.offset().top - section_offset + 3;

			var inner_line = anno_paths[index];
			var segment_end = inner_line.segments[1];

			segment_end.point.x = note_dot_left;
			segment_end.point.y = note_dot_top;

			paper.view.draw();
		}

		function adjustLine(note) {
			var section_offset = $('#section_three').offset().top;
			var $note = note;
			var rel = $note.attr('rel');
			var $note_dot = $note.find('.note_dot');
			var $annotate = $('#section_three .annotate').eq(rel);
			var $dot = $annotate.find('.dot');
			var line = note_paths[rel];

			var dot_left = $dot.offset().left + 4;
			var dot_top = $dot.offset().top - section_offset + 3;

			var segment_start = line.segments[0];

			segment_start.point.x = dot_left;
			segment_start.point.y = dot_top;

			var note_dot_left = $note_dot.offset().left + 4;
			var note_dot_top = $note_dot.offset().top - section_offset + 3;

			var segment_end = line.segments[1];

			segment_end.point.x = note_dot_left;
			segment_end.point.y = note_dot_top;

			var $total_annos = $('#section_three .anno');
			var $annos = $note.find('.anno');

			if ( $annos.length > 0 ) {
				$annos.each( function(i) {
					var $anno = $(this);
					var $source_dot = $(this).find('.dot');

					var dot_top = $source_dot.offset().top - section_offset + 3;
					var dot_left = $source_dot.offset().left + 4;
					var index = $total_annos.index($anno);

					var thisPath = anno_paths[index];
					var segment_start = thisPath.segments[0];

					segment_start.point.x = dot_left;
					segment_start.point.y = dot_top;
				});
			}

			paper.view.draw();
		}



		var z_incr = 9
		$('#section_three .note').mouseenter( function() {
			$(this).css('z-index', z_incr);
			z_incr = z_incr + 1;
		});
		$('#section_three .anno_note').mouseenter( function() {
			 $(this).css('z-index', z_incr);
			 z_incr = z_incr + 1;
		});

		three.resize = function() {
			var breathing_room = 5;
			var window_width = $(window).width();
			var $notes = $('#section_three .note');
			$notes.each( function() {
				var $note = $(this);
				var note_left = $note.offset().left;
				var note_width = $note.outerWidth();
				if ( (note_width + note_left + breathing_room) > window_width ) {
					var adjust_left = window_width - note_width - breathing_room;
					$note.css('left', adjust_left);
				}
				adjustLine($note);
			});
			var $anno_notes = $('#section_three .anno_note');
			$anno_notes.each( function() {
				var $anno_note = $(this);
				var anno_note_left = $anno_note.offset().left;
				var anno_note_width = $anno_note.outerWidth();
				if ( (anno_note_left + anno_note_width + breathing_room) > window_width ) {
					var adjust_left = window_width - anno_note_width - breathing_room;
					$anno_note.css('left', adjust_left);
				}
				adjustInnerLine($anno_note);
			});
		}

	}
	threeSetup();

	function fourSetup() {
		$('#section_four .main_column p').each(function() {
			$(this).after('<hr>');
		});

		var $notes_cont = $('#section_four .notes');
		var $notes_meat = $notes_cont.html();
		$notes_cont.remove();
		$('#section_four .inner_container').prepend($notes_meat);
		var $notes = $('#section_four .note');
		$notes.each( function() {
			$(this).before('<div class="note_spacer"></div>');
			$(this).find('p').not('.anno_note p').first().prepend('<span class="decorator">*</span> ');
		});

		var $anno_notes = $('#section_four .anno_note');
		if ( $anno_notes.length > 0 ) {
			$anno_notes.each( function() {
				$(this).before('<div class="anno_note_spacer"></div>');
				$(this).find('p').not('.anno_anno_note p').first().prepend('<span class="decorator">*</span> ');
			});
		}

		var $anno_anno_notes = $('#section_four .anno_anno_note');
		if ( $anno_anno_notes.length > 0 ) {
			$anno_anno_notes.each( function() {
				$(this).before('<div class="anno_anno_note_spacer"></div>');
				$(this).find('p').first().prepend('<span class="decorator">*</span> ');
			});
		}

		var left_top = 0;
		var left_space = 0;
		var right_top = 0;
		var right_space = 0;
		var prev = "none";
		$('#section_four .annotate').each(function(i) {
			var $annotate = $(this);
			var new_top = $annotate.position().top;
			var $note = $notes.eq(i);

			var $annos = $note.find('.anno');
			if ( $annos.length > 0 ) {
				var spaced = 0;
				$annos.each( function(i) {
					var $anno = $(this);
					var $anno_note_spacers = $note.find('.anno_note_spacer');
					var new_top = parseInt($(this).position().top);
					var $anno_note = $note.find('.anno_note').eq(i);
					var anno_note_height = $anno_note.outerHeight();
					var adjusted_top = new_top - spaced;
					var $spacer = $anno_note_spacers.eq(i);
					$spacer.css('height', adjusted_top);
					spaced = new_top + anno_note_height;
					$anno_note.addClass('positioned');

					$anno.mouseenter( function() {
						$(this).addClass('active');
						$anno_note.addClass('active');
					});
					$anno.mouseleave( function() {
						$(this).removeClass('active');
						$anno_note.removeClass('active');
					});

					$anno_note.mouseenter( function() {
						$(this).addClass('active');
						$anno.addClass('active');
					});
					$anno_note.mouseleave( function() {
						$(this).removeClass('active');
						$anno.removeClass('active');
					});
				});
			}

			var $anno_annos = $note.find('.anno_anno');
			if ( $annos.length > 0 ) {
				$anno_annos.each( function(i) {
					var $anno_anno = $(this);
					var $anno_anno_note_spacers = $note.find('.anno_anno_note_spacer');
					var new_top = $(this).position().top;
					var $anno_anno_note = $anno_anno_notes.eq(i);
					var $spacer = $anno_anno_note_spacers.eq(i);
					$spacer.css('height', new_top);
					$anno_anno_note.addClass('positioned');

					$anno_anno.mouseenter( function() {
						$(this).addClass('active');
						$anno_anno_note.addClass('active');
					});
					$anno_anno.mouseleave( function() {
						$(this).removeClass('active');
						$anno_anno_note.removeClass('active');
					});

					$anno_anno_note.mouseenter( function() {
						$(this).addClass('active');
						$anno_anno.addClass('active');
					});
					$anno_anno_note.mouseleave( function() {
						$(this).removeClass('active');
						$anno_anno.removeClass('active');
					});
				});
			}

			var note_height = $note.outerHeight();

			$annotate.mouseenter( function() {
				$(this).addClass('active');
				$note.addClass('active');
			});
			$annotate.mouseleave( function() {
				$(this).removeClass('active');
				$note.removeClass('active');
			});

			$note.mouseenter( function() {
				$(this).addClass('active');
				$annotate.addClass('active');
			});
			$note.mouseleave( function() {
				$(this).removeClass('active');
				$annotate.removeClass('active');
			});

			var $spacer = $('.note_spacer').eq(i);

			var adjusted_space = 0;

			if ( new_top > right_space ) {
				adjusted_space = new_top - right_space;
				right_space = new_top + note_height;
				right_top = new_top;
				prev = "left";
			} else {
				if ( new_top < left_space ) {
					adjusted_space = 0;
					if ( right_space > left_space ) {
						$spacer.addClass('clear_left');
						$note.addClass('shift_left');
						left_top = left_space;
						left_space = left_space + note_height;
						prev = "left";
					} else {
						right_top = right_space;
						right_space = right_space + note_height;
						prev = "right";
					}
				} else {
					$spacer.addClass('clear_left');
					$note.addClass('shift_left');
					if ( prev == "left" ) {
						if ( right_top > left_space ) {
							adjusted_space = new_top - right_top;
						} else {
							adjusted_space = new_top - left_space;
						}
					} else {
						adjusted_space = new_top - left_space;
					}
					left_space = new_top + note_height;
					left_top = new_top;
					prev = "left";
				}
			}

			$spacer.height(adjusted_space);
			$note.addClass('positioned');
		});
	}
	fourSetup();

	function footerSetup() {
		$('#top_link').click(function() {
			$('html,body').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	}
	footerSetup();

	function aboutTriggers() {
		$('#info_top, #more_info, #info').click( function() {
			var $about = $('#about_container');
			$('body').addClass('about');
			if ( ! $about.hasClass('set_up') ) {
				aboutSetup();
				$about.addClass('set_up');
			}
			var about_offset = $about.offset().top;
			var scroll_top = $(window).scrollTop();
			section_i = getCurrent(scroll_top, sections.sectionTopsArray, sections.section_length);
			if ( section_i == null ) {
				var header_top = 0;
			} else {
				var $headers = $('#about_container h2');
				var $header = $headers.eq(section_i);
				var header_top = $header.position().top;
			}
			$about.scrollTop(header_top);
			return false;
		});
		$('#about_back, #text_close_about').click( function() {
			$('body').removeClass('about');
		});
	}
	aboutTriggers();

	function aboutSetup() {
		var $about = $('#about_container');
		var note_width = 350;
		$about.find('.annotate').each( function(i) {
			var $annotate = $(this);
			var about_offset = $about.offset().top;
			var anno_top = $annotate.offset().top - about_offset;
			var anno_height = $annotate.outerHeight();
			var anno_bottom = anno_top + anno_height;
			var inner_width = $about.find('#about').width();
			var about_offset = $about.find('#about').offset().left;
			var mid = (inner_width/2) + about_offset;
			var anno_left = $annotate.offset().left;
			if ( anno_left > mid ) {
				anno_left = (about_offset + inner_width - note_width);
			}
			var $note = $about.find('.note').eq(i);
			$note.css({
				position: 'absolute',
				top: anno_bottom,
				left: anno_left
			});
			$annotate.mouseenter(function() {
				$annotate.addClass('hover');
				$note.addClass('hover');
			});
			$note.mouseenter(function() {
				$annotate.addClass('active');
				$note.addClass('active');
			});
			$annotate.mouseleave(function() {
				$note.removeClass('hover');
				if ( ! $annotate.hasClass('active') ) {
					$annotate.removeClass('hover');
				}
			});
			$note.mouseleave(function() {
				$annotate.removeClass('hover');
				$note.removeClass('hover');
				$annotate.removeClass('active');
				$note.removeClass('active');
			});
		});
		$about.find('.anno').each( function(i) {
			var $anno = $(this);
			var $anno_note = $about.find('.anno_note').eq(i);
			$anno.mouseenter(function() {
				$anno.addClass('hover');
				var anno_top = $anno.position().top;
				var anno_left = $anno.position().left;
				var anno_height = $anno.outerHeight();
				var anno_bottom = anno_top + anno_height;
				$anno_note.css({
					top: anno_bottom
				});
				$anno_note.addClass('hover');
			});
			$anno_note.mouseenter(function() {
				$anno.addClass('active');
				$anno_note.addClass('active');
			});
			$anno.mouseleave(function() {
				$anno_note.removeClass('hover');
				if ( ! $anno.hasClass('active') ) {
					$anno.removeClass('hover');
				}
			});
			$anno_note.mouseleave(function() {
				$anno.removeClass('hover');
				$anno_note.removeClass('hover');
				$anno.removeClass('active');
				$anno_note.removeClass('active');
			});
		});
	}

	function sectionsSetup() {
		sections.sections = $('section');
		sections.section_length = sections.sections.length;
		sections.sectionTopsArray = sections.sections.map(function() {
			return $(this).offset().top;
		}).get();
	}
	sectionsSetup();

	var getCurrent = function( top, topsArray, len ) { 
	    for ( var i = 0; i < len; i++ ) {
	        if ( top >= topsArray[i] && topsArray[i+1] && top < topsArray[i+1] ) {
	            return i;
	        }
	    }
	};

	$(window).scroll(function() {
		var scroll_top = $(window).scrollTop();

		sections.setProgress = function(section_i) {
			$('#nav_container').addClass('scrollin');
			var $section = $('section').eq(section_i);
			var section_offset = $section.offset().top;
			var section_height = $section.outerHeight();
			var section_progress = (scroll_top - section_offset)/section_height;
			var progress = section_progress * 40;
			var $li = $('#nav li').eq(section_i);
			if ( ! $li.hasClass('active') ) {
				$('#nav li').removeClass('active');
				$li.addClass('active');
			}
			var passed = $('#nav li').slice(0,section_i);
			passed.each( function() {
				$(this).children('.progress_block').height(40);
			});
			var li_length = $('#nav li').length;
			var future = $('#nav li').slice(section_i,li_length);
			future.each( function() {
				$(this).children('.progress_block').height(0);
			})
			$li.children('.progress_block').height(progress);
		}

		function clearProgress() {
			$('#nav_container').removeClass('scrollin').children('li').removeClass('active').children('.progress_block').height(0);
		}

		// Marker check
		if ( scroll_top > (one.rail_top - 90) ) {
			if ( ! one.marker.hasClass('pinned') ) {
				one.marker.addClass('pinned').css('left', one.rail_left);
			}
		} else {
			if ( one.marker.hasClass('pinned') ) {
				one.marker.removeClass('pinned').attr('style','');
			}
		}

		section_i = getCurrent(scroll_top, sections.sectionTopsArray, sections.section_length);

		// Header
		if (section_i == null) {

			clearProgress();

			// Make sure Section One does not stick coming up
			one.removeActive();
			one.main.css({
				'position' : 'absolute',
				'left' : 0,
				'top' : 0
			});
			one.removeInnerActive();
			one.note_cont.css({
				position: 'absolute',
				right: 0,
				top: 0
			});

		}

		// Section One
		if (section_i == 0) {

			sections.setProgress(section_i);

			var check_top = scroll_top + one.asterspace;
			var marker_check = check_top + one.marker_height;

			// Get active note
			var note_i = getCurrent(check_top, one.pointerTopsArray, one.pointer_length);
			if ( note_i != null ) {
				var $note = one.notes.eq(note_i);
				var $pointer = one.pointers.eq(note_i);
				var pointer_top = $pointer.offset().top;
				var pointer_end = pointer_top + $pointer.height();
				var $annotate = one.annotates.eq(note_i);
				var annotate_rel_top = $annotate.position().top;
				var main_adjust = annotate_rel_top - one.asterspace;
				var spacer = parseInt($pointer.attr('spacer'));

				one.marker.removeClass('bottom');

				if ( marker_check <= pointer_end ) {
					if ( ! $note.hasClass('active') ) {
						one.removeActive();
						one.setActive(note_i);
						one.main.css({
							'position' : 'fixed',
							'left' : one.inner_offset,
							'top' : - main_adjust
						})
					}
				} else {
					one.removeActive();
					one.main.css({
						'position' : 'absolute',
						'left' : 0,
						'top' : spacer
					});
				}
			} else {
				one.removeActive();

				if ( scroll_top > 2000 ) {
					one.setScrolled();
				} else {
					one.main.css({
						'position' : 'absolute',
						'left' : 0,
						'top' : 0
					});					
				}

			}

			// Get active inner note
			var inner_i = getCurrent(check_top, one.innerPointerTopsArray, one.inner_pointer_length);
			if ( inner_i != null ) {
				var $note = one.anno_notes.eq(inner_i);
				var $pointer = one.inner_pointers.eq(inner_i);
				var pointer_top = $pointer.offset().top;
				var pointer_end = pointer_top + $pointer.height();
				var $anno = one.note_annos.eq(inner_i);
				var annotate_rel_top = $anno.position().top;
				var note_height = $note.outerHeight();
				var note_parent_top = $anno.parents('.note').position().top;
				var fix_top = annotate_rel_top + note_parent_top - one.asterspace;
				var spacer = parseInt($pointer.attr('spacer'));
				var rel_top = parseInt($note.attr('rel-top'));
				var top_adjust = rel_top + (pointer_top - check_top);
				var final_top = rel_top + one.marker_height - note_height;

				if ( marker_check < pointer_end ) {
					if ( ! $note.hasClass('active') ) {
						one.removeInnerActive();
						one.setInnerActive(inner_i);
						one.note_cont.css({
							position: 'fixed',
							right: one.inner_offset,
							top: - fix_top
						});
					}
					$note.css('top',top_adjust);
				} else {
					one.removeInnerActive();
					one.note_cont.css({
						position: 'absolute',
						right: 0,
						top: spacer
					});
					$note.css('top',final_top);
				}
			} else {
				one.removeInnerActive();
				one.anno_notes.each( function() {
					var rel_top = parseInt($(this).attr('rel-top'));
					$(this).css('top',rel_top);
				});
				one.note_cont.css({
					position: 'absolute',
					right: 0,
					top: 0
				});
			}
		}

		if (section_i == 1) {
			sections.setProgress(section_i);

			one.removeActive();
			one.setScrolled();
		}

		if (section_i == 2) {
			sections.setProgress(section_i);

			one.removeActive();
			one.setScrolled();
		}

		if (section_i == 3) {
			sections.setProgress(section_i);

			one.removeActive();
			one.setScrolled();

			if ( (scroll_top + $(window).height()) >= $(document).height() ) {
				$('#nav li').not('#info').last().children('.progress_block').height(40);
			}
		}

	});

	$(window).resize( function() {
		$('#lineCanvas').attr('width', $(window).width());
		one.removeActive();
		one.resize();
		$(window).trigger('scroll');
		three.resize();
	});

});