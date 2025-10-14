import { apiInstance } from "@/utils/api";

import { IDataResponse } from "@/interfaces/dataResponse";
import { ITicketReimbursement } from "@/store/interfaces/ticket";

// Función auxiliar para comprimir imágenes
const compressImage = (file: File, maxSizeMB = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Si no es imagen o ya es pequeño, retornar el archivo original
    if (
      !file.type.startsWith("image/") ||
      file.size <= maxSizeMB * 1024 * 1024
    ) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calcular nuevo tamaño manteniendo aspect ratio
        const maxDimension = 1920;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Comprimir con calidad ajustable
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.7 // Calidad de compresión (70%)
        );
      };
      img.onerror = () => reject(new Error("Error al cargar la imagen"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
};

export const reimbursementUpsert = async (
  reimbursementData: ITicketReimbursement,
  files?: File[]
): Promise<IDataResponse> => {
  try {
    console.log("=== DEBUG REIMBURSEMENT UPSERT ===");
    console.log("1. Datos recibidos:", reimbursementData);
    console.log("2. Archivos recibidos:", files?.length || 0);

    // Crear FormData para enviar archivos y datos
    const formData = new FormData();

    // Agregar campos del reembolso
    formData.append("leadId", reimbursementData.leadId);
    formData.append("assistanceId", reimbursementData.assistanceId);
    formData.append("date", reimbursementData.date);
    formData.append("description", reimbursementData.description);
    formData.append("amount", reimbursementData.amount.toString());
    formData.append("bankCode", reimbursementData.bankCode);
    formData.append(
      "bankAccountTypeCode",
      reimbursementData.bankAccountTypeCode
    );
    formData.append("bankAccountNumber", reimbursementData.bankAccountNumber);

    // Agregar attachments como JSON string (por si el backend lo necesita)
    if (
      reimbursementData.attachments &&
      reimbursementData.attachments.length > 0
    ) {
      formData.append(
        "attachments",
        JSON.stringify(reimbursementData.attachments)
      );
    }

    console.log("3. FormData campos agregados");

    // Log de cada campo del FormData
    for (const pair of formData.entries()) {
      console.log(`   ${pair[0]}: ${pair[1]}`);
    }

    // Comprimir y agregar archivos si existen
    if (files && files.length > 0) {
      console.log("4. Comprimiendo archivos...");

      // Comprimir imágenes en paralelo
      const compressedFiles = await Promise.all(
        files.map((file) => compressImage(file, 1))
      );

      console.log(
        "5. Archivos comprimidos:",
        compressedFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        }))
      );

      // Agregar archivos comprimidos al FormData
      compressedFiles.forEach((file, index) => {
        formData.append("files", file);
        console.log(
          `   Archivo ${index + 1}: ${file.name} (${(file.size / 1024).toFixed(
            2
          )} KB)`
        );
      });
    }

    console.log("6. Enviando petición al servidor...");

    // NO especificar Content-Type manualmente, axios lo maneja automáticamente con boundary
    const { data } = await apiInstance.post(
      `/ticket/reimbursementUpsert`,
      formData
    );

    console.log("7. Respuesta exitosa:", data);
    console.log("=== FIN DEBUG ===");

    return data;
  } catch (e: unknown) {
    console.error("=== ERROR EN REIMBURSEMENT UPSERT ===");
    console.error("Error completo:", e);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error("Response:", (e as any).response?.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error("Status:", (e as any).response?.status);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error("Headers:", (e as any).response?.headers);
    console.error("=== FIN ERROR ===");
    throw e;
  }
};

export const reimbursementGetByRut = async (
  rut: string
): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(
      `/ticket/reimbursementGetByRut/${rut}`
    );
    return data;
  } catch (e) {
    throw e;
  }
};

export const reimbursementGetById = async (
  id: string
): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(
      `/ticket/reimbursementGetById/${id}`
    );
    return data;
  } catch (e) {
    throw e;
  }
};

export const reimbursementGetFileById = async (
  id: string
): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(
      `/ticket/reimbursementGetFileById/${id}`
    );
    return data;
  } catch (e) {
    throw e;
  }
};
