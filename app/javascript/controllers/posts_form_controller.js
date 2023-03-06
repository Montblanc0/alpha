import { Controller } from "@hotwired/stimulus"
import { testPreview, disableSubmit, enableSubmit, validateSize } from '../utils'

// Connects to data-controller="posts-form"
// 1. Switches states between STORAGE/URL
// 2. tests for valid images
// 3. shows corresponding preview

export default class extends Controller {
    static targets = ["image", "caption", "preview", "previewContainer", "url", "filename", "radio_url", "radio_storage", "switch", "submit"]

    initialize() {
        // clear cache
        $("#post_form")[0].reset();
        // disables submit whenever storage input is empty
        if (!$("#post_image")[0]) return;
        $("#post_image")[0].oninput = () => {
            if (!enableSubmit($("#post_image")[0], this.submitTarget)) disableSubmit($("#post_image")[0], this.submitTarget);
        }
    }

    connect() {
        console.log("post form connect")

        // Uncomment only if "cache" target is present
        // if ($("input[data-input-field]")[0].value.length) $("input[data-input-field]")[0].dispatchEvent(new Event('change', { 'bubbles': true }));

        //Enable radio buttons
        this.#enableRadio();

        // enable storage submit after turbo has finished loading
        if (!$("#post_form")[0]) return;
        enableSubmit($("input[data-input-field]")[0], this.submitTarget)
    }

    switch() {
        this.switchTarget.click();
    }

    async displayFilePreview(e) {
        // reset state
        this.#resetFileFields();

        this.#addLoadingSpinner();
        $(this.previewContainerTarget).show();

        if (e.target.files && e.target.files[0]) {
            //validate size
            if (!validateSize(e.target.files[0])) {
                this.#handleFileError("File size exceeds 2 MBs");
                this.#removeLoadingSpinner();
                return;
            };
            this.filenameTarget.textContent = this.imageTarget.files[0]["name"]
        } else {
            $(this.previewContainerTarget).hide();
            this.#removeLoadingSpinner();
        }
        let src = "";
        try {
            const file = await this.#readFilePreview(e);
            src = await testPreview(file);
            // $(this.previewContainerTarget).show();
        } catch (err) {
            this.#handleFileError(err);
            this.#removeLoadingSpinner();
            return;
        }
        this.#removeLoadingSpinner();
        this.previewTarget.src = src;
    }

    // validates URL and enables submit
    async displayUrlPreview() {
        // reset state
        this.submitTarget.disabled = true;
        this.#resetURLFields();

        this.#addLoadingSpinner();
        $(this.previewContainerTarget).show();

        let src = "";
        try {
            src = await testPreview(this.urlTarget.value);
        } catch (err) {
            this.#handleURLError(err);
            this.#removeLoadingSpinner();
            return;
        }
        this.#removeLoadingSpinner();
        this.previewTarget.src = src;
        this.submitTarget.disabled = false;
    }

    #readFilePreview(e) {
        return new Promise((resolve, reject) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = (r) => resolve(r.target.result);
                reader.onerror = () => reject("Error while reading file.");
            }
            else reject("No file present.");
        })
    }

    #addLoadingSpinner() {
        const loader = $("<div>").addClass("loader");
        $(this.previewTarget).parent().append(loader);
    }

    #removeLoadingSpinner() {
        $("div.loader").remove();
    }

    #handleFileError(message) {
        $(this.previewContainerTarget).hide();
        $("span.tag")[0].textContent = message
        $("span.tag")[0].classList.remove("is-hidden");
        $("div.file")[0].classList.add("field_with_errors");
        this.filenameTarget.textContent = "";
        this.previewTarget.src = "";
        $("#post_form")[0].reset();
    }

    #handleURLError(message) {
        $(this.previewContainerTarget).hide();
        $(".control")[0].classList.add("field_with_errors");
        $(".tag.is-danger")[0].textContent = message;
        $(".tag.is-danger")[0].classList.remove("is-hidden");
    }

    #resetFileFields() {
        $("span.tag")[0].classList.add("is-hidden");
        $("span.tag")[0].textContent = ""
        $("div.file")[0].classList.remove("field_with_errors");
    }

    #resetURLFields() {
        $(".control")[0].classList.remove("field_with_errors");
        $(".tag.is-danger")[0].textContent = "";
        $(".tag.is-danger")[0].classList.add("is-hidden");
    }

    #enableRadio() {
        $(".waits-for-turbo").removeClass("waits-for-turbo");
    }
}
