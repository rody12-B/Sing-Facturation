import {
    LayoutDashboard,
    Plus,
    ClipboardPen,
    Banknote,
    Settings,
    File,
    Bus,
    ClipboardList,
    FolderCog,
    BanknoteArrowUp,
    ShoppingCart,
    HandHelping,
    BookUp2,
    MessageSquareDiff,
    CalendarCog,
    Database,
    Users,
    BadgeEuro,
    FileText,
    Building2,
    ArrowRightToLine,
    ClipboardCheck,
    
} from "lucide-react";

export const NAVIGATION_MENU = [
    { 
        id: "menu-dash", 
        name: "Dashboard", 
        icon: LayoutDashboard,
        path: "/menu-dash"
    },
    { 
        id: "menu-facture", 
        name: "Facture & Devis", 
        icon: FileText,
        path: "/menu-facture",
        children: [
            { id: "creer-facture", name: "Creer une facture", icon: Plus, path: "creer-facture" },
            { id: "faire-devis", name: "Faire un devis", icon: ClipboardList, path: "faire-devis" },
            { id: "produits-services", name: "Produits & Services", icon: FolderCog, path: "produits-services" },
            { id: "gestion-ventes", name: "Gestion Ventes", icon: BanknoteArrowUp, path: "gestion-ventes" },
        ]
    },
    { 
        id: "menu-charge", 
        name: "Gestion de Charges", 
        icon: ClipboardPen,
        path: "/menu-charge",
        children: [
            { id: "achats-consommes", name: "Achats consommés", icon: ShoppingCart, path: "achats-consommes" },
            { id: "services-exterieurs", name: "Services exterieurs", icon: HandHelping, path: "services-exterieurs" },
            { id: "transports", name: "Transports consommés", icon: Bus, path: "transports" },
            { id: "charges-personnel", name: "Charges du personnel", icon: BookUp2, path: "charges-personnel" },
            { id: "charges-fiscale-sociale", name: "Charges fiscale & sociale", icon: MessageSquareDiff, path: "charges-fiscale-sociale" },
            { id: "charges-divers", name: "Charges divers", icon: CalendarCog, path: "charges-divers" },
        ]
    },
    { 
        id: "menu-tresorie", 
        name: "Gestion tresorie", 
        icon: Banknote,
        path: "/menu-tresorie",
        children: [
            { id: "generer-encaissement", name: "Generer encaissement", icon: ClipboardCheck, path: "generer-encaissement" },
            { id: "generer-decaissement", name: "Generer decaissement", icon: Building2, path: "generer-decaissement" },
            { id: "gerer-compte-tresorie", name: "Gerer compte Trésorie", icon: ArrowRightToLine, path: "gerer-compte-tresorie" },
        ]
    },
    { 
        id: "menu-parametres", 
        name: "Paramètres", 
        icon: Settings,
        path: "/menu-parametres",
        children: [
            { id: "config-db", name: "Configurer vos données", icon: Database, path: "config-db" },
            { id: "clients", name: "Gestion des clients", icon: Users, path: "clients" },
            { id: "fiscaux", name: "Parametres fiscaux", icon: BadgeEuro, path: "fiscaux" },
            { id: "fournisseurs", name: "Gestion des documents", icon: FileText, path: "fournisseurs" },
        ]
    },
];
