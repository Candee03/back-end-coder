// export function allowedModifyCart (req, res, next) {
// 	const user = req.session.user
// 	if (!user) res.status(401).send({error:'primero tienes que iniciar sesion'})
// 	if (user.cartId._id !== req.params.cid) res.status(401).send({error:'no tienes permiso agregar prductos a este carrito'})
// 	else next()
// }

// export function allowedModifyProducts (req, res, next) {
// 	const user = req.session.user
// 	if (!user) res.status(401).send({error:'primero tienes que iniciar sesion'})
// 	if (user.role !== 'admin') res.status(401).send({error:'no tienes permiso para modificar la lista de productos'})
// 	else next()
// }

export function isGuest (req, res, next) {
	if (!req.cookies.token) {
		next();
	} else {
		res.redirect('/products');
	}
}