import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LembraVenda",
    short_name: "LembraVenda",
    description:
      "Agenda de vendas para quem vende pelo WhatsApp organizar clientes, pedidos, cobranças e recompras.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E8",
    theme_color: "#2E7D57",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
