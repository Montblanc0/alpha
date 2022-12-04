import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="posts"
// 1. Waits for turbo to finish loading before enabling actions
export default class extends Controller {
    connect() {
        $(".waits-for-turbo").removeClass("waits-for-turbo")
    }
}
