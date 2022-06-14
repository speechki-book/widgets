const WIDGET_URL = process.env.WIDGET_URL;

function widget(options = {}) {
    if (!validate(options)) return;

    let { target } = options;

    if (typeof target === 'string') {
        target = document.querySelector(target);
    }

    if (!target) {
        console.error('Speechki Widget error: No such target element found');
    }

    const iframe = document.createElement('iframe');
    const src = process.env.WIDGET_URL + '/?' + createQuery(options);
    iframe.setAttribute('src', src);
    iframe.style.background = 'transparent';
    iframe.style.visibility = 'visible';
    iframe.style.border = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    target.appendChild(iframe);

    const widget = new Widget(iframe);

    return widget;
}

function validate(options = {}) {
    const requireds = ['target', 'book_language', 'customer_id'];

    const errors = [];
    const entries = Object.entries(options);

    entries.forEach(([key, value]) => {
        if (Boolean(requireds.includes(key) && value)) return;

        errors.push(`Speechki Widget error: Please specify ${key}`);
    });

    if (!errors.length) return true;
    errors.forEach((e) => console.error(e));
}

function createQuery(options) {
    const forward = ['customer_id', 'book_language'];

    const params = new URLSearchParams();
    forward.forEach((p) => params.set(p, options[p]));

    return params.toString();
}

class Widget {
    constructor(instance) {
        this.instance = instance;
        this.subs = {};

        window.addEventListener('message', this.select.bind(this));
        window.addEventListener('beforeunload', () => {
            window.removeEventListener('message', this.select.bind(this));
        });
    }

    select({ data }) {
        if (data.event === 'speechki-select') {
            this.fire('select', this.data(data));
        }
    }

    data(data) {
        data.event = data.event.replace('speechki-', '');
        return data;
    }

    on(event, handler) {
        let handlers = this.subs[event];

        if (!handlers) {
            handlers = this.subs[event] = [];
        }

        handlers.push(handler);

        return {
            name: event,
            callback: handler,
            off: (event, handler) => this.off(event, handler),
        };
    }

    off(event, handler) {
        if (!this.handlers[event]) return;

        let handlers = this.subs[event];

        if (handler) {
            subs = subs.filter((h) => h != fn);
            return;
        }

        handlers.length = 0;
    }

    offAll() {
        for (let prop in this.subs) {
            if (this.subs.hasOwnProperty(prop)) {
                this.off(prop);
            }
        }
    }

    fire(event, ...args) {
        let handlers = this.subs[event];

        if (!handlers || !handlers.length) return;

        handlers.forEach((h) => {
            h(...args);
        });
    }

    changeLanguage(language) {
        if (!language) {
            console.error('Speechki Widget: Please specify language');
            return;
        }

        this.instance.contentWindow.postMessage(
            {
                event: 'change_language',
                data: {
                    language,
                },
            },
            '*'
        );
    }
}

export default {
    widget,
};
