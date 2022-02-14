import {Properties as CSSProps} from "csstype"

declare global{ 
    namespace MyTypes {
        namespace CSS {
            type Properties = CSSProps
        }
    }
}