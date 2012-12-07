var othello = function() {};

//$(window).load(function() {
var abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
	for (var c in abc) {
		c = parseInt(c);
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
				for (var i = (r - 1); i > 1; i--) {
					var possibleMove = [];
					for (var o = (c + 1); o < 7; o++) {
						if (getColor(abc[c] + i) === enemy) {
							possibleMove.push(abc[c] + i);
						}
						else if (getColor(abc[c] + i) === color) {
							if (possibleMove.length) {
								moves[abc[c] + r].push(possibleMove);
							}
							break;
						}
						else {
							break;
						}
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
				for (var i = (r + 1); i < 8; i++) {
					var possibleMove = [];
					for (var o = (c + 1); o < 7; o++) {
						if (getColor(abc[c] + i) === enemy) {
							possibleMove.push(abc[c] + i);
						}
						else if (getColor(abc[c] + i) === color) {
							if (possibleMove.length) {
								moves[abc[c] + r].push(possibleMove);
							}
							break;
						}
						else {
							break;
						}
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
				for (var i = (r + 1); i < 8; i++) {
					var possibleMove = [];
					for (var o = (c - 1); o > 0; o--) {
						if (getColor(abc[c] + i) === enemy) {
							possibleMove.push(abc[c] + i);
						}
						else if (getColor(abc[c] + i) === color) {
							if (possibleMove.length) {
								moves[abc[c] + r].push(possibleMove);
							}
							break;
						}
						else {
							break;
						}
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
				for (var i = (r - 1); i > 1; i--) {
					var possibleMove = [];
					for (var o = (c - 1); o > 0; o--) {
						if (getColor(abc[c] + i) === enemy) {
							possibleMove.push(abc[c] + i);
						}
						else if (getColor(abc[c] + i) === color) {
							if (possibleMove.length) {
								moves[abc[c] + r].push(possibleMove);
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
	}
	// Clean up
	for (var i in moves) {
		if (!moves[i].length) {
			delete moves[i];
		}
	}
	return moves;
}

// Highlight possible moves
function highlightMoves(color) {
	var moves = getMoves(color);
	for (var i in moves) {
		$('#' + i).html('&#8226;');
		if (color === 'black') {
			$('#' + i).css('color', '#000');
		}
		else {
			$('#' + i).css('color', '#FFF');
		}
	}
}

// Start a new game	
othello.newGame = function() {
	takeSquare('d5', 'black');
	takeSquare('e4', 'black');
	takeSquare('e5', 'white');
	takeSquare('d4', 'white');
	highlightMoves('black');
}

othello.newGame();

//});