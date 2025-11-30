/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Upload, X, Camera, Eye } from "lucide-react";

import Badge from "@/components/ui/badge";
import Form, { FormField } from "@/components/ui/form";
import Card from "@/components/ui/card";

import { useInsured, useTicket } from "@/store/hooks";

import { ITicketReimbursement } from "@/store/interfaces/ticket";

import { bankList, bankAccountTypeList } from "@/data/bank";

interface ReimbursementDetailProps {
  reimbursement?: ITicketReimbursement;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const ReimbursementDetail: React.FC<ReimbursementDetailProps> = ({
  reimbursement,
  onBack,
}) => {
  // Estado principal del formulario con productId y assistanceId
  const [formData, setFormData] = useState({
    productId: reimbursement?.productId || "",
    amount: reimbursement?.amount || "",
    description: reimbursement?.description || "",
    date: reimbursement?.date || "",
    bankCode: reimbursement?.bankCode || "",
    bankAccountTypeCode: reimbursement?.bankAccountTypeCode || "",
    bankAccountNumber: reimbursement?.bankAccountNumber || "",
    assistanceId: "",
  });
  // Nuevos reembolsos siempre inician en modo editable, existentes en modo lectura
  const [editMode, setEditMode] = useState(!reimbursement);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Lógica de productos (asistencias) y prestaciones dinámicas
  const { insuredItem } = useInsured();
  const {
    ticketReimbursementGetFileById,
    ticketReimbursementUpsert,
    ticketReimbursementGetByRut,
    ticketFile,
    ticketIsLoading,
  } = useTicket();

  // Asistencias = Products disponibles del asegurado (solo los con balance = 0)
  const allProducts = useMemo(() => {
    if (!insuredItem?.products) return [];
    return insuredItem.products
      .filter((p) => p.product.collect.balance === 0)
      .map((p) => p.product);
  }, [insuredItem]);

  // Producto seleccionado (lo que el usuario llama "Asistencia")
  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === formData.productId),
    [allProducts, formData.productId]
  );

  // Prestaciones = Assistances del producto seleccionado
  const prestacionesOptions = useMemo(() => {
    if (!selectedProduct?.assistances) return [];
    return selectedProduct.assistances
      .filter((assistance) => assistance.isRefundable)
      .map((assistance) => ({
        value: assistance.id,
        text: assistance.name,
      }));
  }, [selectedProduct]);

  // Validación para habilitar el botón de envío
  const isFormValid = useMemo(() => {
    const requiredFields = [
      "productId",
      "assistanceId",
      "amount",
      "date",
      "description",
      "bankCode",
      "bankAccountTypeCode",
      "bankAccountNumber",
    ];

    // Verificar que todos los campos requeridos estén llenos
    const allFieldsFilled = requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== null && value !== "";
    });

    // Verificar que haya al menos un archivo subido
    const hasFiles = uploadedFiles.length > 0;

    return allFieldsFilled && hasFiles;
  }, [formData, uploadedFiles]);

  const isNewReimbursement = !reimbursement;

  // Función handleEdit comentada (no se usa por ahora)
  // const handleEdit = () => {
  //   setEditMode(true);
  // };

  const handleCancel = () => {
    if (isNewReimbursement) {
      onBack?.();
    } else {
      // Restaurar datos originales
      setFormData({
        productId: reimbursement?.productId || "",
        amount: reimbursement?.amount || "",
        description: reimbursement?.description || "",
        date: reimbursement?.date || "",
        bankCode: reimbursement?.bankCode || "",
        bankAccountTypeCode: reimbursement?.bankAccountTypeCode || "",
        bankAccountNumber: reimbursement?.bankAccountNumber || "",
        assistanceId: "",
      });
      setEditMode(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormChange = (variable: string, value: string) => {
    handleInputChange(variable, value);
    if (variable === "productId") {
      // Reset prestación if asistencia changes
      setFormData((prev) => ({ ...prev, assistanceId: "" }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isValidImage = file.type.startsWith("image/");
        const isValidPdf = file.type === "application/pdf";
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
        return (isValidImage || isValidPdf) && isValidSize;
      });

      if (validFiles.length > 0) {
        setUploadedFiles((prev: File[]) => [...prev, ...validFiles]);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter((file) => {
        const isValidImage = file.type.startsWith("image/");
        const isValidPdf = file.type === "application/pdf";
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
        return (isValidImage || isValidPdf) && isValidSize;
      });

      if (validFiles.length > 0) {
        setUploadedFiles((prev: File[]) => [...prev, ...validFiles]);
      }

      if (validFiles.length < files.length) {
        console.log(
          "Algunos archivos fueron rechazados por tipo o tamaño no válido"
        );
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev: File[]) =>
      prev.filter((_, i: number) => i !== index)
    );
  };

  const previewFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Vista previa - ${file.name}</title>
              <style>
                body { margin: 0; padding: 20px; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; border-radius: 8px; }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="Vista previa" onload="URL.revokeObjectURL('${imageUrl}')" />
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else if (file.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(file);
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Vista previa PDF - ${file.name}</title>
              <style>body { margin: 0; }</style>
            </head>
            <body>
              <embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%" />
            </body>
          </html>
        `);
        newWindow.document.close();
      }
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Verificar si el navegador soporta la API de cámara
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("Tu navegador no soporta el acceso a la cámara");
        // Fallback al input file con capture
        const cameraInput = document.createElement("input");
        cameraInput.type = "file";
        cameraInput.accept = "image/*";
        cameraInput.capture = "environment";
        cameraInput.onchange = (event) => {
          const files = (event.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            const validFiles = Array.from(files).filter((file) => {
              const isValidImage = file.type.startsWith("image/");
              const isValidSize = file.size <= 5 * 1024 * 1024;
              return isValidImage && isValidSize;
            });
            if (validFiles.length > 0) {
              setUploadedFiles((prev: File[]) => [...prev, ...validFiles]);
            }
          }
        };
        cameraInput.click();
        return;
      }

      // Acceder a la cámara trasera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Cámara trasera
        },
      });

      // Crear elementos para mostrar la cámara
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Crear modal para la cámara
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;

      video.style.cssText = `
        max-width: 90%;
        max-height: 70%;
        border-radius: 8px;
      `;

      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 20px;
      `;

      const captureBtn = document.createElement("button");
      captureBtn.textContent = "Tomar Foto";
      captureBtn.style.cssText = `
        background: #0891b2;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
      `;

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancelar";
      cancelBtn.style.cssText = `
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
      `;

      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      modal.appendChild(video);
      modal.appendChild(buttonContainer);
      document.body.appendChild(modal);

      video.srcObject = stream;
      video.play();

      const cleanup = () => {
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(modal);
      };

      captureBtn.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `camara-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              setUploadedFiles((prev: File[]) => [...prev, file]);
            }
            cleanup();
          },
          "image/jpeg",
          0.8
        );
      };

      cancelBtn.onclick = cleanup;
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      // Fallback al input file si falla el acceso a la cámara
      const cameraInput = document.createElement("input");
      cameraInput.type = "file";
      cameraInput.accept = "image/*";
      cameraInput.capture = "environment";
      cameraInput.onchange = (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const validFiles = Array.from(files).filter((file) => {
            const isValidImage = file.type.startsWith("image/");
            const isValidSize = file.size <= 5 * 1024 * 1024;
            return isValidImage && isValidSize;
          });
          if (validFiles.length > 0) {
            setUploadedFiles((prev: File[]) => [...prev, ...validFiles]);
          }
        }
      };
      cameraInput.click();
    }
  };

  const getStatusVariant = (estado: string) => {
    switch (estado) {
      case "Aprobado":
        return "success";
      case "Rechazado":
        return "error";
      case "En revisión":
        return "warning";
      case "Pendiente":
        return "default";
      default:
        return "default";
    }
  };

  const reimbursementFormFields: FormField[] = [
    {
      label: "Asistencia",
      type: "select",
      variable: "productId",
      options: allProducts.map((product) => ({
        value: product.id,
        text: product.name,
      })),
      required: true,
    },
    {
      label: "Prestación",
      type: "select",
      variable: "assistanceId",
      options: prestacionesOptions,
      required: true,
    },
    {
      label: "Monto a Reembolsar",
      type: "amount",
      variable: "amount",
      placeholder: "$0",
      required: true,
    },
    {
      label: "Fecha del Gasto",
      type: "date",
      variable: "date",
      required: true,
    },
    {
      label: "Descripción del Gasto",
      type: "textarea",
      variable: "description",
      placeholder: "Describe detalladamente el gasto realizado...",
      fullWidth: true,
      required: true,
    },
  ];

  const bankFormFields: FormField[] = [
    {
      label: "Banco",
      type: "select",
      variable: "bankCode",
      options: bankList,
      required: true,
    },
    {
      label: "Tipo de Cuenta",
      type: "select",
      variable: "bankAccountTypeCode",
      options: bankAccountTypeList,
      required: true,
    },
    {
      label: "Número de Cuenta",
      type: "text",
      variable: "bankAccountNumber",
      placeholder: "Número de cuenta bancaria",
      fullWidth: true,
      required: true,
    },
  ];

  const getFormData = () => {
    const combinedData: Record<string, string | number> = {};

    if (reimbursement) {
      combinedData.productId = reimbursement.productId;
      combinedData.amount = reimbursement.amount;
      combinedData.date = reimbursement.date;
      combinedData.description = reimbursement.description;
      combinedData.bankCode = reimbursement.bankCode || "";
      combinedData.bankAccountTypeCode =
        reimbursement.bankAccountTypeCode || "";
      combinedData.bankAccountNumber = reimbursement.bankAccountNumber || "";
    }

    Object.entries(formData).forEach(([key, value]) => {
      combinedData[key] = value as string | number;
    });

    return combinedData;
  };

  const handleClickFile = (id: string) => {
    ticketReimbursementGetFileById(id);
  };

  const handleClickSend = async () => {
    if (isFormValid) {
      try {
        const selectedProductItem = insuredItem?.products?.find(
          (p) => p.product.id === formData.productId
        );
        const leadId =
          reimbursement?.leadId || selectedProductItem?.leadId || "";

        const reimbursementData: ITicketReimbursement = {
          leadId: leadId,
          productId: formData.productId,
          assistanceId: formData.assistanceId,
          date: formData.date,
          description: formData.description,
          amount: Number(formData.amount),
          bankCode: formData.bankCode,
          bankAccountTypeCode: formData.bankAccountTypeCode,
          bankAccountNumber: formData.bankAccountNumber,
          attachments: [],
        };

        setIsSaving(true);
        ticketReimbursementUpsert(reimbursementData, uploadedFiles);
      } catch (error) {
        console.error("=== ERROR EN HANDLECLICKSEND ===");
        console.error("Error al enviar reembolso:", error);
        console.error("=== FIN ERROR ===");
      }
    } else {
      console.warn("Formulario inválido, no se puede enviar");
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Initialize asistencia/prestacion for new reimbursements
  useEffect(() => {
    const isNewReimbursement = !reimbursement;
    if (isNewReimbursement && allProducts.length > 0 && !formData.productId) {
      setFormData((prev) => ({ ...prev, productId: allProducts[0].id }));
    }
  }, [reimbursement, allProducts, formData.productId]);

  useEffect(() => {
    if (
      selectedProduct &&
      prestacionesOptions.length > 0 &&
      !formData.assistanceId
    ) {
      setFormData((prev) => ({
        ...prev,
        assistanceId: prestacionesOptions[0].value,
      }));
    }
  }, [selectedProduct, prestacionesOptions, formData.assistanceId]);

  useEffect(() => {
    if (ticketFile && ticketFile.url) {
      window.open(ticketFile.url, "_blank");
    }
  }, [ticketFile]);

  useEffect(() => {
    if (isSaving === true && ticketIsLoading === false) {
      setIsSaving(false);
      ticketReimbursementGetByRut(insuredItem.insured.rut);
      setEditMode(false);
    }
  }, [isSaving, ticketIsLoading]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#232a3a] rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-lg lg:text-2xl font-semibold text-white">
              {isNewReimbursement ? "Nuevo Reembolso" : "Detalle de Reembolso"}
            </h1>
            {reimbursement && (
              <div className="flex items-center gap-3 mt-2">
                <Badge
                  // variant={
                  //   getStatusVariant(
                  //     reimbursement?.status || "Pendiente"
                  //   ) as any
                  // }>
                  // {reimbursement?.status}
                  variant={getStatusVariant("Pendiente")}>
                  Pendiente
                </Badge>
                <span className="text-[#e6eaf3]/60 text-sm">
                  Solicitado el {reimbursement?.date}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Botones de edición comentados por ahora */}
        {/* {!isNewReimbursement && (
          <div className="flex gap-2 lg:flex-shrink-0">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-[#232a3a] hover:bg-[#2a3441] text-white rounded-lg transition-colors font-medium text-sm">
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium text-sm">
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium text-sm">
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        )} */}
      </div>
      {editMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClickSend();
          }}
          className="space-y-6">
          <Form
            title="Información del Reembolso"
            fields={reimbursementFormFields}
            editable={true}
            data={getFormData()}
            onChange={handleFormChange}
          />
          <div>
            <Form
              title="Datos de Cuenta Bancaria"
              fields={bankFormFields}
              editable={true}
              data={getFormData()}
              onChange={handleFormChange}
            />
            <div className="mt-3 bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-amber-300 text-sm font-semibold">
                  Importante
                </p>
                <p className="text-amber-200/90 text-sm mt-1">
                  La cuenta bancaria debe estar a nombre del titular del
                  producto. Reembolsos a cuentas de terceros serán rechazados.
                </p>
              </div>
            </div>
          </div>
          <Card>
            <h2 className="text-lg lg:text-xl font-bold text-white mb-6">
              Documentos de Respaldo
            </h2>
            <div className="space-y-2">
              {reimbursement?.attachments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 bg-[#232a3a] border border-[#2a3441] rounded-lg p-3">
                  <span className="text-white text-sm truncate flex-1 min-w-0">
                    {doc.fileName}
                  </span>
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm whitespace-nowrap flex-shrink-0">
                    Descargar
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 mb-4">
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-[#232a3a] ${
                  isDragOver
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-[#2a3441] hover:border-cyan-500"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload
                    className={`w-8 h-8 mb-3 transition-colors ${
                      isDragOver ? "text-cyan-400" : "text-[#e6eaf3]/60"
                    }`}
                  />
                  <p
                    className={`text-sm transition-colors ${
                      isDragOver ? "text-cyan-400" : "text-[#e6eaf3]/60"
                    }`}>
                    <span className="font-semibold">
                      {isDragOver
                        ? "Suelta los archivos aquí"
                        : "Haz clic para subir"}
                    </span>
                    {!isDragOver && !isMobile && " o arrastra archivos aquí"}
                  </p>
                  <p className="text-xs mt-2">
                    <span className="text-[#e6eaf3]/60">Formatos: </span>
                    <span className="text-cyan-400 font-semibold">
                      JPG, PNG, PDF
                    </span>
                    <span className="text-[#e6eaf3]/40 mx-1">•</span>
                    <span className="text-[#e6eaf3]/60">Máx: </span>
                    <span className="text-cyan-400 font-semibold">5MB</span>
                    {isMobile && (
                      <>
                        <span className="text-[#e6eaf3]/40 mx-1">•</span>
                        <span className="text-[#e6eaf3]/60">
                          Usa el botón de cámara abajo
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {isMobile && (
              <div className="mb-4 space-y-2">
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Capturar con Cámara
                </button>
                <p className="text-xs text-center text-[#e6eaf3]/40">
                  Se abrirá la cámara de tu dispositivo para tomar la foto
                </p>
              </div>
            )}
            <div className="space-y-2">
              {uploadedFiles.map((file: File, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#1a1f2b] rounded-lg p-3">
                  <div className="flex flex-col flex-1">
                    <span className="text-white text-sm">{file.name}</span>
                    <span className="text-[#e6eaf3]/40 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                      {file.type.startsWith("image/") && " • Imagen"}
                      {file.type === "application/pdf" && " • PDF"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => previewFile(file)}
                      className="text-cyan-400 hover:text-cyan-300 p-1"
                      title="Ver archivo">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Eliminar archivo">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {isNewReimbursement && (
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-[#232a3a] hover:bg-[#2a3441] text-white rounded-lg transition-colors font-medium">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                  isFormValid
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}>
                Enviar Solicitud
              </button>
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-6">
          <Form
            title="Información del Reembolso"
            fields={reimbursementFormFields}
            editable={false}
            data={getFormData()}
          />
          <Form
            title="Datos de Cuenta Bancaria"
            fields={bankFormFields}
            editable={false}
            data={getFormData()}
          />
          <Card>
            <h2 className="text-lg lg:text-xl font-bold text-white mb-6">
              Documentos de Respaldo
            </h2>
            <div className="space-y-2">
              {reimbursement?.attachments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 bg-[#1a1f2b] rounded-lg p-3">
                  <span className="text-white text-sm truncate flex-1 min-w-0">
                    {doc.fileName}
                  </span>
                  <button
                    className="text-cyan-400 hover:text-cyan-300 text-sm whitespace-nowrap flex-shrink-0"
                    onClick={() => handleClickFile(doc.id)}>
                    Descargar
                  </button>
                </div>
              ))}
            </div>
          </Card>
          {/* {reimbursement?.comentarios && (
            <div className="bg-[#181e29] rounded-xl border border-[#232a3a] p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Comentarios del Revisor
              </h2>
              <div className="text-white text-sm">
                {reimbursement?.comentarios}
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default ReimbursementDetail;
