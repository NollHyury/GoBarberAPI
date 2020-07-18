import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentController from '../controllers/AppointmentController';
import ProviderAppointmensController from '../controllers/ProviderAppointmensController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController()
const providerAppointmensController = new ProviderAppointmensController()

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.get('/me', providerAppointmensController.index);

export default appointmentsRouter
