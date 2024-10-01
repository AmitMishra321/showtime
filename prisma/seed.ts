import prisma from '../src/db/prisma'

async function main() {
  // Creating a sample user
  const user = await prisma.user.create({
    data: {
      id: 'user_2iPFHdpX8N7ICQvL8xHCJxSPfmI',
      name: 'John Doe',

      createdAt: new Date(),
      updatedAt: new Date(),
      Admin: {
        create: {}, // This will create an Admin entry associated with the User
      },
    },
  })

  // Creating a cinema
  const cinema = await prisma.cinema.create({
    data: {
      name: 'Awesome Cinema',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Creating a screen in the cinema
  const screen = await prisma.screen.create({
    data: {
      number: 1,
      cinemaId: cinema.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Creating a movie
  const movie = await prisma.movie.create({
    data: {
      title: 'Inception',
      director: 'Christopher Nolan',
      genre: 'SCI_FI',
      duration: 148, // Duration in minutes
      releaseDate: new Date('2010-07-16'),
      posterUrl: 'https://example.com/inception.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Creating a showtime for the movie on the screen
  const showtime = await prisma.showtime.create({
    data: {
      startTime: new Date('2024-09-30T18:00:00'),
      movieId: movie.id,
      screenId: screen.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
