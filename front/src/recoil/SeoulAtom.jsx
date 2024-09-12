import { atom } from "recoil";

export const SeoulAtom = atom({
    key: "SeoulAtom",
    default: {
        lat: 37.5665,
        long: 126.9780,
    },
})