type AppointmentRequest = {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
  };
  
  export function validateAppointmentRequest(body: any): {
    valid: boolean;
    message?: string;
  } {
    if (!body) return { valid: false, message: "Body vacío" };
  
    const { insuredId, scheduleId, countryISO } = body as AppointmentRequest;
  
    if (
      typeof insuredId !== "string" ||
      !/^\d{5}$/.test(insuredId)
    ) {
      return { valid: false, message: "insuredId debe ser un string de 5 dígitos" };
    }
  
    if (
      typeof scheduleId !== "number" ||
      scheduleId <= 0
    ) {
      return { valid: false, message: "scheduleId debe ser un número positivo" };
    }
  
    if (!["PE", "CL"].includes(countryISO)) {
      return { valid: false, message: "countryISO debe ser 'PE' o 'CL'" };
    }
  
    return { valid: true };
  }
  