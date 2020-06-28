import {startOfHour} from 'date-fns';

import Appointment from '../infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/**
 * [X] Recebimento das informações
 * [/] Tratativa de erros e exeções
 * [X] Acesso ao repositório
 */
interface IRequest {
  provider_id: string;
  date: Date;
}

/***
 * Dependecy Inversion (SOLID)
 */

class CreateAppointmentService{
  constructor( private appointmentsRepository : IAppointmentsRepository){}

  public async execute( {date, provider_id} : IRequest) : Promise<Appointment>{
    const appointmentDate = startOfHour(date);


    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate){
      throw new AppError('This appointment is already booked');
    };

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });


    return appointment;
  }

}

export default CreateAppointmentService;
