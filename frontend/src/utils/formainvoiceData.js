export const formainvoiceData = (invoiceData) => {
    const {
        title = {},
        company = {},
        client = {},
        service = {},
        invoice = {},
        items = [],
        account = {},
        payment = {},
        notes = "",
        statut = "attente",
    } = invoiceData || {};

    const currencySymbol = "FCFA";

    // Calcul des totaux par article
    let totalRemise = 0;
    let subtotal = 0; 
    let totalTVA = 0;

    const itemsWithTTC = items.map(item => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        const tva = Number(item.tva) || 0;

        let totalHT = qty * price;

        // Calcul remise
        let remise = 0;
        if (item.showRemise && item.remiseValue > 0) {
            if (item.remiseType === "percent") {
                remise = (totalHT * item.remiseValue) / 100;
            } else if (item.remiseType === "fixed") {
                remise = item.remiseValue;
            }
        } 
        // Total HT après remise (jamais négatif)
        const totalHTAfterRemise = Math.max(totalHT - remise, 0);

        // Calcul TVA sur le montant après remise
        const tvaAmount = (totalHTAfterRemise * tva) / 100;

        const totalTTC = totalHTAfterRemise + tvaAmount ;

        // Cumuler les totaux globaux
        subtotal += totalHTAfterRemise;
        totalTVA += tvaAmount;
        totalRemise += remise;

        return {
            ...item,
            totalBeforeRemise: totalHT,
            remiseApplied: remise,
            total: totalHTAfterRemise,
            totalTTC,
            tvaAmount
        };
    });

    const css = subtotal * 0.01 ;
    const total = subtotal + css + totalTVA;

    return {
        // Titre et logo
        title,
        companyName: company.name,
        companyEmail: company.email,
        companyNumber: company.number,
        companyAddress: company.address,
        companyLogo: company.logo,

        // Client
        clientName: client.raisonSocial,
        clientRepresentative: client.representative,
        clientPhone: client.phone,
        clientAddress: client.address,
        clientEmail: client.email,

        // Service
        serviceSubject: service.subject,

        // Facture
        invoiceNumber: invoice.number,
        invoiceDate: invoice.date,
        statut,

        // Compte bancaire / méthode de paiement
        accountMethod: account.method,
        accountNumber: account.number,
        accountRIB: account.rib,

        // Paiement
        advancePercent: payment.advancePercent,
        advanceAmount: payment.advanceAmount,
        advanceDate: payment.advanceDate,
        remainingPercent: payment.remainingPercent,
        remainingAmount: payment.remainingAmount,
        remainingDate: payment.remainingDate,

        // Montants
        currencySymbol,
        items: itemsWithTTC,

        
        totals: {
            subtotal,
            totalRemise,
            totalTVA,
            css,
            total
        },

        notes   
    };
};
