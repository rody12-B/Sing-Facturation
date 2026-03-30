import { 
    PieChart, Wallet, FileText, Users, 
    ShieldCheck, Smartphone, Zap, BarChart3 
  } from 'lucide-react';
  
  export const NAV_LINKS = [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Ressources', href: '#resources' },
  ];
  
  export const STATS = [
    { icon: Users, label: 'Entreprises actives', value: '2,400+' },
    { icon: Wallet, label: 'Volume traité', value: '50M €' },
    { icon: FileText, label: 'Factures générées', value: '150k+' }
  ];
  
  // On remplace "JobSeeker" par "Gestion Commerciale"
  export const MANAGEMENT_FEATURES = [
    {
      icon: FileText,
      title: "Facturation Intelligente",
      description: "Créez, envoyez et suivez vos factures et devis en quelques clics. Automatisez les relances pour être payé plus vite."
    },
    {
      icon: Wallet,
      title: "Suivi de Trésorerie",
      description: "Connectez vos comptes bancaires et visualisez vos flux de trésorerie en temps réel pour anticiper l'avenir."
    },
    {
      icon: Users,
      title: "CRM Intégré",
      description: "Centralisez vos contacts clients et fournisseurs. Gardez un historique complet de chaque interaction commerciale."
    }
  ];
  
  // On remplace "Employer" par "Pilotage & Analytics"
  export const ANALYTICS_FEATURES = [
    {
      icon: BarChart3,
      title: "Rapports Détaillés",
      description: "Accédez à des tableaux de bord dynamiques pour analyser votre chiffre d'affaires, vos marges et vos dépenses."
    },
    {
      icon: ShieldCheck,
      title: "Conformité & Sécurité",
      description: "Vos données sont chiffrées et vos documents comptables respectent les normes fiscales en vigueur."
    },
    {
      icon: Zap,
      title: "Automatisation",
      description: "Gagnez du temps en automatisant la récurrence des factures et la catégorisation de vos dépenses."
    }
  ];