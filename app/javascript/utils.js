export const testPreview = (url) => {
    const img = new Image();
    return new Promise((resolve, reject) => {
        img.src = url;
        console.log(img.src)
        img.onload = () => resolve(img.src);
        img.onerror = () => reject("Error while loading image.");
    })
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
