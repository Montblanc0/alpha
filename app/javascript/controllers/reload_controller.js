import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reload"
// 1. sends a get request to the controller to force a turbo-stream re-render (works around current_user unavailable after broadcast)
export default class extends Controller {
    static targets = ['reload']

    connect() {
        console.log("reload connect")
        this.reloadTarget.click();
        this.reloadTarget.parentElement.remove();
    }

    //called on 'animationend'
    clearClass(e) {
        e.target.classList.remove("slideInLeft")
    }
}
