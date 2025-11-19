import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route('/auth/login', 'routes/auth.login.tsx'),
    route('/auth/signup', 'routes/auth.signup.tsx'),
    route('/auth/forgot-password', 'routes/auth.forgot-password.tsx'),
    route('/auth/callback', 'routes/auth.callback.tsx'),
    route('/home', 'routes/home.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/resume-hr/:id', 'routes/resume-hr.tsx'),
    route('/resume-enhance/:id', 'routes/resume-enhance.$id.tsx'),
    route('/about', 'routes/about.tsx'),
    route('/team', 'routes/team.tsx'),
    route('/dashboard', 'routes/dashboard.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
    route('/api/analyze', 'routes/api.analyze.tsx'),
] satisfies RouteConfig;
