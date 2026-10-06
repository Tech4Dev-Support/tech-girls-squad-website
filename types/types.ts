import { ComponentType, SVGProps } from "react";



export interface Stories_interface {
    title: string,
    description: string,
    image: string,
    volume: number,
    status: string,
    publication_year?: number,
    bg_color: string
}



export interface Ways_To_Help_interface {
    heading: string,
    content: string,
    buttonText: string,
    spotColor: string
}



export interface Bring_it_to_life_data_interface {
    image: string,
    heading: string,
    paragraph: string,
    link_text: string
}

export interface Impact_Stat_interface {
    id: string;
    value: number;
    suffix: string;
    label: string;
    bgColor: string;
    icon: string;
}


type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface FooterSocialLink {
    url: string;
    icon: SocialIcon;
    name: string;
};