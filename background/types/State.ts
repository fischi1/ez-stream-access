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
    }
}

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
