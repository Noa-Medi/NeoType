import { hashDecoder } from '../component/hashDecoder.js';
export function getCategoryName() {
    let hashLocation = hashDecoder(window.location.hash);
    return hashLocation;
}