// Neversi
// Copyright Nadim Kobeissi, all rights reserved

var neversi = function() {};

$(window).load(function() {

// Configuration
var domain = 'never.si';
var conference = 'conference.never.si';
var bosh = 'http://151.236.217.53/http-bind';

var myNickname, gameState, inviting, myTurn;
var myDice, myColor, opponent, loginError, inviter;
var loginCredentials = [];

var abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	
// -----------------------------------------------
// BOARD LOGIC
// -----------------------------------------------

// Start a new game	
neversi.newGame = function() {
	$('.square').html('');
	resetCounters();
	takeSquare('d5', 'black', 0);
	takeSquare('e4', 'black', 0);
	takeSquare('e5', 'white', 0);
	takeSquare('d4', 'white', 0);
}

// Take square with color
// If network = 1, broadcasts move to opponent
function takeSquare(square, color, network) {
	$('#' + square).html(
		$('<img />',{
			'class': color,
			'src': 'img/' + color + '.png',
		})
	);
	incrementCounter(color, 1);
	if (network && opponent) {
		sendMessage(square, opponent);
	}
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
				for (var i = (r - 1); i >= 1; i--) {
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
				for (var i = (r - 1); i >= 1; i--) {
					if (o < 7) { o++ }
					else { break }
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
				for (var o = (c + 1); o <= 7; o++) {
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
				for (var i = (r + 1); i <= 8; i++) {
					if (o < 7) { o++ }
					else { break }
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
				for (var i = (r + 1); i <= 8; i++) {
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
				for (var i = (r + 1); i <= 8; i++) {
					if (o > 0) { o-- }
					else { break }
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
				for (var o = (c - 1); o >= 0; o--) {
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
				for (var i = (r - 1); i >= 1; i--) {
					if (o > 0) { o-- }
					else { break }
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
		for (o in moves[i]) {
			if (!moves[i][o].length) {
				delete moves[i][o];
			}
		}
		if (!moves[i].length) {
			delete moves[i];
		}
	}
	if (Object.keys(moves).length === 0) {
		return false;
	}
	return moves;
}

// Highlight possible moves
function highlightMoves(color) {
	var moves = getMoves(color);
	if (!moves) {
		if (getDiscCount() === 64) {
			endGame();
		}
		return false;
	}
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
	return true;
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
// If 'highlight', highlights moves after flipping discs
function flipDiscs(discs, highlight) {
	var h = null;
	var t = 225;
	var color = getColor(discs[0][0]);
	var opposite = getOpposite(color);
	for (var i in discs) {
		$.each(discs[i], function(o, val) {
			window.setTimeout(function() {
				$('#' + val).css('background-image', 'url("img/' + opposite + '.png")');
				$('#' + val).find('img').fadeOut(function() {
					takeSquare(val, opposite, 0);
					incrementCounter(color, -1);
					$('#' + val).css('background-image', '');
				});
				if (highlight && !h) {
					h = window.setTimeout(function() {
						if(highlightMoves(myColor)) {
							showMessage('Playing against ' + strong(opponent) + '. It\'s your turn.');
						}
						else {
							sendMessage('pass', opponent);
							myTurn = 0;
						}
					}, t + 600);
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
	var discs = getMoves(myColor)[square];
	takeSquare(square, myColor, 1);
	flipDiscs(discs, 0);
	myTurn = 0;
	showMessage('Playing against ' + strong(opponent) + '. It\'s their turn.');
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

// Make input HTML bold
function strong(text) {
	return '<strong>' + text + '</strong>';
}

// Handle getting an invitation
function getInvitation(player, theirDice) {
	var invitation = strong(player)
		+ ' challenges you. Accept?<br />'
		+ '<span class="choice">yes</span> &nbsp;&nbsp;'
		+ '<span class="choice">no</span>'
	showMessage(invitation);
	// Delay necessary to avoid race condition
	window.setTimeout(function() {
		$('.choice').click(function() {
			if ($(this).html() == 'yes') {
				myDice = Math.floor(Math.random()*9999999999);
				sendMessage('accept ' + myDice, player);
				enterGame(player, myDice, theirDice);
			}
			else {
				sendMessage('refuse', player);
				showMessage('You have refused the invitation.');
				gameState = 'lobby';
			}
		});
	}, 1000);
}

// Enter a game after successful invitation
function enterGame(player, myDice, theirDice) {
	gameState = 'inGame';
	opponent = player;
	inviting = null;
	inviter = null;
	if (myDice > theirDice) { myColor = 'black' }
	else { myColor = 'white' }
	$('#lobby').fadeOut(function() {
		$('#inGame').fadeIn();
		$('#logout').fadeOut('fast', function() {
			$('#resign').fadeIn('fast');
		});
		neversi.newGame();
		if (myColor === 'black') {
			highlightMoves(myColor);
			myTurn = 1;
			showMessage('Playing against ' + strong(opponent) + '. It\'s your turn.');
		}
		else {
			myTurn = 0;
			showMessage('Playing against ' + strong(opponent) + '. It\'s their turn.');
		}
	});
}

// Leave game
function leaveGame() {
	gameState = 'lobby';
	opponent = null;
	myTurn = null;
	$('#inGame').fadeOut(function() {
		$('#chat').html('');
		$('#chatInput').val('');
		$('#lobby').fadeIn();
		$('#resign').fadeOut('fast', function() {
			$('#logout').fadeIn('fast');
		});
		neversi.newGame();
	});
}

// Display chat message
function addToChat(message, nickname) {
	$('#chat').append('<div>' + strong(nickname) + ': ' + addLinks(message) + '</div>');
	scrollDown(600);
}

// Convert message URLs to links.
function addLinks(message) {
	if ((URLs = message.match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi))) {
		for (var i in URLs) {
			var sanitize = URLs[i].split('');
			for (var l in sanitize) {
				if (!sanitize[l].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
					sanitize[l] = encodeURIComponent(sanitize[l]);
				}
			}
			sanitize = sanitize.join('');
			var processed = sanitize.replace(':','&colon;');
			message = message.replace(sanitize, '<a target="_blank" href="' + processed + '">' + processed + '</a>');		
		}
	}
	return message;
}

// Scrolls down the chat window to the bottom in a smooth animation.
// 'speed' is animation speed in milliseconds.
function scrollDown(speed) {
	$('#chat').animate({
		scrollTop: $('#chat')[0].scrollHeight + 20
	}, speed);
}

// Increment disc counter for color by amount (negative amounts allowed)
function incrementCounter(color, amount) {
	var counter = parseInt($('#' + color + 'Counter').text());
	counter += amount;
	$('#' + color + 'Counter').text(counter);
}

// Get total disc count
function getDiscCount() {
	return parseInt($('#blackCounter').text()) + parseInt($('#whiteCounter').text());
}

// End game
function endGame() {
	var blackCount = parseInt($('#blackCounter').text());
	var whiteCount = parseInt($('#whiteCounter').text());
	if (blackCount > whiteCount) {
		var winner = 'black';
	}
	else if (whiteCount > blackCount) {
		var winner = 'white';
	}
	else {
		showMessage('It\'s a draw!');
		return;
	}
	if (myColor === winner) {
		showMessage('You have won!');
	}
	else {
		showMessage('You have lost.');
	}
}

// Reset disc counters
function resetCounters() {
	$('#blackCounter').text('0');
	$('#whiteCounter').text('0');
}

// Bind logout button
$('#logout').click(function() {
	logout();
});

// Bind resign button
$('#resign').click(function() {
	sendMessage('resign', opponent);
	showMessage('You have resigned.');
	leaveGame();
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

// Handle chat form submission
$('#chatInput').keyup(function(e) {
	if (e.keyCode === 13) {
		var chat = $.trim($(this).val().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
		if (chat !== '') {
			addToChat(chat, myNickname);
			sendMessage('chat ' + $(this).val(), opponent);
			$(this).val('');
		}
	}
});

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
	// If this is a group message, ignore.
	if (type === 'groupchat') {
		return true;
	}
	console.log(nickname + ': ' + body);
	// Detect incoming invitation
	if (body.match(/^invite\s[0-9]+$/)) {
		if (gameState === 'lobby') {
			var theirDice = parseInt(body.match(/[0-9]+$/)[0]);
			getInvitation(nickname, theirDice);
			gameState = 'invited';
			inviter = nickname;
		}
		else {
			sendMessage(gameState, player);
		}
	}
	// Detect canceled invitations
	if (body === 'cancel') {
		if (inviter === nickname) {
			showMessage(strong(nickname) + ' have canceled their invitation.');
			inviter = null;
			gameState = 'lobby';
		}
	}
	// Detect invitation response
	else if (inviting === nickname) {
		if (body.match(/^accept\s[0-9]+$/)) {
			var theirDice = parseInt(body.match(/[0-9]+$/)[0]);
			enterGame(nickname, myDice, theirDice);
			return true;
		}
		else if (body === 'refuse') {
			showMessage(strong(nickname) + ' has refused your invitation.');
		}
		else if (body === 'inGame') {
			showMessage(strong(nickname) + ' is currently playing a game.');
		}
		else if ((body === 'invited') || (body === 'inviting')) {
			showMessage(strong(nickname) + ' is already handling another invitation. Try again shortly.');
		}
		gameState = 'lobby';
		inviting = null;
		$('.player').mouseout();
	}
	// Detect gameplay moves/chat
	else if (opponent === nickname) {
		if (move = body.match(/^[a-h][1-8]$/)) {
			var discs = getMoves(getOpposite(myColor));
			if (!myTurn && discs[move[0]]) {
				myTurn = 1;
				takeSquare(move[0], getOpposite(myColor), 0);
				flipDiscs(discs[move[0]], 1);
			}
		}
		else if (body === 'pass') {
			if (!myTurn) {
				myTurn = 1;
				if (highlightMoves(myColor)) {
					showMessage(strong(nickname) + ' has no moves. It\'s your turn.');
				}
				else {
					endGame();
				}
			}
		}
		else if (body === 'resign') {
			showMessage('Your opponent has resigned.');
			leaveGame();
		}
		else if (chat = body.match(/^chat/)) {
			addToChat(body.substring(5), nickname);
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
				loginError = 1;
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
		if (opponent === nickname) {
			showMessage('Your opponent has logged out.');
			leaveGame();
		}
		else if (inviting === nickname) {
			showMessage(strong(nickname) + ' has logged out.');
			inviting = null;
			gameState = 'lobby';
		}
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
		if (gameState === 'lobby') {
			myDice = Math.floor(Math.random()*9999999999);
			gameState = 'inviting';	
			inviting = player;
			sendMessage('invite ' + myDice, player);
			showMessage(
				'Waiting for ' + strong(player) + ' to respond...'
				+ '<br /><span class="choice">cancel</span>'
			);
			window.setTimeout(function() {
				$('.choice').click(function() {
					sendMessage('cancel', player);
					showMessage('Welcome, ' + strong(myNickname) + '. Click on a person to invite them to play.');
					gameState = 'lobby';
					inviting = null;
				});
			}, 1000);
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
			showMessage('Welcome, ' + strong(myNickname) + '. Click on a person to invite them to play.');
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
			if (!loginError) {
				showMessage('Thank you for playing with Neversi. You have been logged out.');
			}
			neversi.newGame();
			$('#logout').fadeOut('fast');
			$('#resign').fadeOut('fast');
			$('#' + gameState).fadeOut('fast', function() {
				$('#chat').html('');
				$('#chatInput').val('');
				$('#login').fadeIn('fast');
				$('#nickname').val('Your nickname').select();
			});
			myNickname = opponent = inviting = myTurn = null;
			inviter = conn = gameState = loginError = myColor = null;
			loginCredentials = [];
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

});