export const getYoutubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if(match && match[2].length === 11) return match[2]
    
    throw Error(`URL ERROR: could not find a valid youtube id.\n"${url}" is not a valid url. `)
}

export const youtubeToEmbedUrl = (url: string) => `https://www.youtube.com/embed/${getYoutubeID(url)}`