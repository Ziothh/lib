import { booleanToBinary } from "./boolean";

export const getVimeoID = (url: string) => {
    const regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/
    const match = url.match(regExp);
    
    if (match) return match[2]
    
    throw Error(`URL ERROR: could not find a valid vimeo id.\n"${url}" is not a valid url. `)
}
export const vimeoToEmbedUrl = (url: string, {
        autoPlay = true,
        controls = true
    }= {}
) => `https://player.vimeo.com/video/${getVimeoID(url)}?autoplay=${booleanToBinary(autoPlay)}&controls=${booleanToBinary(controls)}`