const {menu,pausa,ejecutarMenu} = require("./helpers/menu");

const principal = async () => {
    let opt = 0;
    do { 
        opt = await ejecutarMenu();
        await pausa();
    } while (opt !== "0");
}
principal(); 

