export let nanoid=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"");

export function buttonVariantToClass(variant: string, size?: string) {
    let className = "MinervaButton";
    const variants = ["outlined", "text"];
    const sizes = ["small"];
    if (variants.includes(variant)) {
        className += "-"+variant
    }
    if (sizes.includes(size)) {
        className += "-"+size
    }
    return className;
}