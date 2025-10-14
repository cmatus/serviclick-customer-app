/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";

import Card from "@/components/ui/card";
import InputText from "@/components/ui/input-text";

import { useAuth } from "@/store/hooks";

const Login = () => {
  const { authValidate } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    authValidate(email, password);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-full gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15`}>
      <Card className={`max-w-[500px]`}>
        <div className="flex flex-col gap-2 p-6 lg:p-10">
          <div className="flex items-center justify-center pb-6 gap-2">
            <img src="/logo-icon.png" alt="Logo" className="w-18 h-18" />
            <span className={`text-4xl font-semibold`}>ServiClick</span>
          </div>
          <InputText
            label="Correo electrónico"
            type="text"
            value={email}
            onChange={(value: string) => setEmail(value)}
          />
          <InputText
            label="Contraseña"
            type="password"
            value={password}
            onChange={(value: string) => setPassword(value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4">
            Iniciar sesión
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
