export function isAuth(req, res, next) {
	try {
		if (req.session.user) {
		next()
		} else {
			res.redirect('/login');
		}
	}
	catch (err) {
		res.status(401)
	}
}

export function onlyUser(req, res, next) {
	try {
		if (req.session.user.role === 'user') {
			next()
		} else {
			res.redirect('/products')
		}
	}
	catch (err) {
		res.status(403)
	}
}
export function onlyAdmin(req, res, next) {
	try {
		if (req.session.user.role === 'admin') {
			next()
		} else {
			res.redirect('/products')
		}
	}
	catch (err) {
		res.status(403)
	}
}
export function isAdmin(req, res, next) {
	try {
		console.log('here1');
		console.log(req.session);
		// if (req.session.user.role === 'admin') {
		// 	next()
		// }
		console.log('here');
		res.status(401)
	}
	catch (err) {
		res.status(403)
	}
}

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/products');
	}
}