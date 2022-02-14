import { readFileDataUrl, readFileInputImagesUrl } from "../DOM/helpers";
import { useBlueprint, useContainer } from "../hooks";

interface DBImageData {
    id: number,
    path: string
    filename: string
    updated_at: string
}

const fetchDBImage = async (dbImage: DBImageData) => {
    const res = await fetch("/storage/" + dbImage.path)
    
    const imageBlob = await res.blob() as any

    return new File([imageBlob], dbImage.filename, {type: imageBlob.type})
}

export const addImageInput = async (container: HTMLDivElement) => {
    // State
    /** @type {Map<HTMLElement, string>}*/
    const images = new Map();

    // Blueprints
    const [newImageInput, imageInput] = useBlueprint<HTMLInputElement>(
        "image-input",
        {
            remove: false,
            autoUpdateBlueprint: true,
            container: container
        },

    ); 
    const [newSubmittedImage, submittedImageContainer] = useBlueprint("submitted-image");

    // Data
    const imageAmount = imageInput.dataset.amount
    const submittedInputName = submittedImageContainer.dataset.name

    // Helper functions
    const renderImages = () => {
        // Keeping the add button
        const addInput = container.firstElementChild
        container.replaceChildren(addInput!)

        images.forEach((url, submittedImg) => {
            submittedImg.childNodes[0].name = imageAmount === "multiple"
                ? `${submittedInputName}[]`
                : submittedInputName
            submittedImg.style = `background-image: url('${url}');`
            submittedImg.onclick = removeSelf
            container.appendChild(submittedImg)
        })
    }

    const removeSelf = ({ target }) => {
        images.delete(target)
        renderImages()
    }

    const addImage = async (image: File, newImgIp = newImageInput()) => {
        let imgUrl
        try {
            imgUrl = await readFileDataUrl(image, imageInput.accept)
        } catch (e) {
            alert(e)
            return
        } 
            // If the image has already been submitted
            for (let url of images.values()) {
                if (url === imgUrl) return
            }
            

            // Create new image container
            const newSubmittedImg = newSubmittedImage()
            newImgIp.removeAttribute("id")
            newImgIp.required = false

            // Adding the image file to the new input
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(image)
            newImgIp.files = dataTransfer.files

            newSubmittedImg.appendChild(newImgIp)

            // Set and render the new image
            imageAmount !== "multiple" && images.clear()
            images.set(newSubmittedImg, imgUrl)
    }


    // Add previous images (from DB)

    (() => {
        const prevImgData: DBImageData[] = Object.values(JSON.parse(container.dataset.previous as string))

        prevImgData.forEach(
            (prevImgData, index) => fetchDBImage(prevImgData)
            .then(imgFile => {
                const hiddenImgIp = newImageInput()
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(imgFile)
                hiddenImgIp.files = dataTransfer.files

                addImage(imgFile, hiddenImgIp)
                .then(renderImages)

                if (index === 0) {
                    imageInput.files = dataTransfer.files
                }
            })
        )
    })();
 


    imageInput.addEventListener("change", async () => {
        //@ts-ignore
        await Promise.all([...imageInput.files].map(f => addImage(f)))
        renderImages()
    })
};