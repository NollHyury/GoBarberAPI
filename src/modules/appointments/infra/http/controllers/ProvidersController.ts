import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
      const { id } = request.user;

      const createAppointment = container.resolve(ListProviderService);

      const providers = await createAppointment.execute({
        user_id: id
      });

    return response.json(providers);
  }
}
