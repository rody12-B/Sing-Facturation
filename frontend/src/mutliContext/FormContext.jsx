import { createContext, useContext, useState } from "react";
import axios from "axios";
import uploadImage from "../utils/uploadImage";
import { validateEmail, validatePassword, validateAvatar } from "../utils/helper"; 

const FormContext = createContext();

export function useFormContext() {
  return useContext(FormContext);
}

export function FormProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);

  const [formData, setFormData] = useState({
    personnelInfo: { raisonSocial: "", nif: "", date: "", statut: "", avatar: null },
    contactInfo: { email: "", codePostal: "", region: "", num: "" },
    activiteInfo: { typeActivite: "", tva: false, password: "", confirmPassword: "" },
  });

  const updateFormData = (section, data) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], ...data } }));
    setErrors({});
  };

  // --- Validation d'une étape (async pour vérifier l'email) ---
  const validateStep = async (step) => {
    const newErrors = {};

    // --- Étape 1 : Informations de base ---
    if (step === 1) {
      if (!formData.personnelInfo.raisonSocial)
        newErrors.raisonSocial = "La raison sociale est obligatoire";

      if (!formData.personnelInfo.nif)
        newErrors.nif = "La NIF est obligatoire";

      if (!formData.personnelInfo.date)
        newErrors.date = "La date est obligatoire";

      if (!formData.personnelInfo.statut)
        newErrors.statut = "Le statut est obligatoire";

      const avatarError = validateAvatar(formData.personnelInfo.avatar);
      if (avatarError) newErrors.avatar = avatarError;
    }

    // --- Étape 2 : Coordonnées ---
    if (step === 2) {
      const emailError = validateEmail(formData.contactInfo.email);
      if (emailError) {
        newErrors.email = emailError;
      } else {
        // Vérification si l'email existe déjà
        try {
          const res = await axios.post("http://localhost:8081/api/auth/check-email", {
            email: formData.contactInfo.email
          });
          if (res.data.exists) newErrors.email = "Cet e-mail est déjà utilisé";
        } catch (err) {
          newErrors.email = "Impossible de vérifier l’e-mail pour le moment";
        }
      }

      if (!formData.contactInfo.codePostal)
        newErrors.codePostal = "Le code postal est obligatoire";

      if (!formData.contactInfo.region)
        newErrors.region = "Veuillez renseigner votre region ";

      if (!formData.contactInfo.num)
        newErrors.num = "Le numéro est obligatoire";
    }

    // --- Étape 3 : Activité ---
    if (step === 3) {
      if (!formData.activiteInfo.typeActivite)
        newErrors.typeActivite = "Le type d'activité est obligatoire";

      const passwordError = validatePassword(formData.activiteInfo.password);
      if (passwordError) newErrors.password = passwordError;

      if (!passwordError && formData.activiteInfo.password !== formData.activiteInfo.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const steps = [
    { id: 1, title: "Identification", description: "Informations de base" },
    { id: 2, title: "Coordonnées", description: "Informations de contact" },
    { id: 3, title: "Activité", description: "Informations sur l'activité" },
    { id: 4, title: "Validation", description: "Vérification finale" },
  ];

  const nextStep = async () => {
    if (await validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Vérifier toutes les étapes
    for (let step = 1; step <= 3; step++) {
      if (!(await validateStep(step))) {
        setCurrentStep(step);
        return;
      }
    }

    try {
      // Upload de l'avatar si présent
      let avatarUrl = "";
      const avatarFile = formData.personnelInfo.avatar;
      if (avatarFile) {
        const imgUploadRes = await uploadImage(avatarFile);
        avatarUrl = imgUploadRes.imageUrl || "";
      }

      // Construire le payload complet
      const payload = {
        personnelInfo: { ...formData.personnelInfo, avatar: avatarUrl },
        contactInfo: { ...formData.contactInfo }, 
        activiteInfo: { ...formData.activiteInfo },
      };

      // Envoyer au backend pour l'inscription
      const response = await axios.post("http://localhost:8081/api/auth/register", payload);

      console.log("Inscription réussie :", response.data);
      setIsSubmited(true);

    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.response?.data?.message || error.message);
      setErrors({ submit: error.response?.data?.message || "Erreur lors de l'inscription" });
    }
  };

  const value = {
    steps,
    currentStep,
    formData,
    errors,
    updateFormData,
    nextStep,
    prevStep,
    handleSubmit,
    isSubmited,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
