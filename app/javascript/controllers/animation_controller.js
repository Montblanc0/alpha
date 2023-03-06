import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="animation"
// Used to animate message removal
export default class extends Controller {

    initialize() {
        // listens to "remove" action and delegates to jQuery
        $(document).on("turbo:before-stream-render", (event) => {
            if (event.target.action === "remove") {
                const targetFrame = document.getElementById(event.target.target)

                event.preventDefault();
                $(targetFrame).slideUp(250, () => $(targetFrame).remove());
            }
        })
    }
    connect() {
        console.log("animation connect")
        // enables clicks after turbo has finished loading
        // (prevents html responses)
        $(".waits-for-turbo").removeClass("waits-for-turbo");
    }
}
