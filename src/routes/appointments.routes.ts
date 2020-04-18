import {Router} from 'express';
import {parseISO} from 'date-fns';

import AppointmentsReporitory from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsReporitory = new AppointmentsReporitory();

appointmentsRouter.get('/', (request, response)=>{
  const appointments = appointmentsReporitory.all();

  return response.json(appointments);
})

appointmentsRouter.post('/',( request, response) => {
  try {
    const { provider, date } = request.body;


    const parsedDate : Date = parseISO(date);

    const createAppointment = new CreateAppointmentService(appointmentsReporitory);

    const appointment = createAppointment.execute({date: parsedDate, provider:provider})

    return response.json(appointment);
  } catch (err) {
   return response.status(400).json({error: err.message})
 }
});

export default appointmentsRouter
