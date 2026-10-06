import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import XIcon from "@/components/icons/XIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import { FooterSocialLink } from "@/types/types"



export const footer_explore_data = [
    {
        label: "About",
        path: "#about"
    },
    {
        label: "The Books",
        path: "#the_books"
    },
    {
        label: "Our Impact",
        path: "#impact"
    }
]


export const footer_get_involved_data = [
    {
        label: "Get Volume 1",
        path: "/"
    },
    {
        label: "Gift a Book",
        path: "/"
    },
    {
        label: "Make a Donation",
        path: "/"
    },
    {
        label: "Become a Partner",
        path: "/"
    },
]



export const footer_social_links: FooterSocialLink[] = [
    {
        url: "https://www.instagram.com/Tech4Dev",
        icon: InstagramIcon,
        name: "Instagram",
    },
    {
        url: "https://x.com/Tech4DevHQ",
        icon: XIcon,
        name: "X",
    },
    {
        url: "https://www.facebook.com/Tech4DevHQ/",
        icon: FacebookIcon,
        name: "Facebook",
    },
    {
        url: "https://www.linkedin.com/school/tech4dev/",
        icon: LinkedInIcon,
        name: "LinkedIn",
    },
    {
        url: "https://www.youtube.com/@tech4devhq618",
        icon: YouTubeIcon,
        name: "YouTube",
    },
];