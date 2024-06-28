// Interface
interface Question {
    quest   : string,
    answer  : string
}

export const instruction_home: Question[] = [
    {
        quest: "¿Qué es AsesoresApp?",
        answer: `
          <strong>Astro: </strong>  AsesoresApp es una herramienta para la administración de asesorías y asesoramientos dirigida a estudiantes y profesores. 🚀`
      },
      {
        quest: "Soy estudiante",
        answer: `
          <strong>Astro: </strong> Como estudiante tienes el acceso a los asesoramientos creados por la comunidad universitaria. 🦁`
      },
      {
        quest: "Soy asesor",
        answer: `
          <strong>Astro: </strong> Como asesor tienes el acceso a la creación de asesoramientos personalizados. 👨‍🏫`
      }
];

export const instruction_subjects: Question[] = [
    {
        quest: "¿Qué debo hacer en este espacio?",
        answer: `
          <strong>Astro: </strong>Necesitas seguir una serie de pasos...<br><br>
          <strong>Paso 1: </strong>Debes dar clic en el botón "CREAR NUEVA CÁTEDRA".<br>
          <strong>Paso 2: </strong>Ingresar el código de la cátedra.<br>
          <strong>Paso 3: </strong>Ingresar el nombre de la cátedra.<br>
          <strong>Paso 4: </strong>Dar clic en el botón "CREAR CÁTEDRA" de lo contrario "CANCELAR".<br><br>
          `
      },
      {
        quest: "Es obligatorio crear cátedras",
        answer: `
          <strong>Astro: </strong> Por supuesto, la creación de cátedras es el primer paso para que asesoresapp funcione correctamente.`
      }
];

export const instruction_users: Question[] = [
  {
      quest: "¿Qué puedo hacer en este espacio?",
      answer: `
        <strong>Astro: </strong>Este espacio te permite la correcta administración de usuarios, recordemos que asesoresapp es un prototipo y
        necesitamos cuidar el flujo de cuentas activas dentro de ella.<br><br>
        - Puedes buscar usuarios por su código institucional.<br>
        - Puedes buscar usuarios por su rol.<br>
        - Puedes ver toda la información y estadísticas del usuario.<br>
        - Puedes dar y denegar acceso a la aplicación.<br>
        - Puedes cambiar roles de los usuarios.<br>
        - Puedes ver estadísticas de estudiantes y asesores que están activos e inactivos;.<br>
        `
    },
    {
      quest: "Es obligatorio crear cátedras",
      answer: `
        <strong>Astro: </strong> Por supuesto, la creación de cátedras es el primer paso para que asesoresapp funcione correctamente.`
    }
];