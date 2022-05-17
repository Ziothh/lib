import { getAllByDataAttribute, getByDataAttribute } from "../DOM"

class GalleryImage {
    public image: string

    constructor (
        readonly element: HTMLElement, 
        readonly ID: number,
        readonly gallery: ImageGalleryController
    ) {
        this.image = this.element.dataset.image!

        this.element.addEventListener("click", () => {
            this.gallery.setCurrentImage(this.ID)
        })
    }
}

export default class ImageGalleryController {
    readonly classNames = {
        active: "active",
        singleImage: "single-image"
    }
    readonly dataRoles = {
        container: "imageGallery",
        image: "galleryImage",
        displayContainer: "displayContainer",
        buttons: {
            previous: "previousButton",
            next: "nextButton"
        }
    }

    public container: HTMLElement

    public images: GalleryImage[]
    public currentIndex!: number

    public buttons: {
        previous: HTMLButtonElement
        next: HTMLButtonElement
    }

    public displayedImageContainer: HTMLDivElement


    constructor (galleryElement?: HTMLElement ) {
        this.container = galleryElement || getByDataAttribute("role", this.dataRoles.container)!

        // HTML elements with image data
        this.images = Array.from(
            getAllByDataAttribute(
                "role", 
                this.dataRoles.image,
                this.container
            )
        ).map((img, index) => new GalleryImage(img, index, this))

        // Navigation Buttons
        const previousBtn =  getByDataAttribute(
            "role", this.dataRoles.buttons.previous
        ) as HTMLButtonElement
        const nextBtn =  getByDataAttribute(
            "role", this.dataRoles.buttons.next
        ) as HTMLButtonElement
        
        if (this.images.length === 0) {throw Error("There are no images in this gallery")}
        else if (this.images.length === 1) {
            this.container.classList.add(this.classNames.singleImage)
        } else {
            nextBtn.onclick = () => this.next()
            previousBtn.onclick = () => this.previous()
        }

        this.buttons = {previous: previousBtn, next: nextBtn}
        

        // Display container
        this.displayedImageContainer = getByDataAttribute(
            "role",
            this.dataRoles.displayContainer
        ) as HTMLDivElement

        // Setting the default active image
        this.setCurrentImage(0)
    }

    get currentImage() {
        return this.images[this.currentIndex]
    }

    get length() {
        return this.images.length
    }

    setCurrentImage = (imageIndex: number) => {
        if (this.currentIndex === imageIndex) return
        if (
            imageIndex < 0 
            || imageIndex > this.length - 1
        ) throw Error(`Invalid index ${imageIndex} in ImageGallery with a length of ${this.length}`)
        
        // Old
        this.currentImage?.element.classList.remove(this.classNames.active)

        // New
        this.currentIndex = imageIndex
        this.currentImage.element.classList.add(this.classNames.active)

        this.displayedImageContainer.style.backgroundImage = this.currentImage.image

        // Setting button state
        this.buttons.previous.disabled = this.currentIndex === 0 ? true : false
        this.buttons.next.disabled = this.currentIndex === this.length - 1 ? true : false

        return this
    }

    next = () => this.setCurrentImage(this.currentIndex + 1)
    previous = () => this.setCurrentImage(this.currentIndex - 1)
}