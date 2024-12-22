import { LatLng } from "react-native-maps";

export interface Localization {
    id: string;
    nome: string;
    latitude: number;
    longitude: number;
    cor: string; // Pode ser um código hexadecimal ou nome de cor
}