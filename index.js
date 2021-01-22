$(document).ready(function() {

  let animating = false;
  let cardsCounter = 0;
  let numOfCards = 6;
  let decisionVal = 80;
  let pullDeltaX = 0;
  let deg = 0;
  let card, cardReject, cardLike;

  let startX = 0

  function draggCard() {
    animating = true;
    deg = pullDeltaX / 10;

    card.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    let opacity = pullDeltaX / 100;
    let rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
    let likeOpacity = (opacity <= 0) ? 0 : opacity;

    cardReject.style.opacity = rejectOpacity;
    cardLike.style.opacity = likeOpacity;
  };

  function releaseCard() {
    if (pullDeltaX >= decisionVal) {
      card.classList.add("to-right");
    } else if (pullDeltaX <= -decisionVal) {
      card.classList.add("to-left");
    }

    if (Math.abs(pullDeltaX) >= decisionVal) {
      card.classList.add("inactive");

      setTimeout(function() {
        card.classList.add("below");
        card.classList.remove("inactive", "to-left", "to-right");

        cardsCounter++;

        if (cardsCounter === numOfCards) {
          cardsCounter = 0;
          $(".demo__card").removeClass("below"); 
        }
      }, 300);
    }

    if (Math.abs(pullDeltaX) < decisionVal) {
      card.classList.add("reset");
    }

    setTimeout(function() {
      card.style = null
      card.classList.remove("reset")
      card.querySelectorAll(".demo__card__choice").forEach(el => el.style = null)

      pullDeltaX = 0;
      animating = false;
    }, 300);
  };

  function onMove(event) {
    console.log("onMove");
    let x = event.pageX || event.originalEvent.touches[0].pageX;
    pullDeltaX = (x - startX);
    if (!pullDeltaX) return;
    draggCard();
  }

  function onEnd() {
    console.log("onEnd");
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('touchmove', onMove)
    
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchend', onEnd)

    if (!pullDeltaX) return; // prevents from rapid click events
    releaseCard();
  }

  function onStart(event) {
    if (animating) return;

    card = this;
    cardReject = card.querySelector(".demo__card__choice.m--reject")
    cardLike = card.querySelector(".demo__card__choice.m--like")

    startX =  event.pageX || event.originalEvent.touches[0].pageX;

    document.addEventListener("mousemove", onMove)
    document.addEventListener("touchmove", onMove)

    document.addEventListener("mouseup", onEnd)
    document.addEventListener("touchend", onEnd)
  }

  document.querySelectorAll(".demo__card:not(.inactive)").forEach(card => {
    card.addEventListener("mousedown", onStart)
    card.addEventListener("mousedown", onStart)
  })
});