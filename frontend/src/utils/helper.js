 
// validation de la fonction
export const validateEmail = (email) => {
    if (!email.trim()) return "L'adresse Email est obligatoire";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Veuillez entrer une adresse Email valide"
    return '';
   };

export const validatePassword = (password) => {
    if(!password) return " Veuillez entrer votre mot de passe";
    if (password.length < 8 ) return "Votre mot de passe doit contenir au moins 8 caratères";
    if (!/(?=.*[a-z])/.test(password))
        return "Votre mot de passe doit contenir au moins une lettre miniscule";
    if (!/(?=.*[A-Z])/.test(password))
        return "Votre mot de passe doit contenir au moins une lettre majiscule";
    if (!/(?=.*[0-9])/.test(password))
        return "Votre mot de passe doit contenir au moins un chiffre";
    return "";
};

export const validateAvatar = (file) => {
    if (!file) return ""; // l'avatar est optionnel

    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedType.includes(file.type)) {
        return " Avatar doit etre en format JPG ou PNG";
    }
    const maxSize = 5 * 1024 * 1024; //5MB
    if (file.size > maxSize)  {
        return " Le format de l'Avatar doit etre moins de 5MB";
    }
    return "";
};