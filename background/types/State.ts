export type State = {
    loggedInState:
        | {
              status: "NOT_LOGGED_IN"
          }
        | {
              status: "IN_PROGRESS"
          }
        | ({
              status: "LOGGED_IN"
          } & User)
    streamState: {
        streams: Stream[]
        status: "IDLE" | "FETCHING"
        quality: Quality
        lastFetchTime: string
    }
    toasts: Toast[]
}

export const qualities = {
    auto: "Auto",
    chunked: "Source (1080p60)",
    "720p60": "720p60",
    "720p30": "720p",
    "480p30": "480p"
}

export type Quality = keyof typeof qualities

export type User = {
    accessToken: string
    login: string
    displayName: string
    id: string
    profileImageUrl: string
}

export type Stream = {
    login: string
    displayName: string
    gameId: string
    gameName: string
    type: string
    title: string
    viewerCount: number
    startedAt: string
    thumbnailUrl: string
    profileImageUrl: string | undefined
}

export type Toast = {
    type: "info" | "warn" | "success" | "error"
    message: string
}
