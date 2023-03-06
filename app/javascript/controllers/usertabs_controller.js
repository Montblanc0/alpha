import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="usertabs"
// 1. manages tab switching on user profile
export default class extends Controller {
    initialize() {
        // toggle "is-active" class on tabs
        $(".tabs ul>li").on('click', (event) => {
            $(".tabs li.is-active").removeClass('is-active')
            $(event.currentTarget).addClass("is-active")
        })
    }
    connect() {
        // enable clicks after turbo has finished loading
        $(".waits-for-turbo").removeClass("waits-for-turbo")
        console.log("usertabs connect")
    }
}
