var othello = function() {};

$(window).load(function() {

function black(square) {
	$('#' + square).html(
		$('<img />',{
			'class': 'black',
			'src': 'img/black.png'
		})
	);
}

function white(square) {
	$('#' + square).html(
		$('<img />',{
			'class': 'white',
			'src': 'img/white.png'
		})
	);
}
	
othello.newGame = function() {
	black('d5');
	black('e4');
	white('e5');
	white('d4');
}

othello.newGame();

});