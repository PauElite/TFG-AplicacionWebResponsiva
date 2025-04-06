export type MediaPlatform = "youtube" | "vimeo" | "other";

/**
 * Devuelve una URL embebida y la plataforma detectada (YouTube, Vimeo, u otra)
 */
export function getEmbedMedia(url: string): { embedUrl: string; platform: MediaPlatform } {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
        return {
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
            platform: "youtube"
        };
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return {
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
            platform: "vimeo"
        };
    }

    return {
        embedUrl: url,
        platform: "other"
    };
}

/**
 * Devuelve la URL completa para imágenes, ya sea externa o desde el backend
 */
export function getImageSrc(url: string | undefined): string {
    if (url) {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
    }

    return `http://localhost:3002${url}`;
}
