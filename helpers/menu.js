const inquirer = require("inquirer");
const color = require("colors");
const UsuarioManager = require("../models/Usuario");


const preguntas = [
  {
    type: "list",
    name: "options",
    message: "Qué quieres hacer?",
    choices: [
      { value: "1", name: "1. Crear usuario" },
      { value: "2", name: "2. Listar usuarios" },
      { value: "3", name: "3. Usuarios con datos completos" },
      { value: "4", name: "4. Usuarios con datos incompletos" },
      { value: "5", name: "5. Actualizar usuario" },
      { value: "6", name: "6. Borrar Usuario" },
      { value: "0", name: "0. Salir" },
    ],
  },
];



const menu = async () => {
  
  console.log(`${"°°°°°°°°°°°°°°°°°°°°°°°°".green}\n${"Aplicacion para gestionar usuarios".blue}\n${"°°°°°°°°°°°°°°°°°°°°°°°°".green}`);
  return (await inquirer.default.prompt(preguntas)).options;
};

const pausa = async () => {
  await inquirer.default.prompt([{ type: "input", name: "enter", message: `Presione ${"enter".green}` }]);
};

const ejecutarMenu = async () => {
  let opcion;
  
  const manager = new UsuarioManager();
  do {
    opcion = await menu();
    if (opcion === "1") {
      const { nombre, edad, telefono } = await inquirer.default.prompt([
        { type: "input", name: "nombre", message: "Nombre del usuario:" },
        { type: "input", name: "edad", message: "Edad del usuario:" },
        { type: "input", name: "telefono", message: "Teléfono del usuario:" },
    ]);
      await manager.crearUsuario(nombre, edad, telefono);
      console.log("Usuario creado correctamente.".green);
    } else if (opcion === "2") {
      const tareasListadas = await manager.listarUsuarios();
      console.log("Listado de usuarios:".blue);
      console.log(tareasListadas);
    } else if (opcion === "3") {
const tareasCompletas = await manager.listarUsuariosActivos();
        console.log("Listado de usuarios completos y activos:".blue);
        console.log(tareasCompletas);
    } else if (opcion === "4") {
        const tareasPendientes = await manager.listarUsuariosInactivos();
        console.log("Listado de usuarios incompletos y inactivos:".blue);
        console.log(tareasPendientes);
    } else if (opcion === "5") {
      const usuarios = await manager.listarUsuarios();
      if (usuarios.length === 0) {
          console.log("No hay usuarios disponibles.".red);
          return;
      }
      
      const { idUsuario } = await inquirer.default.prompt([
          {
              type: "list",
              name: "idUsuario",
              message: "Seleccione el usuario a actualizar:",
              choices: usuarios.map((usuario, index) => ({
                  value: usuario.id,
                  name: `${index + 1}. ${usuario.nombre} (Tel: ${usuario.telefono}, Edad: ${usuario.edad})`,
              })),
          },
      ]);
      
      const usuarioSeleccionado = usuarios.find(usuario => usuario.id === idUsuario);
      
      const nuevosDatos = await inquirer.default.prompt([
          {
              type: "input",
              name: "nombre",
              message: `Nombre (${usuarioSeleccionado.nombre}):`,
              default: usuarioSeleccionado.nombre,
          },
          {
              type: "input",
              name: "edad",
              message: `Edad (${usuarioSeleccionado.edad}):`,
              default: usuarioSeleccionado.edad,
              validate: (input) => {
                  if (!input || isNaN(input) || input <= 0) return "Debe ingresar una edad válida.";
                  return true;
              },
          },
          {
              type: "input",
              name: "telefono",
              message: `Teléfono (${usuarioSeleccionado.telefono}):`,
              default: usuarioSeleccionado.telefono,
          },
      ]);
      
      await manager.actualizarUsuario(idUsuario, {
          nombre: nuevosDatos.nombre,
          edad: parseInt(nuevosDatos.edad),
          telefono: nuevosDatos.telefono,
      });
      
      console.log("Usuario actualizado correctamente.".green);
    } else if (opcion === "6") {
      const tareasBorrar = await manager.listarUsuarios();
const { idTarea } = await inquirer.default.prompt([{
  type: "list",
  name: "idTarea",
  message: "Seleccione el usuario a borrar:",
  choices: tareasBorrar.map((tarea, index) => ({ 
    value: tarea.id,  // Obtén el id de la tarea
    name: `${index + 1}. ${tarea.nombre}` 
  })),
}]);
await manager.borrarUsuario(idTarea);
console.log("Usuario borrado correctamente.".green);
    } else if (opcion === "0") {
      console.log("Saliendo...".blue);
      process.exit();
    } else {
      console.log("Opción inválida.".red);
    }
    await pausa(); 
  } while (opcion !== "0");
};

module.exports = { menu, ejecutarMenu, pausa };
