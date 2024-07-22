import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'));

//genera una stringa di caratteri casuali da poter utilizzare come token