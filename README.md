# Spotify Stats Webpage

A dynamic, modern web application built with **React (Next.js)** and **Framer Motion** that retrieves your personalized Spotify statistics using the **Spotify API**. This app displays your favorite artists and tracks in an interactive and visually appealing interface.

## Local installation

1. Clone the GitHub repo

```
git clone https://github.com/xHugo21/spotistats.git
```

2. Install the dependencies

```
npm i
```

3. Rename your .env.example as .env and replace your Spotify Client ID

```
mv .env.example .env
```

4. Navigate to lib/config.ts and modify the base path and redirection url with your desired one

5. Run the server

```
npm run dev
```

## Features

- 🎧 **Spotify Authentication**: Securely log in using your Spotify account to retrieve personalized data.
- 📊 **User Stats**: View your top tracks and artists over different time periods.
- 💫 **Interactive Animations**: Smooth animations and transitions using Framer Motion for a seamless user experience.
- 🔄 **Real-Time Updates**: Fetch real-time data from the Spotify API, always showing your latest stats.
- 🌐 **Responsive Design**: Works perfectly on mobile, tablet, and desktop.

## Technologies Used

- **Next.js** - Framework for server-side rendering and static site generation.
- **React** - Frontend library for building user interfaces.
- **Framer Motion** - Animation library for smooth and modern transitions.
- **Spotify API** - Retrieve user data from Spotify’s public API.
- **shadcn/ui** - Component library.

## Acknowledgements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
