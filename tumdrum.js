$(document).ready(function() {
  var buttons = $('.btn'); //array of buttons
  var sequence = []; //array of sequence to be followed
  var playerSeq = []; //array of user input
  var inputs = 0; // number of inputs
  var playerTimeout = null; //setTimeout variable
  var timerRunning = false; //is timer running??
  var sound = null; // holds audio for playback controls
  var timerInterval = 4000; // interval to be used for player input
  var seqInterval = 1000; // interval to be use for sequence playback
  var winPoint = 16;

  var getRand = function(min, max){ // gets random number from min to max
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  var checkSeq = function(sequence, playerSeq){// checks to see if playerSeq follows sequence order
    var output = false;
    for (var i = 0; i < playerSeq.length; i++) {
      output = (Number(sequence[i]) === Number(playerSeq[i]) ? true : false);
      if(!output) break;
    }
    return output;
  }

  var gameOver = function(){//set game over que
    console.log('You lose.');
    alert('You lose.');
  }

  var youWin = function(){// sets winner que
    console.log('You win.');
    alert('You win!');
  }

  var resetGame = function(seq){// resets game variables for next round
    inputs = 0;
    playerSeq = [];
    if(!seq) {
      timerInterval = 4000; // interval to be used for player input
      seqInterval = 1000; // interval to be use for sequence playback
      seq = []
    }
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
      resetGame(seq);
      playSequence(seq);
    }, mils);
  }

  var playSequence = function(seq){// plays the sequence in order
    buttons.css('display', 'none');
    for (let i = 0; i < seq.length; i++) {
      setTimeout(function(){
        if(i > 0){
          sound = $('#sound-'+seq[i-1]).get(0);
          sound.pause();
         sound.currentTime = 0;
       }
        console.log('#'+(i+1)+': '+seq[i]);
        sound = $('#sound-'+seq[i]).get(0);
        sound.play();
        $('#btn-'+seq[i]).css({
          'border' : '1px solid green',
          'margin' : '4px'
        });
        setTimeout(function(){
          $('#btn-'+seq[i]).css({
            'border' : 'none',
            'margin' : '5px'
          });
        }, 500);
        if(i === seq.length-1) {
          console.log('Go!')
          buttons.css('display', 'block');
          setTimer(timerInterval);
        }
      }, i*seqInterval+seqInterval);
    }
  }

  var clickFunc = function(){
    $(this).parent().css({
      'border' : '1px solid blue',
      'margin' : '4px'
    });
    clearTimeout(playerTimeout);//stop timer
    timerRunning = false;
    inputs++; //increase input amount
    if(inputs % 4 === 0){
      timerInterval *= .9;
      seqInterval *= .8;
    }
    var btnId = $(this).parent().attr('id').split('').pop();
    sound = $('#sound-'+btnId).get(0);//get sound file
    sound.play(); // play sound
    playerSeq.push(Number(btnId));//store button number in playerSeq
    if(checkSeq(sequence, playerSeq)){// if playerSeq matches sequence
      if(sequence.length === inputs){// if # of inputs match sequence length
        if(inputs === winPoint){//if sequence length === winPoint you win; exit function;
          youWin();
          resetGame();
          return;
        }
        resetGame(sequence); //  keep sequence going
        playSequence(sequence); // play next sequence
        return;
      }
      setTimer(4000); //set timer between inputs
    }
    else{//if sequences do not match --> game over...
      gameOver();
      resetGame();
      playSequence(sequence);
      return;
    }
  }

  var init = function(){
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
  resetGame();
  playSequence(sequence);
  }
  init();
});
