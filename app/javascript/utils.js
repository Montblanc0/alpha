export const testPreview = (url) => {
    const img = new Image();
    return new Promise((resolve, reject) => {
        try {
            img.src = new URL(url).href;
        } catch (err) {
            reject("Malformed URL")
        }
        img.onload = async () => {
            let blob = {};
            try {
                blob = await fetchBlob(img.src);
                console.log(`Size: ${blob.size}`);
                validateSize(blob) ? resolve(img.src) : reject("File size exceeds 2 MBs");
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = () => reject("Error while loading image");
    })
}

const fetchBlob = async (url) => {
    // also checks whether user is allowed to crosslink
    const response = await fetch(url);
    return await response.blob();
}

export const getNasa = async () => {

    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');

    if (!response.ok) {
        console.log(`An error has occured: ${response.status}`);
        return false;
    }
    return await response.json();
}

export const disableSubmit = (input, submit) => {
    if (!input.value.length && !submit.disabled) {
        submit.disabled = true;
    }
}

export const enableSubmit = (input, submit) => {
    if (input.value.length && submit.disabled) {
        submit.disabled = false;
        return true;
    }
    return false;
}


export const toggleScroll = (bool, selectorElement = document.documentElement) => {


    const scrollbarWidth = window.innerWidth - selectorElement.clientWidth;


    if (bool === false) {
        $('html').addClass('no-scroll');
        $(selectorElement).css('paddingRight', `${scrollbarWidth}px`);
        // sums up navbar default padding on desktop
        if (window.innerWidth > 1023) {
            $('body>nav').css('paddingRight', `${scrollbarWidth + 32}px`)
        }
    } else if (bool === true) {
        $('html').removeClass('no-scroll');

        $(selectorElement).css('paddingRight', 0);
        // restores navbar default padding on desktop
        if (window.innerWidth > 1023) {
            $('body>nav').css('paddingRight', '32px')
        }
    }
}

export const validateSize = (target) => {
    if (!target.size) return false;
    if (+target.size > 2097152) return false;
    return true;
}
