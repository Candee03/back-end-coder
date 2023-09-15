export function isAuth (req, res, next) {
	if (req.cookies.token) {
		res.redirect('/products');
	} else {
		next();
	}
}