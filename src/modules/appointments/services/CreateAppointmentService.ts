import {startOfHour} from 'date-fns';
import {getCustomRepository} from 'typeorm'

import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import AppError from '@shared/errors/AppError';

/**
 * [X] Recebimento das informações
 * [/] Tratativa de erros e exeções
 * [X] Acesso ao repositório
 */
interface Request {
  provider_id: string;
  date: Date;
}

/***
 * Dependecy Inversion (SOLID)
 */

class CreateAppointmentService{
  public async execute( {date, provider_id} : Request) : Promise<Appointment>{
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);


    const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate){
      throw new AppError('This appointment is already booked');
    };

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }

}

export default CreateAppointmentService;
