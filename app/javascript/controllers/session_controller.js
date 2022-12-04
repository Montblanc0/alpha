import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="session"
// 1. complements HTML5 validation on user login with errors on empty inputs
export default class extends Controller {
    static targets = ['username', 'username_field', 'password', 'password_field', 'login', 'submit']
    connect() {
        console.log("session connect")
        // enable submit when turbo has finished loading
        this.loginTarget.disabled = false;
    }

    //checks for blank input
    validate(event) {
        $("div.field_with_errors").removeClass("field_with_errors");
        if (this.usernameTarget.value && this.passwordTarget.value) {
            this.submitTarget.click();
            return;
        }
        event.preventDefault();
        if (!this.usernameTarget.value) $(this.username_fieldTarget).addClass("field_with_errors");
        if (!this.passwordTarget.value) $(this.password_fieldTarget).addClass("field_with_errors");
    }
}
