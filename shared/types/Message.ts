import { Quality } from "./State"

export type Message =
    | {
          action: "login"
          data?: undefined
      }
    | {
          action: "logout"
          data?: undefined
      }
    | {
          action: "fetchStreams"
          data?: undefined
      }
    | {
          action: "refreshStreams"
          data?: RefreshStreamsData
      }
    | {
          action: "click"
          data: ClickData
      }
    | {
          action: "changeQuality"
          data: Quality
      }
    | {
          action: "clearToasts"
          data?: undefined
      }

export type ClickData = {
    streamLogin: string
    clickedItem: "thumbnail" | "title" | "name" | "gameName" | "profileImage"
    targetBlank: boolean
}

export type RefreshStreamsData = {
    force?: boolean
}
