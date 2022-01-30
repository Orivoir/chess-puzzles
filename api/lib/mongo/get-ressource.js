const {Theme, Puzzle} = require("./../../models");

module.exports = function({
  ressourceName,
  from = "params"
}){

  let Ressource = null;

  ressourceName = ressourceName?.toLocaleLowerCase();

  switch(ressourceName) {
  case "theme":
    Ressource = Theme;
    break;
  case "puzzle":
    Ressource = Puzzle;
    break;
  default:
    throw new RangeError(`ressource unknown for: ${ressourceName}`);
  }

  from = from?.toLocaleLowerCase();
  from = from === "query" ? "query" : "params";

  return {
    Ressource,
    from
  };
};