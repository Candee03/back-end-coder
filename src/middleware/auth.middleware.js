export function isAuth (req, res, next) {
	if (!req.cookies.token) {
		res.redirect('/login');
	} else {
		next();
	}
}

export function authToRestore (req, res, next) {
	if (req.cookies.tokenRestore) {
		next()
	} else {
		return res.render('restorePassword', {messageError: 'Debes volver a generar un token porque el anterior ya venció'})
	}
}