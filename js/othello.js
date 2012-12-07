var othello = function() {};

//$(window).load(function() {
var abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var turn = 'black';

// Start a new game	
othello.newGame = function() {
	takeSquare('d5', 'black');
	takeSquare('e4', 'black');
	takeSquare('e5', 'white');
	takeSquare('d4', 'white');
	highlightMoves('black');
}

// Take square with color
function takeSquare(square, color) {
	$('#' + square).html(
		$('<img />',{
			'class': color,
			'src': 'img/' + color + '.png'
		})
	);
}

// Get the opposite of color
function getOpposite(color) {
	if (color === 'black') {
		return 'white';
	}
	return 'black';
}

// Get a square's current color
function getColor(square) {
	if ($('#' + square).html().match('black')) {
		return 'black';
	}
	if ($('#' + square).html().match('white')) {
		return 'white';
	}
	return null;
}

// Get possible moves
function getMoves(color) {
	var moves = {};
	var enemy = getOpposite(color);
	for (var c = 0; c < abc.length; c++) {
		for (var r = 1; r < 8; r++) {
			if (getColor(abc[c] + r)) { continue }
			moves[abc[c] + r] = [];
			// Scan up
			if (r >= 3) {
				var possibleMove = [];
				for (var i = (r - 1); i > 1; i--) {
					if (getColor(abc[c] + i) === enemy) {
						possibleMove.push(abc[c] + i);
					}
					else if (getColor(abc[c] + i) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by up for' + (abc[c] + r));
						}
						break;
					}
					else {
						break;
					}
				}
			}
			// Scan up-right
			if ((r >= 3) && (c <= 5)) {
				var possibleMove = [];
				var o = c;
				for (var i = (r - 1); i > 1; i--) {
					o++;
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by up-right for' + (abc[c] + r));
						}
						break;
						}
					else {
						break;
					}
				}
			}
			// Scan right
			if (c <= 5) {
				var possibleMove = [];
				for (var o = (c + 1); o < 7; o++) {
					if (getColor(abc[o] + r) === enemy) {
						possibleMove.push(abc[o] + r);
					}
					else if (getColor(abc[o] + r) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by right for' + (abc[c] + r));
						}
						break;
					}
					else {
						break;
					}
				}
			}
			// Scan down-right
			if ((r <= 6) && (c <= 5)) {
				var possibleMove = [];
				var o = c;
				for (var i = (r + 1); i < 8; i++) {
					o++;
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by down-right for' + (abc[c] + r));
						}
						break;
						}
					else {
						break;
					}
				}

			}
			// Scan down
			if (r <= 6) {
				var possibleMove = [];
				for (var i = (r + 1); i < 8; i++) {
					if (getColor(abc[c] + i) === enemy) {
						possibleMove.push(abc[c] + i);
					}
					else if (getColor(abc[c] + i) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by down for' + (abc[c] + r));
						}
						break;
					}
					else {
						break;
					}
				}
			}
			// Scan down-left
			if ((r <= 6) && (c >= 2)) {
				var possibleMove = [];
				var o = c;
				for (var i = (r + 1); i < 8; i++) {
					o--;
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by down-left for' + (abc[c] + r));
						}
						break;
						}
					else {
						break;
					}
				}
			}
			// Scan left
			if (c >= 2) {
				var possibleMove = [];
				for (var o = (c - 1); o > 0; o--) {
					if (getColor(abc[o] + r) === enemy) {
						possibleMove.push(abc[o] + r);
					}
					else if (getColor(abc[o] + r) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by left for' + (abc[c] + r));
						}
						break;
					}
					else {
						break;
					}
				}
			}
			// Scan up-left
			if ((r >= 3) && (c >= 2)) {
				var possibleMove = [];
				var o = c;
				for (var i = (r - 1); i > 1; i--) {
					o--;
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
						if (possibleMove.length) {
							moves[abc[c] + r].push(possibleMove);
							console.log(possibleMove);
							console.log('added by up-left for' + (abc[c] + r));
						}
						break;
						}
					else {
						break;
					}
				}
			}
		}
	}
	// Clean up
	for (var i in moves) {
		if (!moves[i].length) {
			delete moves[i];
		}
	}
	console.log(moves);
	return moves;
}

// Highlight possible moves
function highlightMoves(color) {
	var moves = getMoves(color);
	$('.square').each(function(index) {
		$(this).css('cursor', 'auto');
		if (!getColor($(this).attr('id'))) {
			$(this).html('');
		}
	});
	for (var i in moves) {
		$('#' + i).html('&#8226;');
		if (color === 'black') {
			$('#' + i).css('color', '#000');
		}
		else {
			$('#' + i).css('color', '#FFF');
		}
		$('#' + i).css('cursor', 'pointer');
	}
}

// Flip discs with animation
// 'discs' must be getMoves(color)[square]
function flipDiscs(discs) {
	for (var i in discs) {
		for (var o in discs[i]) {
			var color = getColor(discs[i][o]);
			var opposite = getOpposite(color);
			$('#' + discs[i][o]).css('background-image', 'url("img/' + opposite + '.png")');
			$('#' + discs[i][o]).find('img').fadeOut(800, function() {
				$(this).attr('src', 'img/' + opposite + '.png');
				$(this).fadeIn(0);
				$('#' + discs[i][o]).css('background', '');
			});
		}
	}
}

// Handle a square being clicked (play a move)
$('.square').click(function() {
	if ($(this).css('cursor') !== 'pointer') {
		return false;
	}
	var square = $(this).attr('id');
	var discs = getMoves(turn)[square];
	takeSquare(square, turn);
	flipDiscs(discs);
	if (turn === 'black') {
		turn = 'white';
	}
	else {
		turn = 'black';
	}
	window.setTimeout(function() {
		highlightMoves(turn);
	}, 1000);
});

othello.newGame();

//});