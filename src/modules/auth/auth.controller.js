import authService from './auth.service.js';

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await authService.register({ name, email, password });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    // login 
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });
            console.log(result, 'result while login the application ');
            res.status(200).json(result);
        } catch (error) {
            console.log(error, 'error while login the application ');
            next(error);
        }
    }
}

export default new AuthController();