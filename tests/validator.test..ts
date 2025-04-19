import { validateAppointmentRequest } from '../src/utils/validators';

describe('validateAppointmentRequest', () => {
  it('debe aceptar una solicitud válida', () => {
    const result = validateAppointmentRequest({
      insuredId: "01234",
      scheduleId: 101,
      countryISO: "PE"
    });
    expect(result.valid).toBe(true);
  });

  it('debe rechazar insuredId inválido', () => {
    const result = validateAppointmentRequest({
      insuredId: "1234", // solo 4 dígitos
      scheduleId: 101,
      countryISO: "PE"
    });
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/insuredId/i);
  });

  it('debe rechazar scheduleId inválido', () => {
    const result = validateAppointmentRequest({
      insuredId: "01234",
      scheduleId: -10,
      countryISO: "PE"
    });
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/scheduleId/i);
  });

  it('debe rechazar countryISO inválido', () => {
    const result = validateAppointmentRequest({
      insuredId: "01234",
      scheduleId: 101,
      countryISO: "AR" // no permitido
    });
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/countryISO/i);
  });

  it('debe rechazar cuando el body es undefined', () => {
    const result = validateAppointmentRequest(undefined);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/Body vacío/);
  });
});
