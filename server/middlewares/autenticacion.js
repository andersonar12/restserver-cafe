const jwt = require("jsonwebtoken");

/* Verificar Token */
const verificaToken = (req, res, next) => {
  if (!req.headers.hasOwnProperty("authorization")) {
    return res.status(400).json({
      ok: false,
      message: "Falta el Token para autenticacion",
    });
  }

  let token = req.headers["authorization"].split(" ")[1];

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decode["usuario"];
    /* req.token = token */
    next();
  });
};

/* Verificar Rol Administrador (Solo autorizados para crear, borrar y editar) */
const verificaRole = (req, res, next) => {
  let userRole = req.usuario.role;

  if (userRole != "ADMIN_ROLE") {
    return res.status(401).json({
      ok: false,
      message: "EL usuario no es administrador",
    });
  }

  next();
};

module.exports = {
  verificaToken,
  verificaRole,
};
