export default class CustomErrors {
    static createError(err){
        const error = new Error(err.message, {cause: err.cause});
        error.name = err.name;
        error.code = err.code;
        throw error;
    }
}