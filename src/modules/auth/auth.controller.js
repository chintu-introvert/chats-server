import authService from './auth.service.js';

class AuthController {
    async register(req, res) {
        const { name, email, password } = req.body;
        const result = await authService.register({ name, email, password });
        res.status(201).json(result);
    }

    async login(req, res) {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.status(200).json(result);
    }
}

export default new AuthController();