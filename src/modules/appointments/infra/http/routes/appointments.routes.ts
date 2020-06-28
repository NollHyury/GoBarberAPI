import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsReporitory from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();


appointmentsRouter.use(ensureAuthenticated);

/*appointmentsRouter.get('/', async (request, response) => {
  const appointments = await appointmentsReporitory.find();

  return response.json(appointments);
})*/

appointmentsRouter.post('/', async (request, response) => {
  const appointmentsReporitory = new AppointmentsReporitory()

  const { provider_id, date } = request.body;

  const parsedDate: Date = parseISO(date);

  const createAppointment = new CreateAppointmentService(appointmentsReporitory);

  const appointment = await createAppointment.execute({ date: parsedDate, provider_id: provider_id })

  return response.json(appointment);
});

export default appointmentsRouter
