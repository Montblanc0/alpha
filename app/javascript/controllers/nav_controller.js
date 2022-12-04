import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="nav"
export default class extends Controller {
    initialize() {
        $(".navbar-burger").on('click', function () {

            // Toggles the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            $(".navbar-burger").toggleClass("is-active");
            $(".navbar-menu").toggleClass("is-active");

        });
    }
    connect() {
        console.log("nav connect")
    }
}
