function modelValidation(model, data) {
  if (data === undefined) return {};
  else if (typeof model != "object" || typeof data != "object")
    throw new Error(
      "Tipos de datos no son correctos en la validacion de modelos"
    );

  if (data instanceof Array) {
    let res = data.map((row) => {
      let dto = { ...model };
      let dtoKeys = Object.keys(dto);
      for (let key of dtoKeys) {
        if (typeof dto[key] == "number") {
          dto[key] = Number(row[key]);
          if (Number.isNaN(dto[key])) {
            throw new Error("A number result is NaN");
          }
        } else if (typeof dto[key] == "function") {
          dto[key] = new Date(row[key]).toISOString();
        } else if (typeof dto[key] == "string") {
          dto[key] = String(row[key]);
        } else if (typeof dto[key] == "boolean") {
          dto[key] = Boolean(row[key]);
        } else {
          dto[key] = row[key];
        }
      }

      return dto;
    });
    return res;
  } else if (data instanceof Object) {
    let dto = { ...model };
    let dtoKeys = Object.keys(dto);
    for (let key of dtoKeys) {
      if (typeof dto[key] == "number") {
        dto[key] = Number(data[key]);
        if (Number.isNaN(dto[key])) {
          throw new Error("A number result is NaN");
          break;
        }
      } else if (typeof dto[key] == "function") {
        dto[key] = new Date(data[key]).toISOString();
      } else if (typeof dto[key] == "string") {
        dto[key] = String(data[key]);
      } else if (typeof dto[key] == "boolean") {
        dto[key] = Boolean(row[key]);
      } else {
        dto[key] = data[key];
      }
    }
    return dto;
  } else {
    throw new Error("La data enviada no esta un ARRAY o OBJETO");
  }
}

module.exports = { modelValidation };
