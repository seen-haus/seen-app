function createTooltip(el, bindings) {
    let tip = document.createElement('span'),
        content = typeof bindings.value == 'object' ? bindings.value.text : '';

    tip.classList.add('tip');
    tip.innerHTML = content;

    if (content) {
        el.appendChild(tip);

        el.classList.add('tooltip');
        if (content.length > 30) {
            el.classList.add('tooltip--wide');
        }
        const showTooltip = () => {
            if (el.classList.contains('tooltip--active')) {
                el.classList.remove('tooltip--active');
            } else {
                el.classList.add('tooltip--active');
            }
        };
        el.addEventListener('click', showTooltip);
        el.addEventListener('touchstart', showTooltip);
    }
}

export default {
    mounted(el, bindings) {
        createTooltip(el, bindings);
    },

    updated(el, bindings) {
        if (bindings.value.reactive) {
            let element = el.querySelector('.tip');
            if (element) {
                element.remove();
            }
            createTooltip(el, bindings);
        }
    },

    unmounted(el) {
        const showTooltip = () => {
            if (el.classList.contains('tooltip--active')) {
                el.classList.remove('tooltip--active');
            } else {
                el.classList.add('tooltip--active');
            }
        };
        el.removeEventListener('click', showTooltip);
        el.removeEventListener('touchstart', showTooltip);
    }
}
