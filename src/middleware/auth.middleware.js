export function isAuth(req, res, next) {
	if (req.session.user) {
		next()
	} else {
		res.redirect('/login');
	}
}

// export function isAdmin (req, res, next) {
// 	if (req.session.user.email === 'adminCoder@coder.com') { //ACA SE AGREGAN LOS USUARIOS ADMINISTRADORES
// 		req.session.user.rol = 'admin'
// 		next()
// 	} else {
// 		next()
// 	}
// }

export function onlyAdmin(req, res, next) {
	if (req.session.user.rol === 'admin') {
		next()
	} else {
		res.redirect('/products')
	}
}

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/products');
	}
}