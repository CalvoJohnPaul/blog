import {index, layout, prefix, route, type RouteConfig} from '@react-router/dev/routes';

export default [
  layout('routes/Layout.tsx', [
    route('login', 'routes/Login.tsx'),
    route('logout', 'routes/Logout.tsx'),
    route('register', 'routes/Register.tsx'),
    layout('routes/Articles/Layout.tsx', [
      index('routes/Articles/GlobalFeed.tsx'),
      route('your-feed', 'routes/Articles/YourFeed.tsx'),
      route(':tag', 'routes/Articles/TagFeed.tsx'),
    ]),
    route('editor', 'routes/Editor.tsx'),
    ...prefix('article/:slug', [
      layout('routes/Article/Layout.tsx', [index('routes/Article/Comments.tsx')]),
    ]),
    route('settings', 'routes/Settings.tsx'),
    ...prefix('profile/:id', [
      layout('routes/Profile/Layout.tsx', [
        index('routes/Profile/Articles.tsx'),
        route('favourites', 'routes/Profile/Favourites.tsx'),
      ]),
    ]),
    route('favourites', 'routes/Favourites.tsx'),
    route('following', 'routes/Following.tsx'),
  ]),
] satisfies RouteConfig;
