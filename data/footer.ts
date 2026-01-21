import { IFooter } from "@/types";

export const footerData: IFooter[] = [
    {
        title: "Produit",
        links: [
            { name: "Accueil", href: "/" },
            { name: "Support", href: "#support" },
            { name: "Tarifs", href: "#pricing" },
            { name: "Documentation", href: "#docs" },
        ]
    },
    {
        title: "Ressources",
        links: [
            { name: "Blog", href: "#blog" },
            { name: "Communauté", href: "#community" },
            { name: "À propos", href: "#about" },
            { name: "Carrières", href: "#careers" },
        ]
    },
    {
        title: "Légal",
        links: [
            { name: "Confidentialité", href: "#privacy" },
            { name: "Conditions", href: "#terms" },
        ]
    }
];
