import {atom} from "recoil";

export const mapAtom = atom({
    key: "mapAtom",
    default: {
        lat: 37.5586044,
        long: 126.9358398,
        type: "향수공방",
        description: "미디어아트를 가미한 향수공방입니다."
    },
})