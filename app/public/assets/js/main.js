/*
 *	VARS
 */
var counter;

var id; // user id
var h = 0;
var mInterval;
var socket;
var transitionForcer;

function init(){
	// counter
	initSocket();
	start();

	props.groovy = document.getElementById('broadcast');
	setTimeout( animate, 1 );
}

function start(){
	mInterval = setInterval(nextHour, 360000);
	nextHour();
	startCountdown();
}

function startCountdown(){
	//remove image
	$('#counter img').remove();
	//show countdown
	counter = $('#counter').countdown({
		image: '/images/digits.png',
		startTime: '24:00:00',
		format: 'hh:mm:ss'
	});
}

function nextHour(){
	if(h<24){
		h++;
		startHour(h);
	}
}

function startHour(hour){
	$('.scrollImage').remove();
	$('#content').append("<img class='scrollImage' src='/images/"+ hour +".gif' height='100%' />");
	transitionForcer = setInterval(transition,10);

}

function transition() {
	console.log("transition query");
	var toScroll = $('.scrollImage').width() - $('#container').width();
	$('.scrollImage').css('transform', 'translate3d(-'+toScroll+'px,0,0)');
	if($('.scrollImage').length > 0)
		clearInterval(transitionForcer);
}

function resetTo(hour){
	h = parseInt(hour);
	$('#counter').empty();

	startHour(hour);

	//show countdown
	counter = $('#counter').countdown({
		image: '/images/digits.png',
		startTime: (25 - hour)+':00:00',
		format: 'hh:mm:ss'
	});
}

function showText(text){
	console.log(text);
	$("#broadcast").html(text);

}

function initSocket(){
	//socket IO:
	if(!socket){
		// socket.io initialiseren
		socket = io.connect(window.location.hostname);
		// some debugging statements concerning socket.io
		socket.on('reconnecting', function(seconds){
			console.log('reconnecting in ' + seconds + ' seconds');
		});
		socket.on('reconnect', function(){
			console.log('reconnected');
		});
		socket.on('reconnect_failed', function(){
			console.log('failed to reconnect');
		});
		socket.on('text', showText);
		socket.on('reset', resetTo);
	}
}

