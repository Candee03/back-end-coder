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

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/products');
	}
}