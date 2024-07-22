import jwt from "jsonwebtoken";

// creazione nuovo token 
export const generateJWT = (payload) => {

    return new Promise((resolve, reject) =>
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1 day" }, //quanto tempo si resta loggati
            (err, token) => {
                if (err) reject(err); //se va male
                else resolve(token); //se va bene
            }
        )
    );
};


//verifica token
export const verifyJWT = (token) => {
    return new promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        })
    )
}
