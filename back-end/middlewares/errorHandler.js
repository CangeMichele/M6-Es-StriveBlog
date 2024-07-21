// ----- (400) - Bad Request
export const badRequestHandler = (err, req, res, next) => {
    if (err.status === 400 || err.name === "ValidationError") {
      res.status(400).json({
        error: "ERRORE: richiesta non valida",
        message: err.message,
      });
    } else {
      next(err);
    }
  };
  
  // ----- (401) - Unauthorized
  export const unauthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
      res.status(401).json({
        error: "ERRORE: autenticazione non valida",
        message: "Richiesta nuova autenticazione",
      });
    } else {
      // Se non è un errore 401, passa al prossimo middleware di gestione errori
      next(err);
    }
  };
  
  // ----- (404) - Not Found
  export const notFoundHandler = (req, res, next) => {
    // nessun controllo sullo stato, se è qui è per esclusione/caduta
    res.status(404).json({
      error: "ERRORE: risorsa non trovata",
      message: "La risorsa richiesta non è stata trovata",
    });
  };
  
  // ----- (500) - Internal Server Error - tutti gli altri errori non specificati
  export const genericErrorHandler = (err, req, res, next) => {
  
    // visualizzo stack trace per debug
    console.error(err.stack);
  
    res.status(500).json({
      error: "Internal Server Error",
      message: "Errore generico",
    });

  };