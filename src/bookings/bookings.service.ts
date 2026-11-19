import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

void [ConflictException, NotFoundException]; // you will need these
import { PrismaService } from '../prisma/prisma.service.js';
import type { Booking } from '../generated/prisma/client.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // TODO C1: in ONE transaction (this.prisma.$transaction(async (tx) => { ... })):
  //  - 404 if the event does not exist
  //  - add dto.seats to event.booked ONLY IF they fit, using tx.event.updateMany with a
  //    condition in where; if no row was updated, throw ConflictException(`Only ${left} seat(s) left`)
  //  - create and return the booking
  // Read first, check in JavaScript, then update is NOT enough: see the last e2e test.
  create(eventId: number, dto: CreateBookingDto): Promise<Booking> {
    throw new Error('TODO C1');
  }

  // TODO C2: 404 if the booking does not exist; otherwise delete it AND give its seats
  // back to the event, both in one transaction (the array form of $transaction is enough)
  async remove(id: number): Promise<void> {
    throw new Error('TODO C2');
  }
}
