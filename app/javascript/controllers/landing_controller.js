import { Controller } from "@hotwired/stimulus"
import { toggleScroll } from "../utils";
// Connects to data-controller="landing"
// 1. adjusts page scrolling
// 2. creates an intersection observer
export default class extends Controller {
    static observer;

    initialize() {
        this.#initObserver();
        this.#enableSmoothScrolling();
    }

    connect() {
        console.log("landing connect")
        toggleScroll(false, $('.landing')[0]);
        this.#connectObserver();
    }

    // removes the 'hidden-landing' class upon intersection
    #initObserver() {
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("hidden-landing")
                } else {
                    entry.target.classList.add("hidden-landing")
                }
            })
        })
    }

    // connects observer to landing page elements
    #connectObserver() {
        const hiddenElements = document.querySelectorAll(".hidden-landing")
        hiddenElements.forEach(el => this.observer.observe(el));
    }

    #enableSmoothScrolling() {
        $(document).on('click', '.scroll a, #city-scroll', (e) => {
            e.preventDefault();
            $($(e.currentTarget).attr('href'))[0].scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    disconnect() {
        console.log("landing disconnect")
        toggleScroll(true, $('.landing')[0]);
        // disconnects observer
        this.observer.disconnect();
    }

}
