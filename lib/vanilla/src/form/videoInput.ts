import { createElement } from "../DOM"
import { useEnter } from "../hooks/events"

export const addVideoInput = (videoInput: HTMLInputElement) => {
    const container = (videoInput.parentElement as  HTMLDivElement)


    const hiddenInput = (container.querySelector("input[type='hidden']") as HTMLInputElement)

    const videoUrlMap = new Map<HTMLLIElement, string>();

    (container.querySelector("button[type='button']") as HTMLButtonElement)
    .addEventListener("click", () => addVideoUrl(videoInput.value))

    const submittedVideosList = createElement("ul", {class: "submitted-videos-list"})
    container.parentElement!.appendChild(submittedVideosList)

    const renderSubmittedVideos = () => {
        submittedVideosList.replaceChildren(...videoUrlMap.keys())
        hiddenInput.value = JSON.stringify(Array.from(videoUrlMap.values()))

    }

    useEnter(videoInput, ({target}) => addVideoUrl((target as HTMLInputElement).value))

    const removeVideoUrl = (submittedVideo: HTMLLIElement) => {
        videoUrlMap.delete(submittedVideo)
        renderSubmittedVideos()
    }

    const addVideoUrl = (videoUrl: string) => {
        if (videoUrl === "") return

        const urlType = videoUrl.match("youtube.com") ? "youtube" : videoUrl.match("vimeo.com") ? "vimeo-v" : undefined

        if (urlType === undefined) return alert("The video must be hosted on youtube or vimeo")

        const submittedVideo = createElement(
            "li", 
            {
                class: "submitted-video",
                innerText: videoUrl,
                title: "Delete this url"
            },
            urlType && createElement("i", {class: `fab fa-${urlType}`})
        ) as HTMLLIElement

        submittedVideo.onclick = () => removeVideoUrl(submittedVideo)

        videoUrlMap.set(submittedVideo, videoUrl)
        
        renderSubmittedVideos()
    }


    // Add previous videos
    (() => {
        const prevVideos: string[] = JSON.parse(hiddenInput.value)
        prevVideos.forEach(
            vid => addVideoUrl(vid)
        )
    })()
}