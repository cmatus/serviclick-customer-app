/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";

import Card from "@/components/ui/card";
import InputText from "@/components/ui/input-text";

import { useAuth } from "@/store/hooks";

// Utilidades para manejo de RUT
const cleanRut = (rut: string): string => {
  // Eliminar todo excepto números y K
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
};

const formatRut = (rut: string): string => {
  // Limpiar RUT
  const cleaned = cleanRut(rut);

  if (cleaned.length === 0) return "";

  // Separar número del dígito verificador
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (body.length === 0) return cleaned;

  // Formatear con puntos: 99.999.999-X
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedBody}-${dv}`;
};

const validateRut = (rut: string): boolean => {
  // Limpiar RUT
  const cleaned = cleanRut(rut);

  if (cleaned.length < 2) return false;

  // Separar número del dígito verificador
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(body)) return false;

  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedDv = 11 - remainder;

  let expectedDv: string;
  if (calculatedDv === 11) {
    expectedDv = "0";
  } else if (calculatedDv === 10) {
    expectedDv = "K";
  } else {
    expectedDv = calculatedDv.toString();
  }

  return dv === expectedDv;
};

// Validar formato de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Login = () => {
  const {
    authValidate,
    authSendPasswordRecoveryEmail,
    authIsError,
    authError,
    authIsLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryRut, setRecoveryRut] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [rutError, setRutError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryError, setRecoveryError] = useState(false);

  // Validar si el formulario de login es válido
  const isLoginFormValid =
    email.length > 0 &&
    password.length > 0 &&
    !loginEmailError &&
    validateEmail(email);

  // Validar si el formulario de recuperación es válido
  const isRecoveryFormValid =
    recoveryRut.length > 0 &&
    recoveryEmail.length > 0 &&
    !rutError &&
    !emailError &&
    validateRut(cleanRut(recoveryRut)) &&
    validateEmail(recoveryEmail);

  const handleLogin = () => {
    // Validar email antes de enviar
    if (!validateEmail(email)) {
      setLoginEmailError("Correo electrónico inválido");
      return;
    }

    authValidate(email, password);
  };

  const handleLoginEmailChange = (value: string) => {
    setEmail(value);

    // Limpiar error al escribir
    if (loginEmailError) setLoginEmailError("");
  };

  const handleLoginEmailBlur = () => {
    if (email.length === 0) {
      setLoginEmailError("");
      return;
    }

    // Validar email
    if (!validateEmail(email)) {
      setLoginEmailError("Correo electrónico inválido");
      return;
    }

    setLoginEmailError("");
  };

  const handleRutChange = (value: string) => {
    // Permitir solo números y K/k, y limitar la K solo al final
    const cleaned = value.replace(/[^0-9kK]/g, "");

    // Si hay K, debe estar al final
    if (cleaned.includes("K") || cleaned.includes("k")) {
      const lastChar = cleaned.slice(-1).toUpperCase();
      const body = cleaned.slice(0, -1).replace(/[kK]/g, "");
      setRecoveryRut(body + lastChar);
    } else {
      setRecoveryRut(cleaned);
    }

    // Limpiar error al escribir
    if (rutError) setRutError("");
  };

  const handleRutBlur = () => {
    if (recoveryRut.length === 0) {
      setRutError("");
      return;
    }

    // Validar RUT
    if (!validateRut(recoveryRut)) {
      setRutError("RUT inválido");
      return;
    }

    // Formatear con puntos y guión
    setRecoveryRut(formatRut(recoveryRut));
    setRutError("");
  };

  const handleRutFocus = () => {
    // Limpiar formato (sin puntos ni guión)
    setRecoveryRut(cleanRut(recoveryRut));
  };

  const handleEmailChange = (value: string) => {
    setRecoveryEmail(value);

    // Limpiar error al escribir
    if (emailError) setEmailError("");
  };

  const handleEmailBlur = () => {
    if (recoveryEmail.length === 0) {
      setEmailError("");
      return;
    }

    // Validar email
    if (!validateEmail(recoveryEmail)) {
      setEmailError("Correo electrónico inválido");
      return;
    }

    setEmailError("");
  };

  const handleRecoverySubmit = async () => {
    // Validar RUT antes de enviar
    const cleaned = cleanRut(recoveryRut);

    if (!validateRut(cleaned)) {
      setRutError("RUT inválido");
      return;
    }

    // Validar email antes de enviar
    if (!validateEmail(recoveryEmail)) {
      setEmailError("Correo electrónico inválido");
      return;
    }

    // Limpiar mensajes previos
    setRecoverySuccess(false);
    setRecoveryError(false);

    // Enviar con formato (99.999.999-X)
    const formattedRut = formatRut(cleaned);
    await authSendPasswordRecoveryEmail(formattedRut, recoveryEmail);

    // Verificar resultado después de la llamada
    // Usamos setTimeout para esperar a que el store se actualice
    setTimeout(() => {
      if (authIsError) {
        setRecoveryError(true);
      } else {
        setRecoverySuccess(true);
        // Limpiar campos después de éxito
        setRecoveryRut("");
        setRecoveryEmail("");
      }
    }, 100);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-full gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15`}>
      <Card className={`max-w-[500px]`}>
        {!showForgotPassword ? (
          // Formulario de Login
          <div className="flex flex-col gap-2 p-6 lg:p-10">
            <div className="flex items-center justify-center pb-6 gap-2">
              <img src="/logo-icon.png" alt="Logo" className="w-18 h-18" />
              <span className={`text-4xl font-semibold`}>ServiClick</span>
            </div>
            <InputText
              label="Correo electrónico"
              type="text"
              value={email}
              onChange={handleLoginEmailChange}
              onBlur={handleLoginEmailBlur}
              error={loginEmailError}
            />
            <InputText
              label="Contraseña"
              type="password"
              value={password}
              onChange={(value: string) => setPassword(value)}
            />
            {authIsError && authError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-2">
                <p className="text-red-400 text-sm text-center">
                  Credenciales inválidas
                </p>
              </div>
            )}
            <button
              onClick={handleLogin}
              disabled={!isLoginFormValid}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 ${
                isLoginFormValid
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}>
              Iniciar sesión
            </button>
            <button
              onClick={() => setShowForgotPassword(true)}
              className="w-full text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2 transition-colors mt-2">
              Olvidé mi contraseña
            </button>
          </div>
        ) : (
          // Formulario de Recuperación de Contraseña
          <div className="flex flex-col gap-2 p-6 lg:p-10">
            <div className="flex items-center justify-center pb-6 gap-2">
              <img src="/logo-icon.png" alt="Logo" className="w-18 h-18" />
              <span className={`text-4xl font-semibold`}>ServiClick</span>
            </div>
            <h2 className="text-xl font-semibold text-white text-center mb-2">
              Recuperar Contraseña
            </h2>
            <p className="text-[#e6eaf3]/60 text-sm text-center mb-4">
              Ingresa tu RUT y correo electrónico para recuperar tu contraseña
            </p>
            <InputText
              label="RUT"
              type="text"
              value={recoveryRut}
              onChange={handleRutChange}
              onFocus={handleRutFocus}
              onBlur={handleRutBlur}
              // placeholder="12.345.678-9"
              error={rutError}
            />
            <InputText
              label="Correo electrónico"
              type="text"
              value={recoveryEmail}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              // placeholder="correo@ejemplo.com"
              error={emailError}
            />
            {recoverySuccess && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mt-2">
                <p className="text-green-400 text-sm text-center">
                  Contraseña enviada a su correo
                </p>
              </div>
            )}
            {recoveryError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-2">
                <p className="text-red-400 text-sm text-center">
                  Rut y/o correo inválido
                </p>
              </div>
            )}
            <button
              onClick={handleRecoverySubmit}
              disabled={!isRecoveryFormValid || authIsLoading}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 ${
                isRecoveryFormValid && !authIsLoading
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}>
              {authIsLoading ? "Enviando..." : "Enviar"}
            </button>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setRecoverySuccess(false);
                setRecoveryError(false);
                setRecoveryRut("");
                setRecoveryEmail("");
                setRutError("");
                setEmailError("");
              }}
              className="w-full text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2 transition-colors mt-2">
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
