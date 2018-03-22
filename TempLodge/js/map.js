var currState = 'OK'
$('body').scrollspy({offset: $('#nav').outerHeight()+10, target: '#nav'})
$('body')
  .on('click', 'a', function(event) {
	var link = $(event.target);
	var toElement = $(link.attr('href'));
	if(toElement.length) {
	  var top = toElement.offset().top - $('#nav').outerHeight();
	  $('html, body').animate({scrollTop: top}, 1000);
	}
  });
  
	
$('#map').usmap({
  'stateStyles': {
	fill: "#4ECDC4",
	stroke: "#41A59B",
	"stroke-width": 1,
	"stroke-linejoin": "round",
	scale: [1, 1]
  },
  'stateHoverStyles': {
	fill: "#C7F464",
	stroke: "#ADCC56",
	scale: [1.1, 1.1]
  },
  'labelBackingStyles': {
	fill: "#4ECDC4",
	stroke: "#41A59B",
	"stroke-width": 1,
	"stroke-linejoin": "round",
	scale: [1, 1]
  },
  
  // The styles for the hover
  'labelBackingHoverStyles': {
	fill: "#C7F464",
	stroke: "#ADCC56",
  },
  'labelTextStyles': {
  fill: "#222",
	'stroke': 'none',
	'font-weight': 300,
	'stroke-width': 0,
	'font-size': '10px'
  },
  click: function(event, data) {
	currState = data.name;
	$('#clicked-state').text('You clicked: '+currState+' AND '+currGroup).parent().effect('highlight', {color: '#C7F464'}, 2000);
  }
});