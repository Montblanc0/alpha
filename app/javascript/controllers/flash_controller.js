import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="flash"
// 1. manages flash message animations
// 2. stores timeout id and clears it before starting another
//    to avoid overlapping
export default class extends Controller {
    static values = {
        timeoutId: Number
    }

    initialize() {
        $("button.delete").on('click', () => {
            this.stopTimeout();
            $(".flash.message").slideUp(250, () => $(".flash").remove());
        })

    }
    connect() {
        console.log("flash connect");
        this.slideIn();
    }

    slideIn() {
        $(window).scrollTop(0);
        $(".flash.message").slideDown(150);
        this.startTimeout();
    }

    startTimeout() {
        this.timeoutIdValue = setTimeout(this.slidePrimaryUp, 5500);
        console.log("TIMEOUT SET TO: " + this.timeoutIdValue)
    }

    stopTimeout() {
        clearTimeout(this.timeoutIdValue)
        console.log("CLEARED ID: " + this.timeoutIdValue)
    }

    slidePrimaryUp() {
        $(".flash.is-primary").slideUp(250, () => $(".flash").remove())
    }

    disconnect() {
        console.log("flash disconnect");
        this.stopTimeout();
    }

}
