export class Slider { 
  constructor(container) {
    this.animating = false;
    this.cardsCounter = 0;
    this.numOfCards = 6;
    this.decisionVal = 80;
    this.pullDeltaX = 0;
    this.deg = 0;
    this.startX = 0
    this.card = undefined
    this.cardReject = undefined
    this.cardLike = undefined

    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)

    container.querySelectorAll(".demo__card:not(.inactive)").forEach(card => {
      card.addEventListener("mousedown", (event) => this.onStart(event))
      card.addEventListener("mousedown", (event) => this.onStart(event))
    })
  }

  onStart(event) {
    console.log("onStart", this);

    if (this.animating) return;

    this.card = event.currentTarget
    this.cardReject = this.card.querySelector(".demo__card__choice.m--reject")
    this.cardLike = this.card.querySelector(".demo__card__choice.m--like")
    this.startX =  event.pageX || event.originalEvent.touches[0].pageX;

    document.addEventListener("mousemove", this.onMove)
    document.addEventListener("touchmove", this.onMove)
    document.addEventListener("mouseup", this.onEnd)
    document.addEventListener("touchend", this.onEnd)
  }

  onMove(event) {
    // console.log("onMove", this);

    let x = event.pageX || event.originalEvent.touches[0].pageX;
    this.pullDeltaX = (x - this.startX);
    if (!this.pullDeltaX) return;

    this.dragCard();
  }

  onEnd() {
    // console.log("onEnd", this);
    // TODO? remove on cards with foreach?
    document.removeEventListener('mousemove', this.onMove)
    document.removeEventListener('touchmove', this.onMove)
    document.removeEventListener('mouseup', this.onEnd)
    document.removeEventListener('touchend', this.onEnd)

    if (!this.pullDeltaX) return; // prevents from rapid click events
    
    this.releaseCard();
  }

  dragCard() {
    // console.log("dragCard", this);

    this.animating = true;
    this.deg = this.pullDeltaX / 10;

    this.card.style.transform = `translateX(${this.pullDeltaX}px) rotate(${this.deg}deg)`;

    let opacity = this.pullDeltaX / 100;
    let rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
    let likeOpacity = (opacity <= 0) ? 0 : opacity;

    this.cardReject.style.opacity = rejectOpacity;
    this.cardLike.style.opacity = likeOpacity;
  };

  releaseCard() {
    console.log("releaseCard", this);

    if (this.pullDeltaX >= this.decisionVal) {
      this.card.classList.add("to-right");
    } else if (this.pullDeltaX <= -this.decisionVal) {
      this.card.classList.add("to-left");
    }

    if (Math.abs(this.pullDeltaX) >= this.decisionVal) {
      this.card.classList.add("inactive");

      setTimeout(() => {
        this.card.classList.add("below");
        this.card.classList.remove("inactive", "to-left", "to-right");

        this.cardsCounter++;

        if (this.cardsCounter === this.numOfCards) {
          this.cardsCounter = 0;
          document.querySelectorAll(".demo__card").forEach(el => el.classList.remove("below"));
        }
      }, 300);
    }

    if (Math.abs(this.pullDeltaX) < this.decisionVal) {
      this.card.classList.add("reset");
    }

    setTimeout(() => {
      this.card.style = null
      this.card.classList.remove("reset")
      this.card.querySelectorAll(".demo__card__choice").forEach(el => el.style = null)

      this.pullDeltaX = 0;
      this.animating = false;
    }, 300);
  };
}