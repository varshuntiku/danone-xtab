export async function *response_itr_line(res: Response, delimiter: string="\n" ) {
    let decoder = new TextDecoder("utf-8");
    const reader = res.body.getReader();
    let pending = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        let chunk = decoder.decode(value, { stream: true });
        let lines = [];
        if(pending){
            chunk = pending + chunk
        }

        lines = chunk.split(delimiter)

        if (lines.length && lines.at(-1) && chunk && lines.at(-1).at(-1) == chunk.at(-1)) {
            pending = lines.pop()
        } else{
            pending = ''
        }

        for (let item of lines) {
            yield item;
        }

    }

    if (pending) {
        yield pending
    }

}