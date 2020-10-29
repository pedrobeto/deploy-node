import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository();
      fakeNotificationsRepository = new FakeNotificationsRepository();
      fakeCacheProvider = new FakeCacheProvider();
      createAppointment = new CreateAppointmentService(
         fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider
      );
      
   });
   
   it('should be able to create a new appointment', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      const appointment = await fakeAppointmentsRepository.create({
          date: new Date(2020, 4, 10, 13),
          provider_id: 'provider-id',
          user_id: 'user-id',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('provider-id');
      expect(appointment.user_id).toBe('user-id');     
   });

   it('should not be able to create two appointments at the same time', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 6).getTime();
      });

      const appointmentDate = new Date(2020, 4, 10, 15);

      await createAppointment.execute({
          date: new Date(2020, 4, 12, 9),
          provider_id: 'provider-id',
          user_id: 'user-id',
      });

      await expect(createAppointment.execute({
         date: new Date(2020, 4, 12, 9),
         provider_id: 'provider-id',
         user_id: 'user-id',
     })).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create an appointment on a paste date', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      await expect (createAppointment.execute({
          date: new Date(2020, 4, 7, 11),
          provider_id: 'provider-id',
          user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);

   });

   it('should not be able to create an appointment with same user as provider', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      await expect (createAppointment.execute({
          date: new Date(2020, 4, 10, 13),
          provider_id: 'user-id',
          user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create an appointment before 8am and after 5pm', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date(2020, 4, 10, 12).getTime();
      });

      await expect (createAppointment.execute({
          date: new Date(2020, 4, 11, 7),
          provider_id: 'user-id',
          user_id: 'provider-id',
      })).rejects.toBeInstanceOf(AppError);

      await expect (createAppointment.execute({
         date: new Date(2020, 4, 11, 18),
         provider_id: 'user-id',
         user_id: 'provider-id',
      })).rejects.toBeInstanceOf(AppError);
   });
});