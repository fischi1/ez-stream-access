import { Stream } from "../api/streamsFollowed"

const generateStream = (login: string): Stream => ({
    game_id: `game_id:${login}`,
    game_name: "The Game",
    id: `stream_id:${login}`,
    is_mature: false,
    started_at: new Date().toISOString(),
    tag_ids: [],
    tags: [],
    thumbnail_url: "https://picsum.photos/320/180",
    title: `This is the stream title of ${login}`,
    type: "live",
    user_id: `user_id:${login}`,
    user_login: login,
    user_name: login.toUpperCase(),
    viewer_count: 12347
})

export { generateStream }
