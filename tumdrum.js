$(document).ready(function() {
  var buttons = $('.btn'); //array of buttons
  var playbtn = $('#playbtn'); // starts sequence
  var status = $('#status'); // display win/lose
  var song = $('#song').get(0);
  song.volume = .2;
  var sequence = []; //array of sequence to be followed
  var playerSeq = []; //array of user input
  var inputs = 0; // number of inputs
  var playerTimeout = null; //setTimeout variable
  var timerRunning = false; //is timer running??
  var sound = null; // holds audio for playback controls
  var timerInterval = 4000; // interval to be used for player input
  var seqInterval = 387*2; // interval to be use for sequence playback
  var winPoint = 8;



  var getRand = function(min, max){ // gets random number from min to max
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  var checkSeq = function(sequence, playerSeq){// checks to see if playerSeq follows sequence order
    var output = false;
    for (var i = 0; i < playerSeq.length; i++) {
      output = Number(sequence[i]) === Number(playerSeq[i]);
      if(!output) break;
    }
    return output;
  }

  var gameOver = function(){//set game over que
    song.pause();
    song.currentTime = 0;
    console.log('You lose.');
    status.text('You lose.');
    // alert('You lose.');
  }

  var youWin = function(){// sets winner que
    console.log('You win.');
    status.text('You win.');
    // alert('You win!');
  }

  var resetGame = function(seq){// resets game variables for next round
    inputs = 0;
    playerSeq = [];
    if(!seq) {
      timerInterval = 4000; // interval to be used for player input
      seq = []
    }
    buttons.css('display', 'none');
    sequence = seq;
    sequence.push(getRand(0, 3));
    console.log('new sequence: '+sequence);
  }

  var setTimer = function(mils, seq){// sets playerTimeout
    if(!timerRunning) timerRunning = true;
    if(!seq) seq = [];
    playerTimeout = setTimeout(function(){
      console.log('setTimer timed out');
      gameOver();
      resetGame();
      playbtn.show('slow');
    }, mils);
  }

  var playSequence = function(seq){// plays the sequence in order
    // debugger;
    buttons.css('display', 'none');// hide buttons so not to allow input during playback
    $('#sprite').addClass('animate');
    for (let i = 0; i < seq.length; i++) {
      setTimeout(function(){
        if(i > 0){
          sound = $('#sound-'+seq[i-1]).get(0);
          sound.pause();
         sound.currentTime = 0;
       }
        sound = $('#sound-'+seq[i]).get(0);
        sound.play();
        $('#btn-'+seq[i]).css({
          'border' : '3px solid #ff5',
          'margin' : '2px'
        });
        setTimeout(function(){
          $('#btn-'+seq[i]).css({
            'border' : 'none',
            'margin' : '5px'
          });
        }, 250);
        if(i === seq.length-1) {
          $('#sprite').removeClass('animate');
          buttons.css('display', 'block');//display buttons to allow input
          setTimer(timerInterval);// set timer for input
        }
      }, i*seqInterval+seqInterval);
    }
  }

  var clickFunc = function(){
    clearTimeout(playerTimeout);//stop timer
    timerRunning = false;
    inputs++; //increase input amount
    // if(inputs % 3 === 0) seqInterval *= .9; // increases difficulty as rounds progress
    var btnId = $(this).parent().attr('id').split('').pop();
    sound = $('#sound-'+btnId).get(0);//get sound file
    sound.play(); // play sound
    playerSeq.push(Number(btnId));//store button number in playerSeq
    if(checkSeq(sequence, playerSeq)){// if playerSeq matches sequence
    $(this).parent().css({
      'border' : '3px solid green',
      'margin' : '2px'
    });
      if(sequence.length === inputs){// if # of inputs match sequence length
        if(inputs === winPoint){//if sequence length === winPoint you win; exit function;
          youWin();
          resetGame();
          playbtn.show('slow');
          return;
        }
        resetGame(sequence); //  keep sequence going
        playSequence(sequence); // play next sequence
        return;
      }
      setTimer(4000); //set timer between inputs
    }
    else{//if sequences do not match --> game over...
      $(this).parent().css({
      'border' : '3px solid red',
      'margin' : '2px'
    });
      gameOver();
      resetGame();
      playbtn.show('slow');
      return;
    }
  }

  var init = function(){// initialize game onclicks and set game in motion
  buttons.mousedown(clickFunc);
  buttons.mouseleave(function() {
    $(this).parent().css({
      'border' : 'none',
      'margin' : '5px'
    });
    if(sound){
      sound.pause();
      sound.currentTime = 0;
    }
  });
  buttons.mouseup(function() {
    $(this).parent().css({
      'border' : 'none',
      'margin' : '5px'
    });
    if(sound){
      sound.pause();
      sound.currentTime = 0;
    }
  });
  // **************PLAY BUTTON *******************
  playbtn.mousedown(function(event) {
    $(this).css({
      'background' : 'rgba(255, 255, 255, 1)'
    });
  });
  playbtn.mouseup(function(event) {
    status.text('');
    song.play();
    playSequence(sequence);
    $(this).css({
      'background' : 'rgba(255, 255, 255, .5)'
    });
    $(this).fadeOut('slow');
  });
  playbtn.mouseleave(function(event) {
    $(this).css({
      'background' : 'rgba(255, 255, 255, .5)'
    });
  });
  resetGame();
  buttons.css('display', 'none');
  }
  init();
});
