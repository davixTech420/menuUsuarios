const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

class Usuario {
    constructor(nombre, edad, telefono) {
        this.id = uuidv4(); // Genera un ID único
        this.nombre = nombre;
        this.edad = edad;
        this.telefono = telefono;
        this.estado = this.validarEstado(); // Estado inicial según los campos
    }

    validarEstado() {
        return this.nombre && this.edad && this.telefono ? true : false;
    }
}

class UsuarioManager {
    constructor() {
        this.archivo = "./db/usuarios.json"; // Ruta del archivo JSON para usuarios
        this.cargarUsuarios(); // Carga los usuarios desde el archivo JSON
    }

    cargarUsuarios() {
        try {
            const data = fs.readFileSync(this.archivo, 'utf8');
            this.usuarios = JSON.parse(data);
        } catch (error) {
            this.usuarios = []; // Si no existe el archivo, inicializa un array vacío
        }
    }

    guardarUsuarios() {
        const data = JSON.stringify(this.usuarios, null, 2);
        fs.writeFileSync(this.archivo, data);
    }

    crearUsuario(nombre, edad, telefono) {
        const nuevoUsuario = new Usuario(nombre, edad, telefono);
        this.usuarios.push(nuevoUsuario);
        this.guardarUsuarios();
        console.log("Usuario creado exitosamente.");
    }

    listarUsuarios() {
        if (this.usuarios.length === 0) {
            console.log("No hay usuarios disponibles.");
            return [];
        }
        return this.usuarios;
    }

    listarUsuariosActivos() {
        return this.usuarios.filter(usuario => usuario.estado);
    }

    listarUsuariosInactivos() {
        return this.usuarios.filter(usuario => !usuario.estado);
    }

    borrarUsuario(id) {
        const index = this.usuarios.findIndex(usuario => usuario.id === id);
        if (index === -1) {
            console.log("ID inválido.");
            return;
        }
        this.usuarios.splice(index, 1);
        this.guardarUsuarios();
        console.log("Usuario borrado exitosamente.");
    }

    actualizarUsuario(id, nuevosDatos) {
        const usuario = this.usuarios.find(usuario => usuario.id === id);
    
        if (!usuario) {
            console.log("ID inválido.");
            return;
        }
    
        // Actualizar los campos solo si están presentes en los nuevos datos
        if (nuevosDatos.nombre !== undefined) {
            usuario.nombre = nuevosDatos.nombre;
        }
        if (nuevosDatos.edad !== undefined) {
            usuario.edad = nuevosDatos.edad;
        }
        if (nuevosDatos.telefono !== undefined) {
            usuario.telefono = nuevosDatos.telefono;
        }
    
        // Verificar si todos los campos están completos para actualizar el estado
        usuario.estado = usuario.nombre && usuario.edad && usuario.telefono ? true : false;
    
        this.guardarUsuarios();
        console.log("Usuario actualizado correctamente.");
    }
    
}

module.exports = UsuarioManager;
