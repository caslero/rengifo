export default function manifest() {
  return {
    name: "Gestion Comunal Zamora",
    short_name: "Comunal Zamora",
    description: "Sistema de gestion comunal y censo poblacional.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff56f",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
