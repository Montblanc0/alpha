import { Controller } from "@hotwired/stimulus"
import { get } from "@rails/request.js";

// Connects to data-controller="pagination"
// 1. Hides pagination buttons
// 2. Creates an intersection observer
// 3. Enables infinite scrolling
export default class extends Controller {
    static fetching = false; // debounce
    static observer;
    static values = {
        url: String,
        page: { type: Number, default: 1 },
    };

    static targets = ["noRecords", "scrollArea", "spinner", "pagination"];


    connect() {
        console.log("pagination connect");
        // hides pagination buttons
        $(this.paginationTarget).addClass("is-hidden");
        // creates an intersection observer
        this.#createObserver();
    }

    disconnect() {
        console.log("pagination disconnect")
        // disconnects observer
        this.observer.disconnect();
    }

    #createObserver() {
        this.observer = new IntersectionObserver(
            entries => this.#handleIntersect(entries[0]),
            { threshold: [0, 1.0] }
        )

        this.observer.observe(this.scrollAreaTarget)
    }

    #handleIntersect(target) {
        if (target.isIntersecting) {
            console.log("INTERSECT")
            if (this.hasNoRecordsTarget) {
                console.log("DISCONNECT")
                this.observer.disconnect();
                return;
            }
            if (!this.fetching) {

                this.scrollAreaTarget.firstElementChild.innerHTML = '<div class="spinner mt-4" id="spinner"></div>';

                this.#loadRecords();
            }
        }

    }


    // Send a turbo-stream request to the controller
    async #loadRecords() {
        // GET request to a kaminari api-friendly URL 
        const url = new URL(encodeURI(`${this.urlValue}/page/${this.pageValue}`));

        this.fetching = true;

        await get(url.toString(), {
            responseKind: "turbo-stream",
        });

        this.fetching = false;
        this.pageValue += 1;
    }
}


