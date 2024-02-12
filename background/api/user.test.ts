import { jest, expect } from "@jest/globals"
import fetchWithRetry from "./fetchWithRetry"
import { UserData, UserResponse, getUser } from "./user"

jest.mock("./fetchWithRetry")
const mockedfetchWithRetry = fetchWithRetry as jest.Mocked<
    typeof fetchWithRetry
>

afterEach(() => {
    jest.clearAllMocks()
})

describe("getUser", () => {
    it("should return info about the user", async () => {
        const userData = generateUserData("user1")

        mockedfetchWithRetry.mockReturnValue(
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve<UserResponse>({
                        data: [userData]
                    })
            }) as Promise<Response>
        )

        const user = await getUser("accessToken")

        expect(mockedfetchWithRetry).toBeCalledTimes(1)
        expect(user).toEqual([userData])
    })

    it("should return info about other uses if login param is used", async () => {
        const userData = [
            generateUserData("user1"),
            generateUserData("user2"),
            generateUserData("user3")
        ]

        mockedfetchWithRetry.mockReturnValue(
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve<UserResponse>({
                        data: userData
                    })
            }) as Promise<Response>
        )

        const users = await getUser(
            "accessToken",
            userData.map((user) => user.login)
        )

        expect(mockedfetchWithRetry).toBeCalledTimes(1)
        expect(users).toEqual(userData)
    })

    it("should throw if fetch returns an error", async () => {
        mockedfetchWithRetry.mockReturnValue(
            Promise.resolve({
                ok: false,
                status: 401,
                statusText: "Unauthorized"
            }) as Promise<Response>
        )

        try {
            await getUser("userId")
        } catch (error) {
            expect(error).toEqual({ statusText: "Unauthorized", status: 401 })
        }
    })

    it("should throw if fetch returns an for multiple users", async () => {
        mockedfetchWithRetry.mockReturnValue(
            Promise.resolve({
                ok: false,
                status: 401,
                statusText: "Unauthorized"
            }) as Promise<Response>
        )

        try {
            await getUser("userId", ["user1", "user2", "user3"])
        } catch (error) {
            expect(error).toEqual({ statusText: "Unauthorized", status: 401 })
        }
    })

    it("should handle requests where more than the max page size of users are requested", async () => {
        const userData = Array.from(Array(430).keys()).map((index) =>
            generateUserData(`user${index}`)
        )

        mockedfetchWithRetry.mockImplementation(
            (url) =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve<UserResponse>({
                            data: getRequestedUsersForMock(url + "", userData)
                        })
                }) as Promise<Response>
        )

        const users = await getUser(
            "accessToken",
            userData.map((user) => user.login)
        )

        expect(mockedfetchWithRetry).toBeCalledTimes(5)
        expect(users.map((user) => user.login)).toEqual(
            userData.map((user) => user.login)
        )
    })

    it("should handle requests where more than the max page size of users are requested and the page size is an exact multiple of the page size", async () => {
        const userData = Array.from(Array(200).keys()).map((index) =>
            generateUserData(`user${index}`)
        )

        mockedfetchWithRetry.mockImplementation(
            (url) =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve<UserResponse>({
                            data: getRequestedUsersForMock(url + "", userData)
                        })
                }) as Promise<Response>
        )

        const users = await getUser(
            "accessToken",
            userData.map((user) => user.login)
        )

        expect(mockedfetchWithRetry).toBeCalledTimes(2)
        expect(users).toEqual(userData)
    })
})

const getRequestedUsersForMock = (url: string, users: UserData[]) =>
    new URL(url + "").searchParams
        .getAll("login")
        .map((login) => users.find((user) => user.login === login)!)

const generateUserData = (login: string): UserData => ({
    broadcaster_type: "partner",
    created_at: new Date().toISOString(),
    description: "Hello World!",
    display_name: login.toUpperCase(),
    id: `user_id:${login}`,
    login: login,
    offline_image_url: "https://picsum.photos/320/180",
    profile_image_url: "https://picsum.photos/320/180",
    type: "",
    view_count: 12345
})
