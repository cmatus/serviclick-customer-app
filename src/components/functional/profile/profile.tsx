/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import Form, { FormField } from "@/components/ui/form";
import DataTableCard from "@/components/ui/data-table-card";

import { useUI, useInsured } from "@/store/hooks";

const Profile = () => {
  const { uiSetTitle } = useUI();
  const { insuredItem } = useInsured();

  const titularFormFields: FormField[] = [
    {
      label: "RUT",
      type: "text",
      variable: "rut",
      value: insuredItem.insured.rut,
    },
    {
      label: "Fecha de Nacimiento",
      type: "date",
      variable: "birthdate",
      value: insuredItem.insured.birthdate,
    },
    {
      label: "Nombres",
      type: "text",
      variable: "name",
      value: insuredItem.insured.name,
      fullWidth: true,
    },
    {
      label: "Apellido Paterno",
      type: "text",
      variable: "paternalLastname",
      value: insuredItem.insured.paternalLastname,
    },
    {
      label: "Apellido Materno",
      type: "text",
      variable: "maternalLastname",
      value: insuredItem.insured.maternalLastname,
    },
    {
      label: "Dirección",
      type: "text",
      variable: "address",
      value: insuredItem.insured.address,
      fullWidth: true,
    },
    {
      label: "Comuna",
      type: "text",
      variable: "district",
      value: insuredItem.insured.district,
      fullWidth: true,
    },
    {
      label: "Teléfono",
      type: "text",
      variable: "phone",
      value: insuredItem.insured.phone,
    },
    {
      label: "Correo Electrónico",
      type: "text",
      variable: "email",
      value: insuredItem.insured.email,
    },
  ];

  const cargasCardData = {
    layout: [
      {
        cells: [
          {
            key: "fullName",
            position: "full-width" as const,
            align: "left" as const,
            highlight: true,
          },
        ],
      },
      {
        cells: [
          { key: "rut", position: "left" as const, align: "left" as const },
          {
            key: "birthdate",
            position: "center" as const,
            align: "center" as const,
          },
          {
            key: "relationship",
            position: "right" as const,
            align: "right" as const,
            cellType: "badge" as const,
            cellProps: { variant: "default" as const },
          },
        ],
      },
      {
        cells: [
          {
            key: "address",
            position: "full-width" as const,
            align: "left" as const,
          },
        ],
      },
      {
        cells: [
          {
            key: "phone",
            position: "full-width" as const,
            align: "left" as const,
          },
        ],
      },
      {
        cells: [
          {
            key: "email",
            position: "full-width" as const,
            align: "left" as const,
          },
        ],
      },
    ],
    data: insuredItem.beneficiaries
      ? insuredItem.beneficiaries.map((beneficiary) => ({
          rut: beneficiary.rut,
          birthdate: beneficiary.birthdate,
          relationship: beneficiary.relationship,
          fullName: `${beneficiary.name} ${beneficiary.paternalLastname} ${beneficiary.maternalLastname}`,
          address: beneficiary.address,
          email: beneficiary.email,
          phone: beneficiary.phone,
        }))
      : [],
  };

  useEffect(() => {
    uiSetTitle("Perfil");
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15">
      <h1 className="text-lg lg:text-2xl font-semibold text-white">Titular</h1>
      <Form fields={titularFormFields} editable={false} />
      {insuredItem.beneficiaries && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Beneficiarios</h2>
          <DataTableCard data={cargasCardData} />
        </div>
      )}
    </div>
  );
};

export default Profile;
