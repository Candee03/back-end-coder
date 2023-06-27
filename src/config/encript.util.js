import bcrypt from 'bcrypt';

/**
 * 
 * @param {string} password 
 * @returns contraseña encriptada
 */
export const hashPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

/**
 * 
 * @param {object} user 
 * @param {string} password
 * @returns el resultado de la comparacion
 */
export const comparePassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};
