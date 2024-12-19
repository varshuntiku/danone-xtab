export default class CustomEventTarget<K extends Record<string, string>>{
    private eventTarget = new EventTarget()

    dispatchEvent(type: K[keyof K], eventInitDict?: CustomEventInit<unknown>) {
        this.eventTarget.dispatchEvent(new CustomEvent(type, eventInitDict ))
    }

    addEventListener(type: K[keyof K], callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        this.eventTarget.addEventListener(type, callback, options)
    }

    removeEventListener(type: K[keyof K], callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        this.eventTarget.removeEventListener(type, callback, options)
    }

}