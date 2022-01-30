const admin = require("./admin");

module.exports = function(router){

  // admin routes
  router.post("/admin/login", admin.authentication.login);
  router.get("/admin/refresh", admin.authentication.refreshToken);
  router.get("/admin/logout", admin.authentication.logout);

  router.get("/admin/puzzle/:id", admin.puzzles.get);
  router.get("/admin/puzzles", admin.puzzles.getAll);
  router.post("/admin/puzzle", admin.puzzles.post);
  router.put("/admin/puzzle/:id", admin.puzzles.put);
  router.delete("/admin/puzzle/:id", admin.puzzles.delete);

  router.get("/admin/theme/:id", admin.themes.get);
  router.get("/admin/themes", admin.themes.getAll);
  router.post("/admin/theme", admin.themes.post);
  router.put("/admin/theme/:id", admin.themes.put);
  router.delete("/admin/theme/:id", admin.themes.delete);
};
