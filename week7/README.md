# Week 07 — Answers

## 1. Why does Booking have an `eventId` column but Event has no `bookingIds` column? Where is the "many" side of a 1-N relation stored?
In a 1-N relation, the foreign key is stored on the "many" side (the N side). So, each `Booking` row holds an `eventId` linking it back to its one event. The `Event` table does not have a `bookingIds` column because a relational database column cannot hold a list; `Event.bookings` exists only in Prisma as a virtual relation field that Prisma uses `Booking.eventId` to resolve.

## 2. `booked` repeats information we could compute with COUNT and SUM over bookings. Why keep it, and what must the code do so it never becomes wrong?
We keep `booked` as a denormalized counter for speed and safety: it avoids scanning all bookings on every request, and it allows us to use a single atomic `UPDATE ... WHERE booked <= capacity - seats` query to prevent overbooking. To keep it correct, the code must modify `booked` in the exact same database transaction as any booking creation, deletion, or cancellation.

## 3. What is the difference between `prisma migrate dev` and `prisma generate`? Which one changes the database?
`prisma migrate dev` changes the database: it diffs the schema against existing migrations, generates SQL, and applies it to your local database. `prisma generate` does not touch the database; it reads the schema and generates the type-safe Prisma Client code in your `src/generated` folder. 

## 4. A page lists 20 events with their bookings. One version runs 1 query, another runs 21. Name the problem and show how `include` fixes it.
The 21-query version suffers from the N+1 query problem: it runs 1 query for the 20 events, then 1 extra query for each event's bookings, multiplying network latency. `include` fixes this by using Prisma's `include: { bookings: true }` to fetch all related bookings in a single batched `IN (...)` query, keeping the total number of queries constant (usually 2) regardless of how many events are listed.

## 5. Two students book the last seat at the same moment. Explain step by step why the read-check-update version can sell two seats and why the conditional `updateMany` cannot.
In the read-check-update version, both requests read `booked = 29` (with capacity 30) before either writes, so both think a seat is available and both increment the value, leading to a TOCTOU race and overbooking. The conditional `updateMany` solves this by pushing the check into the write itself (`WHERE booked <= capacity - seats`), forcing the database to lock the row and re-evaluate the condition for the second request, which then updates 0 rows and throws a `ConflictException`.