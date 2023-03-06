import { Controller } from "@hotwired/stimulus"
import { disableSubmit, enableSubmit } from '../utils'
// Connects to data-controller="messages"
// 1. Waits for turbo to finish loading before enabling actions
// 2. Sets input event on message form
export default class extends Controller {
    static targets = ["content", "submit"]

    initialize() {

        // disables submit when input is empty
        try {
            this.contentTarget.oninput = () => {
                if (!enableSubmit(this.contentTarget, this.submitTarget)) disableSubmit(this.contentTarget, this.submitTarget);
            }
        } catch (err) { this.#handleMissingTarget(err) }
    }

    connect() {
        console.log("messages connect")
        // enables submit after turbo has finished loading
        try {
            enableSubmit(this.contentTarget, this.submitTarget);
        } catch (err) { this.#handleMissingTarget(err) }
    }

    #handleMissingTarget(err) {
        console.log(err.name + ": " + err.message); console.log("%c^^ The error above appears twice on user messages page and can be ignored ^^", 'font-weight: 900; color: #391')
    }
}


