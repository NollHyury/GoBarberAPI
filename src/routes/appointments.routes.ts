import {Router, response, request} from 'express';
import {startOfHour, parseISO} from 'date-fns';
import AppointmentsReporitory from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsReporitory = new AppointmentsReporitory();

appointmentsRouter.get('/', (request, response)=>{
  const appointments = appointmentsReporitory.all();

  return response.json(appointments);
})

appointmentsRouter.post('/',( request, response) => {
  const { provider, date } = request.body;


  const parsedDate : Date = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointmentsReporitory.findByDate(parsedDate);
  if(findAppointmentInSameDate){
    return response
      .status(400)
      .json({message : 'This appointment is already booked'});
  };

  const appointment = appointmentsReporitory.create({
    provider,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter
