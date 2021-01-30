import {startOfHour} from 'date-fns';
import {getCustomRepository} from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

/**
 * Recebimentos de informacoes
 * Tratativas de erros/excessoes
 * Acesso ao repositorio
 */


interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService{
    /**
     * Dependecy Inversion (SOLID)
     */ 

    public async execute({date, provider_id}: Request): Promise<Appointment>{
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

        if(findAppointmentInSameDate){
            throw new AppError('This appointment is already  booked');            
        }

        const appointment = appointmentsRepository.create({provider_id, date: appointmentDate});

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;