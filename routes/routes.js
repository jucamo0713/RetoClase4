const { Router } = require('express');
const router = Router();
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const ClothesFile = fs.readFileSync("./Clothes.json", "utf8");
let Clothes = JSON.parse(ClothesFile);


router.get("/", (req, res) => {
  res.json({
    getTodos: "/ClothesG",
    getEspecifico: "/ClothesG/:id",
    post: {
      ruta: "/ClothesP",
      estructura: {
        type: "String",
        size: "String",
        brand: "String",
        cloth: "String",
        color: "String",
        male: "Boolean",
        female: "Boolean"
      },
      Caracter: "Todos son obligatorios"
    },
    put: {
      ruta: "/ClothesU/:id",
      estructura: {
        type: "String",
        size: "String",
        brand: "String",
        cloth: "String",
        color: "String",
        male: "Boolean",
        female: "Boolean"
      },
      Caracter: "Se pueden eludir datos"
    },
    Delete: "/ClothesD/:id",
    getTodosConLowDB: "/ClothesGLow",
    getEspecificoConLowDB: "/ClothesGLow/:id",
    postConLowDB: {
      ruta: "/ClothesPLow",
      estructura: {
        type: "String",
        size: "String",
        brand: "String",
        cloth: "String",
        color: "String",
        male: "Boolean",
        female: "Boolean"
      },
      Caracter: "Todos son obligatorios"
    },
    putConLowDB: {
      ruta: "/ClothesULow/:id",
      estructura: {
        type: "String",
        size: "String",
        brand: "String",
        cloth: "String",
        color: "String",
        male: "Boolean",
        female: "Boolean"
      },
      Caracter: "Se pueden eludir datos"
    },
    DeleteConLowDB: "/ClothesDLow/:id",
  });
});

router.get("/ClothesG", (req, res) => {
  res.status(200).json(Clothes);
});
router.get("/ClothesG/:id", (req, res) => {
  const { id } = req.params;
  temp = Clothes.filter((cloth) => cloth.id == id);
  if (temp.length==0) { 
    res.status(401).json({ error: "No existe ningun elemento con la id: " + id });
  }
  else {
    res.status(200).json(temp);
  }
});

router.post("/ClothesP", (req, res) => {
  const {
    type,
    size,
    brand,
    cloth,
    color,
    male,
    female } = req.body;

  if (!type || !size || !brand || !cloth || !color || !(male == true || male == false) || !(female == true || female == false)) {
    res.status(401).json({ error: "Por favor, diligencie todos los datos" });
  } else {

    const id = Clothes[Clothes.length - 1].id + 1;

    let newcloth = {
      id,
      type,
      size,
      brand,
      cloth,
      color,
      male,
      female
    };

    Clothes.push(newcloth);
    const json_Clothes = JSON.stringify(Clothes);

    fs.writeFileSync("./Clothes.json", json_Clothes, "utf-8");

    res.status(200).json(Clothes);

  }
});

router.put("/ClothesU/:id", (req, res) => {

  const {
    type,
    size,
    brand,
    cloth,
    color,
    male,
    female } = req.body;
  const { id } = req.params;
  if (Clothes.filter((cloth) => { return cloth.id == id }).length == 0) {
    res.status(401).json({ error: "No existe ningun elemento con la id: " + id });
  } else {
    if (type) {
      Clothes.filter((cloth) => {
        if (cloth.id == id) {
          cloth.type = type;
        }
      });
    }
    if (size) {
      Clothes.filter((cloth) => {
        if (cloth.id == id) {
          cloth.size = size;
        }
      });
    }
    if (brand) {
      Clothes.filter((cloth) => {
        if (cloth.id == id) {
          cloth.brand = brand;
        }
      });
    }
    if (cloth) {
      Clothes.filter((cloths) => {
        if (cloths.id == id) {
          cloths.cloth = cloth;
        }
      });
    }
    if (color) {
      Clothes.filter((cloth) => {
        if (cloth.id == id) {
          cloth.color = color;
        }
      });
    }
    if (male == true || male == false) {
      Clothes.filter((cloth) => {
        if (cloth.id == id) {
          cloth.male = male;
        }
      });
    }
    if (female == true || female == false) {
      Clothes.filter((cloth) => {
        if (cloth.id == id) {
          cloth.female = female;
        }
      });
    }

    const json_Clothes = JSON.stringify(Clothes);
    fs.writeFileSync("./Clothes.json", json_Clothes, "utf-8");

    res.status(200).json(Clothes);


  }



});


router.delete("/ClothesD/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(401).json({ error: "No existe ningun elemento con la id: " + id });
  } else {
    const indexcloth = Clothes.findIndex((cloth) => { return cloth.id == id });
    Clothes.splice(indexcloth, 1);
    const json_Clothes = JSON.stringify(Clothes);
    fs.writeFileSync("./Clothes.json", json_Clothes, "utf-8");
    res.status(200).json(Clothes);
  }

});

router.get("/ClothesGLow", (req, res) => {
  const adapter = new FileSync('Clothes.json')
  const db = low(adapter);
  res.status(200).json(db);
});


router.get("/ClothesGLow/:id", (req, res) => {
  const adapter = new FileSync('Clothes.json')
  const db = low(adapter);
  const id = parseInt(req.params.id);
  temp=db.find({ id: id }).value();
  if (!temp) { 
    res.status(401).json({ error: "No existe ningun elemento con la id: " + id });
  }
  else {
    res.status(200).json(temp);
  }
});

router.post("/ClothesPLow", (req, res) => {
  const adapter = new FileSync('Clothes.json');
  const db = low(adapter);
  const id = parseInt(req.params.id);
  const {
    type,
    size,
    brand,
    cloth,
    color,
    male,
    female } = req.body;

  if (!type || !size || !brand || !cloth || !color || !(male == true || male == false) || !(female == true || female == false)) {
    res.status(401).json({ error: "Por favor, diligencie todos los datos" });
  } else {

    const id = db.findLast().value().id + 1;
    db.push({
      id,
      type,
      size,
      brand,
      cloth,
      color,
      male,
      female
    }).write();

    res.status(200).json(db);
  }
});

router.put("/ClothesULow/:id", (req, res) => {
  const adapter = new FileSync('Clothes.json');
  const db = low(adapter);
  const {
    type,
    size,
    brand,
    cloth,
    color,
    male,
    female } = req.body;
  const id = parseInt(req.params.id);
  if (!db.find({ id: id }).value()) {
    res.status(401).json({ error: "No existe ningun elemento con la id: " + id });
  } else {
    if (type) {
      db.find({ id: id }).assign({type:type}).write();
    }
    if (size) {
      db.find({ id: id }).assign({size:size}).write();
    }
    if (brand) {
      db.find({ id: id }).assign({brand:brand}).write();
    }
    if (cloth) {
      db.find({ id: id }).assign({cloth:cloth}).write();
    }
    if (color) {
      db.find({ id: id }).assign({color:color}).write();
    }
    if (male == true || male == false) {
      db.find({ id: id }).assign({male:male}).write();
    }
    if (female == true || female == false) {
      db.find({ id: id }).assign({female:female}).write();
    }
    res.status(200).json(db);
  }
});
router.delete("/ClothesDLow/:id", (req, res) => {
const adapter = new FileSync('Clothes.json');
  const db = low(adapter);
  const id = parseInt(req.params.id);
  if (!db.find({ id: id }).value()) {
    res.status(401).json({ error: "No existe ningun elemento con la id: " + id });
  } else {
    db.remove({ id: id }).write();
    res.status(200).json(db);
  }
});

module.exports = router;