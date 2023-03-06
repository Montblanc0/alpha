import { Controller } from "@hotwired/stimulus"
import { toggleScroll } from "../utils";

// Connects to data-controller="modal"
// 1. adjusts page scrolling
// 2. toggles the destroy prompt overlay
export default class extends Controller {
    static targets = ['background', 'modal']

    initialize() {
        $(this.backgroundTarget).on('click', () => {
            this.hideModal();
        })
    }

    connect() {
        toggleScroll(false);
    }

    hideModal() {
        $(this.modalTarget).removeClass('is-active')
        toggleScroll(true);
    }

    disconnect() {
        console.log("modal disconnect")
        this.hideModal();
    }
}
