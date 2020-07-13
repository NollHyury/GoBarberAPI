import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository : FakeAppointmentsRepository;
let createAppointmentService : CreateAppointmentService;


describe('CreateAppointment', () => {
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '32132132131',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('32132132131');
  });

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2020,4,10,11);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '32132132131',
    });

    expect(createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '32132132131',
    })).rejects.toBeInstanceOf(AppError)

  });
});
