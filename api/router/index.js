const admin = require("./admin");
const public = require("./public");

module.exports = function(router){

  // admin routes
  router.post("/admin/login", admin.authentication.login);
  router.get("/admin/refresh", admin.authentication.refreshToken);
  router.get("/admin/logout", admin.authentication.logout);

  router.post("/admin/puzzle", admin.puzzles.post);
  router.put("/admin/puzzle/:id", admin.puzzles.put);
  router.delete("/admin/puzzle/:id", admin.puzzles.delete);

  router.post("/admin/theme", admin.themes.post);
  router.put("/admin/theme/:id", admin.themes.put);
  router.delete("/admin/theme/:id", admin.themes.delete);

  // public routes
  router.get("/puzzles", public.puzzles.getAll);
  router.get("/puzzle/:id", public.puzzles.getAll);

  router.get("/theme/:id", public.themes.get);
  router.get("/themes", public.themes.getAll);
};
