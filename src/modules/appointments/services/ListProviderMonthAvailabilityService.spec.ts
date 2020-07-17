import ListProviderMonthAvailability from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderMonthAvailability: ListProviderMonthAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailability(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the month availability from provider', async () => {
    for (let index = 8; index <= 17; index++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'user',
        date: new Date(2020, 4, 21, index, 0, 0),
      });
    }
    for (let index = 8; index <= 17; index++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'user',
        date: new Date(2020, 4, 20, index, 0, 0),
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 3, 21, 10, 0, 0),
    });


    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 19, available: true },
        { day: 22, available: true },
        { day: 21, available: false },
      ]),
    );
  });
});
