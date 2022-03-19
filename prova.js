const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient({
  log: ['query']
})


// console.log(prisma)
/*
const newClass = await prisma.classes.create({
    data: {
      name: 'classePrisma'
    },
  })

//console.log(newClass)

const deleteClass = await prisma.classes.delete({
  where: {
    id: 39
  }
})

console.log(deleteClass);
*/


prisma.courses.findMany({
  include: {
    units: {
      include: {
        lessons: true
      }
    }
  }
})
.then((r) => {
    console.log(r)
})
