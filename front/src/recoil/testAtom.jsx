import { atom } from "recoil";

export const mapAtom = atom({
    key: "mapAtom",
    default: [
        { name: "Yeosu", lat: 34.7604, long: 127.6622 },
        { name: "Busan", lat: 35.1795543, long: 129.0756416 },
        { name: "Incheon", lat: 37.4562565, long: 126.7052062 },
        { name: "Gwangju", lat: 35.1595454, long: 126.8526012 },
        { name: "Suwon", lat: 37.2635738, long: 127.0286009 },
        { name: "COEX, Gangnam-gu", lat: 37.5124, long: 127.0588 },
        { name: "Apgujeong, Gangnam-gu", lat: 37.5270, long: 127.0287 },
        { name: "Yeoksam, Gangnam-gu", lat: 37.4997, long: 127.0363 },
        { name: "Hwagok, Gangseo-gu", lat: 37.5410, long: 126.8388 },
        { name: "Banghwa, Gangseo-gu", lat: 37.5776, long: 126.8126 },
        { name: "SNU, Gwanak-gu", lat: 37.4780, long: 126.9527 },
        { name: "Sillim, Gwanak-gu", lat: 37.4840, long: 126.9296 },
        { name: "CAU", lat: 37.5045, long: 126.9576 },
    ],
});
