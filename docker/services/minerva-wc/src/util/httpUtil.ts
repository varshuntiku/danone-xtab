export function fetchProcessor(r: Response) {
    if (r.ok) {
        return r.json()
    } else {
        throw Error(r.statusText)
    }
}