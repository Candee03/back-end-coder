export function isGuest (req, res, next) {
	if (!req.cookies.token) {
		next();
	} else {
		res.redirect('/products');
	}
}