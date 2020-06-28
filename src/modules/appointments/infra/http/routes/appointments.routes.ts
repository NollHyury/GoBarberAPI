import { Router } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentController from '../controllers/AppointmentController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController()

appointmentsRouter.use(ensureAuthenticated);

/*appointmentsRouter.get('/', async (request, response) => {
  const appointments = await appointmentsReporitory.find();

  return response.json(appointments);
})*/

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter
