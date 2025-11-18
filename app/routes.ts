import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/resume-hr/:id', 'routes/resume-hr.tsx'),
    route('/about', 'routes/about.tsx'),
    route('/team', 'routes/team.tsx'),
    route('/dashboard', 'routes/dashboard.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
    route('/api/analyze', 'routes/api.analyze.tsx'),
] satisfies RouteConfig;
