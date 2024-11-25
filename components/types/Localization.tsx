import { LatLng } from "react-native-maps";

export interface Localization {
    id: string;
    nome: string;
    posicao: LatLng;
    cor: string; // Pode ser um código hexadecimal ou nome de cor
}