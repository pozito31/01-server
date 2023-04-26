import { Router, Request, Response } from "express";
import Server from "../classes/server";
import { Socket } from "socket.io";
import { mapa, usuariosConectados } from "../sockets/socket";
import { GraficaData } from "../classes/grafica";
import { EncuestaData } from "../classes/encuesta";

const router = Router();

const grafica = new GraficaData();

const encuesta = new EncuestaData();

router.get("/mapa", (req: Request, res: Response) => {
  res.json(mapa.getMarcadores());
});

router.get("/encuesta", (req: Request, res: Response) => {
  res.json(encuesta.getDataEncuesta());
});

router.post("/encuesta", (req: Request, res: Response) => {
  const opcion = Number(req.body.opcion);
  const unidades = Number(req.body.unidades);

  encuesta.incrementarValor(opcion, unidades);

  const server = Server.instance;
  server.io.emit("cambio-encuesta", encuesta.getDataEncuesta());

  res.json(encuesta.getDataEncuesta());
});

router.get("/grafica", (req: Request, res: Response) => {
  res.json(grafica.getDataGrafica());
});

router.post("/grafica", (req: Request, res: Response) => {
  const mes = req.body.mes;
  const unidades = Number(req.body.unidades);

  grafica.incrementarValor(mes, unidades);

  const server = Server.instance;
  server.io.emit("cambio-grafica", grafica.getDataGrafica());

  res.json(grafica.getDataGrafica());
});

router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "Todo esta bien!!",
  });
});

router.post("/mensajes", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  const payload = {
    cuerpo,
    de,
  };

  const server = Server.instance;
  server.io.emit("mensaje-nuevo", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
  });
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = {
    de,
    cuerpo,
  };

  const server = Server.instance;

  server.io.in(id).emit("mensaje-privado", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  });
});

//Servicio para obtener todos los IDs de los usuarios
router.get("/usuarios", (req: Request, res: Response) => {
  const server = Server.instance;

  server.io.clients((err, clientes: Socket) => {
    if (err) {
      return res.json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      clientes,
    });
  });
});

//Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista(),
  });
});

export default router;
