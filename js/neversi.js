// Neversi
// Copyright Nadim Kobeissi, all rights reserved

// Configuration
var domain = 'crypto.cat';
var conference = 'conference.crypto.cat';
var bosh = 'https://crypto.cat/http-bind';

var myNickname, gameState, inviting;
var loginCredentials = [];

var neversi = function() {};

//$(window).load(function() {
	
// -----------------------------------------------
// BOARD LOGIC
// -----------------------------------------------

var abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var turn = 'black';

// Start a new game	
neversi.newGame = function() {
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
			'src': 'img/' + color + '.png',
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
		for (var r = 1; r < 9; r++) {
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
				var possibleMove = [];
				var o = c;
				for (var i = (r - 1); i > 1; i--) {
					if (o < 8) { o++ }
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
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
			// Scan right
			if (c <= 5) {
				var possibleMove = [];
				for (var o = (c + 1); o < 8; o++) {
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
				var possibleMove = [];
				var o = c;
				for (var i = (r + 1); i < 8; i++) {
					if (o < 8) { o++ }
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
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
				var possibleMove = [];
				var o = c;
				for (var i = (r + 1); i < 8; i++) {
					if (o > 0) { o-- }
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
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
				var possibleMove = [];
				var o = c;
				for (var i = (r - 1); i > 1; i--) {
					if (o > 0) { o-- }
					if (getColor(abc[o] + i) === enemy) {
						possibleMove.push(abc[o] + i);
					}
					else if (getColor(abc[o] + i) === color) {
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
	// Clean up
	for (var i in moves) {
		if (!moves[i].length) {
			delete moves[i];
		}
	}
	return moves;
}

// Highlight possible moves
function highlightMoves(color, clearOnly) {
	var moves = getMoves(color);
	for (var i in moves) {
		$('#' + i).html('<span style="display: none">&#8226;</span>');
		if (color === 'black') {
			$('#' + i).css('color', '#000');
		}
		else {
			$('#' + i).css('color', '#FFF');
		}
		$('#' + i).css('cursor', 'pointer');
		$('#' + i).find('span').fadeIn('slow');
	}
}

// Clear highlighted moves
function clearHighlights() {
	$('.square').each(function(index) {
		$(this).css('cursor', 'auto');
		if (!getColor($(this).attr('id'))) {
			$(this).find('span').fadeOut('slow', function() {
				$(this).html('');
			});
		}
	});
}

// Flip discs with animation
// 'discs' must be getMoves(color)[square]
function flipDiscs(discs) {
	var highlight = null;;
	var t = 225;
	for (var i in discs) {
		$.each(discs[i], function(o, val) {
			var opposite = getOpposite(getColor(val));
			window.setTimeout(function() {
				$('#' + val).css('background-image', 'url("img/' + opposite + '.png")');
				$('#' + val).find('img').fadeOut(450, function() {
					takeSquare(val, opposite);
					$('#' + val).css('background-image', '');
				});
				if (!highlight) {
					highlight = window.setTimeout(function() {
						highlightMoves(turn);
					}, t + 225);
				}
			}, t);
			t += 225;
		});
	}
}

// Handle a square being clicked (play a move)
$('.square').click(function() {
	if ($(this).css('cursor') !== 'pointer') {
		return;
	}
	clearHighlights();
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
});

// -----------------------------------------------
// END BOARD LOGIC
// -----------------------------------------------

// -----------------------------------------------
// PLAYER UI LOGIC
// -----------------------------------------------

// Form logic for fields and buttons
$('input[type=text]').click(function() {
	$(this).select();
});
$('#play').mouseover(function() {
	$(this).animate({
		'background-color': '#FFF',
		'color': '#000'
	}, 'fast');
});
$('#play').mouseout(function() {
	$(this).animate({
		'background-color': '#000',
		'color': '#CCC'
	}, 'fast');
});

// Display a message in the message area
function showMessage(message) {
	$('#message').find('span').fadeOut('fast', function() {
		$(this).html(message);
		$(this).fadeIn('fast');
	});
}

// Handle getting an invitation
function getInvitation(player) {
	if (gameState !== 'inGame') {
		var invitation = '<strong>' + player + '</strong>'
			+ ' challenges you to a game. Accept?<br />'
			+ '<span class="choice" id="yes">yes</span> &nbsp;&nbsp;'
			+ '<span class="choice">no</span>'
		showMessage(invitation);
		// Delay necessary to avoid race condition
		window.setTimeout(function() {
			$('.choice').click(function() {
				if ($(this).attr('id') === 'yes') {
					sendMessage('accept', player);
					gameState = 'inGame';
				}
				else {
					sendMessage('decline', player);
					showMessage('You have declined the invitation.');
					gameState = 'lobby';
				}
			});
		}, 2000);
	}
	else {
		sendMessage('inGame', player);
	}
}

// Bind logout button
$('#logout').click(function() {
	logout();
});


// -----------------------------------------------
// END PLAYER UI LOGIC
// -----------------------------------------------

// -----------------------------------------------
// XMPP LOGIC
// -----------------------------------------------

// Generates a random string of length `size` characters.
// If `alpha = 1`, random string will contain alpha characters, and so on.
function randomString(size, alpha, uppercase, numeric) {
	var keyspace = result = '';
	if (alpha) { keyspace += 'abcdefghijklmnopqrstuvwxyz' }
	if (uppercase) { keyspace += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }
	if (numeric) { keyspace += '0123456789' }
	for (var i = 0; i !== size; i++) {
		result += keyspace[Math.floor(Math.random()*keyspace.length)];
	}
	return result;
}

// Send XMPP message to player
function sendMessage(message, player) {
	conn.muc.message('lobby@' + conference, player, message, null);
}

// Clean nickname so that it's safe to use.
function cleanNickname(nickname) {
	var clean;
	if (clean = nickname.match(/\/([\s\S]+)/)) {
		clean = Strophe.xmlescape(clean[1]);
	}
	else {
		return false;
	}
	if (clean.match(/\W/)) {
		return false;
	}
	return clean;
}

// Handle incoming messages from the XMPP server.
function handleMessage(message) {
	var nickname = cleanNickname($(message).attr('from'));
	var body = $(message).find('body').text().replace(/\&quot;/g, '"');
	var type = $(message).attr('type');
	// If archived message, ignore.
	if ($(message).find('delay').length !== 0) {
		return true;
	}
	// If message is from me, ignore.
	if (nickname === myNickname) {
		return true;
	}
	// Handle messages from other players
	if (type !== 'groupchat') {
		console.log(nickname + ': ' + body);
		if (body === 'invite') {
			getInvitation(nickname);
			gameState = 'invited';
		}
		else if (inviting === nickname) {
			if (body === 'accept') {
				
			}
			else if (body === 'decline') {
				showMessage('<strong>' + nickname + '</strong> has refused your invitation.');
				$('.player').mouseout();
				gameState = 'lobby';
				inviting = null;
			}
			else if (body === 'inGame') {
				showMessage('<strong>' + nickname + '</strong> is currently playing a game.');
				gameState = 'lobby';
				inviting = null;
			}
		}
	}
	return true;
}

// Handle incoming presence updates from the XMPP server.
function handlePresence(presence) {
	// console.log(presence);
	var nickname = cleanNickname($(presence).attr('from'));
	// If invalid nickname, do not process
	if ($(presence).attr('type') === 'error') {
		if ($(presence).find('error').attr('code') === '409') {
			logout();
			window.setTimeout(function() {
				showMessage('Nickname in use. Please choose another nickname.');
			}, 1000);
			return false;
		}
		return true;
	}
	// Ignore if presence status is coming from myself
	if (nickname === myNickname) {
		return true;
	}
	// Detect player going offline
	if ($(presence).attr('type') === 'unavailable') {
		$('#player-' + nickname).slideUp().remove();
	}
	// Create player element if player is new
	else if (!$('#player-' + nickname).length) {
		addPlayer(nickname);
	}
	// Handle player status change to 'available'
	if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
		
	}
	return true;
}

// Add new player to lobby
function addPlayer(nickname) {
	$('#lobby').queue(function() {
		var buddyTemplate = '<div class="player" title="' + nickname + '" id="player-' 
			+ nickname + '" status="online"><span>' + nickname + '</span></div>'
		$(buddyTemplate).appendTo('#lobby').slideDown(100, function() {
			$('#player-' + nickname).unbind('click');
			bindPlayerClick(nickname);
		});
	});
	$('#lobby').dequeue();
}

// Bind properties to player entry in lobby
function bindPlayerClick(player) {
	$('#player-' + player).mouseover(function() {
		if (gameState === 'lobby') {
			$(this).animate({
				'background-color': '#FFF',
				'color': '#000'
			}, 'fast');
		}
	});
	$('#player-' + player).mouseout(function() {
		if (gameState === 'lobby') {
			$(this).animate({
					'background-color': '#000',
					'color': '#FFF'
			}, 'fast');
		}
	});
	$('#player-' + player).click(function() {
		if (gameState == 'lobby') {
			gameState = 'inviting';	
			showMessage('Waiting for <strong>' + player + '</strong> to respond...');
			sendMessage('invite', player);
			inviting = player;
		}
	});
}

// Handle submission of login form
$('#login').submit(function() {
	// Don't submit if form is already being processed
	if (($('#play').attr('readonly') === 'readonly')) {
		return false;
	}
	$('#play').mouseover().mouseout();
	//Check validity of nickname and game ID
	$('#nickname').val($.trim($('#nickname').val()));
	if (($('#nickname').val() === '')
		|| ($('#nickname').val() === 'Your nickname')) {
		showMessage('Please enter a nickname.');
		$('#nickname').select();
	}
	else if (!$('#nickname').val().match(/^\w{1,16}$/)) {
		showMessage('Your nickname can only contain alphanumeric characters.');
		$('#nickname').select();
	}
	// If everything is okay, then register a randomly generated throwaway XMPP ID and log in.
	else {
		myNickname = Strophe.xmlescape($('#nickname').val().toLowerCase());
		loginCredentials[0] = randomString(64, 1, 1, 1);
		loginCredentials[1] = randomString(64, 1, 1, 1);
		registerXMPPUser(loginCredentials[0], loginCredentials[1]);
		$('#play').attr('readonly', 'readonly');
		showMessage('Connecting...');
	}
	return false;
});

// Registers a new user on the XMPP server.
function registerXMPPUser(username, password) {
	var registrationConnection = new Strophe.Connection(bosh);
	registrationConnection.register.connect(domain, function(status) {
		if (status === Strophe.Status.REGISTER) {
			registrationConnection.register.fields.username = username;
			registrationConnection.register.fields.password = password;
			registrationConnection.register.submit();
		}
		else if (status === Strophe.Status.REGISTERED) {
			registrationConnection.disconnect();
			delete registrationConnection;
			login(loginCredentials[0], loginCredentials[1]);
			return true;
		}
		else if (status === Strophe.Status.SBMTFAIL) {
			showMessage('Connection error.');
			$('#play').removeAttr('readonly');
			return false;
		}
	});
}

// Logs into the XMPP server, creating main connection/disconnection handlers.
function login(username, password) {
	conn = new Strophe.Connection(bosh);
	conn.connect(username + '@' + domain, password, function(status) {
		if (status === Strophe.Status.CONNECTING) {
			
		}
		else if (status === Strophe.Status.CONNFAIL) {
			showMessage('Connection error.');
		}
		else if (status === Strophe.Status.CONNECTED) {
			showMessage('Welcome, <strong>' + myNickname + '</strong>. Click on a person to invite them to play.');
			conn.muc.join(
				'lobby@' + conference, myNickname, 
				function(message) {
					if (handleMessage(message)) {
						return true;
					}
				},
				function (presence) {
					if (handlePresence(presence)) {
						return true;
					}
				}
			);
			$('#login').fadeOut('fast', function() {
				$('#logout').fadeIn('fast');
				$('#lobby').fadeIn('fast');
				gameState = 'lobby';
			});
		}
		else if ((status === Strophe.Status.DISCONNECTED) || (status === Strophe.Status.AUTHFAIL)) {
			showMessage('Thank you for playing with Neversi. You have been logged out.');
			$('#logout').fadeOut('fast');
			$('#lobby').fadeOut('fast', function() {
				$('#login').fadeIn('fast');
				$('#nickname').val('Your nickname').select();
			});
			myNickname = null;
			loginCredentials = [];
			conn = null;
			$('#play').removeAttr('readonly');
		}
	});
}

// Logout function
function logout() {
	conn.muc.leave('lobby@' + conference);
	conn.disconnect();
}

// Logout on browser close
$(window).unload(function() {
	logout();
});

// -----------------------------------------------
// END XMPP LOGIC
// -----------------------------------------------

$('#nickname').select();

neversi.newGame();

//});