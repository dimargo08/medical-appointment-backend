import { validateAppointmentRequest } from '../utils/validators';

test('Valida un request correcto', () => {
  const result = validateAppointmentRequest({
    insuredId: "01234",
    scheduleId: 101,
    countryISO: "PE"
  });
  expect(result.valid).toBe(true);
});
