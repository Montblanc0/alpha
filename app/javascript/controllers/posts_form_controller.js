import { Controller } from "@hotwired/stimulus"
import { testPreview, disableSubmit, enableSubmit } from '../utils'

// Connects to data-controller="posts-form"
// 1. Switches states between STORAGE/URL
// 2. tests for valid images
// 3. shows corresponding preview

export default class extends Controller {
    static targets = ["image", "caption", "preview", "previewContainer", "url", "filename", "radio_url", "radio_storage", "switch", "submit"]

    initialize() {
        // disables submit whenever input is empty
        $("input[data-input-field]")[0].oninput = () => {
            if (!enableSubmit($("input[data-input-field]")[0], this.submitTarget)) disableSubmit($("input[data-input-field]")[0], this.submitTarget);
        }
    }

    connect() {
        console.log("post form connect")

        // Uncomment only if "cache" target is present
        // if ($("input[data-input-field]")[0].value.length) $("input[data-input-field]")[0].dispatchEvent(new Event('change', { 'bubbles': true }));

        // enable submit after turbo has finished loading
        enableSubmit($("input[data-input-field]")[0], this.submitTarget)


        //Enable radio buttons
        this.enableRadio();
    }

    async displayFilePreview(e) {
        if (e.target.files && e.target.files[0]) {
            this.filenameTarget.textContent = this.imageTarget.files[0]["name"]
        } else
            $(this.previewContainerTarget).hide();
        let src = "";
        try {
            const file = await this.readFilePreview(e);
            src = await testPreview(file);
            $(this.previewContainerTarget).show();
        } catch (err) {
            console.log(err);
            $(this.previewContainerTarget).hide();
        }
        this.previewTarget.src = src;
    }

    async displayUrlPreview() {
        let src = "";
        try {
            src = await testPreview(this.urlTarget.value)
            $(this.previewContainerTarget).show();
        } catch (err) {
            console.log(err);
            $(this.previewContainerTarget).hide();
        }
        this.previewTarget.src = src;
    }

    readFilePreview(e) {
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

    enableRadio() {
        $(".waits-for-turbo").removeClass("waits-for-turbo");
    }

    switch() {
        this.switchTarget.click();
    }
}
