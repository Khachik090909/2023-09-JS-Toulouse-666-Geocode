import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useCurrentUserContext } from "../../../contexte/CurrentUserContext";
import contact from "./config.json";
import Form from "../../form/form";
import Alert from "../../alert/alert";
import "../RegistrationPage/RegistrationForm.scss";

const { VITE_BACKEND_URL } = import.meta.env;

function ContactPage({ isContactModal, setIsContactModal }) {
  const { auth } = useCurrentUserContext();
  const [isErrors, setIsErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleOnClickCloseModal = () => {
    setIsContactModal(!isContactModal);
  };
  const isConnected = () => {
    if (auth) {
      contact.name.value = auth.firstname + auth.name;
      contact.email.value = auth.email;
      return true;
    }
    return false;
  };

  const FormPostData = async (e) => {
    e.preventDefault();

    // Créer un objet FormData à partir de l'événement de formulaire
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Spécifier le type de contenu JSON
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data), // Convertir l'objet data en chaîne JSON
      });
      if (!response.ok) {
        const dataresponse = await response.json();
        if (dataresponse.validationErrors.length > 0) {
          setIsErrors(dataresponse.validationErrors);
        }
        throw new Error("Erreur lors de l'inscription");
      } else {
        setIsErrors(null);
        setIsSubmit(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const verfiAuth = isConnected();
  useEffect(() => {
    if (isSubmit) {
      const timerId = setTimeout(() => {
        setIsContactModal(false);
      }, 2000);

      return () => {
        // Assurez-vous de nettoyer le timer si le composant est démonté avant l'expiration du délai
        clearTimeout(timerId);
      };
    }
    return undefined;
  }, [isSubmit, setIsContactModal]);
  return (
    <div className="background-modal">
      {(isErrors || isSubmit) && <Alert errors={isErrors} submit={isSubmit} />}
      <div className="registration-contain">
        <div>
          <button
            className="btn-close-modal"
            type="button"
            onClick={handleOnClickCloseModal}
          >
            X
          </button>
        </div>
        <Form
          data={contact}
          FormPostData={FormPostData}
          isAuth={verfiAuth}
          route="contact"
        />
      </div>
    </div>
  );
}
export default ContactPage;
ContactPage.defaultProps = {
  isContactModal: false,
  setIsContactModal: null,
};
ContactPage.propTypes = {
  isContactModal: PropTypes.bool,
  setIsContactModal: PropTypes.func,
};
