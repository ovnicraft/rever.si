var othello = function() {};

$(window).load(function() {

function black(square) {
	$('<img />',{
		'class': 'black',
		'src': 'img/black.png'
	}).appendTo('#' + square);
}

function white(square) {
	$('<img />',{
		'class': 'white',
		'src': 'img/white.png'
	}).appendTo('#' + square);
}
	
othello.newGame = function() {
	black('d5');
	black('e4');
	white('e5');
	white('d4');
}

othello.newGame();
	
});