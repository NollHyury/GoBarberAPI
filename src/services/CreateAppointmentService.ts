import Appointment from '../models/Appointment';
import AppointmentsReporitory from '../repositories/AppointmentsRepository';
import {startOfHour} from 'date-fns';

/**
 * [X] Recebimento das informações
 * [/] Tratativa de erros e exeções
 * [X] Acesso ao repositório
 */
interface Request {
  provider: string;
  date: Date;
}


/***
 * Dependecy Inversion (SOLID)
 */

class CreateAppointmentService{
  private appointmentsReporitory : AppointmentsReporitory

  constructor(appointmentsReporitory : AppointmentsReporitory){
    this.appointmentsReporitory = appointmentsReporitory;
  }

  public execute( {date, provider} : Request) : Appointment{
    const appointmentDate = startOfHour(date);


    const findAppointmentInSameDate = this.appointmentsReporitory.findByDate(appointmentDate);
    if(findAppointmentInSameDate){
      throw Error('This appointment is already booked');
    };

    const appointment = this.appointmentsReporitory.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }

}

export default CreateAppointmentService;
