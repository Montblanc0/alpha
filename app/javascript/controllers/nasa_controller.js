import { Controller } from "@hotwired/stimulus"
import * as utils from '../utils'

// Connects to data-controller="nasa"
// 1. Fetches data from NASA APOD API https://github.com/nasa/apod-api
// 2. Saves response to LocalStorage
// 3. Checks LocalStorage and date to evaluate whether or not to make a new request
export default class extends Controller {
    static targets = ["go", "url", "preview", "caption", "explanation", "media", "submit"]
    connect() {
        console.log("NASA CONNECT")
        //enables button after turbo has finished loading
        this.goTarget.classList.remove("waits-for-turbo");
    }

    async nasa() {
        this.goTarget.classList.add("is-loading");
        this.goTarget.blur();
        if (!this.isUpToDate()) {
            console.log("FETCHING...")
            const apod = await utils.getNasa();
            if (!apod) {
                this.goTarget.classList.remove("is-loading");
                return;
            }
            this.setLocalStorage(apod);
        }
        this.requestTurboFrame();
    }

    isStored() {
        return localStorage.getItem("nasaDate") ? true : false;
    }

    isUpToDate() {
        if (!this.isStored()) return false;
        const currentDate = new Date().toISOString().slice(0, 10);
        return localStorage.getItem("nasaDate") == currentDate ? true : false;
    }

    requestTurboFrame() {
        this.setInputValues();
        this.submitTarget.click();
    }

    setLocalStorage(json) {
        localStorage.setItem("nasaDate", json.date);
        localStorage.setItem("nasaTitle", json.title);
        localStorage.setItem("nasaUrl", json.url);
        localStorage.setItem("nasaExplanation", json.explanation);
        localStorage.setItem("nasaMedia", json.media_type);
    }

    setInputValues() {
        this.mediaTarget.value = localStorage.getItem("nasaMedia");
        this.captionTarget.value = localStorage.getItem("nasaTitle");
        this.urlTarget.value = localStorage.getItem("nasaUrl");
        this.explanationTarget.value = localStorage.getItem("nasaExplanation");
    }
}
