import { expect, jest } from "@jest/globals"
import { fn } from "jest-mock"
import { Context, GetStateFunction, SetStateFunction } from ".."
import browser from "../../__mocks__/webextension-polyfill"
import { State, initialState } from "../../shared/types/State"
import { getUser } from "../api/user"
import { DispatchFunction } from "../dispatch"
import { startLoginFlow } from "./login"

jest.mock("../api/user")
const mockedGetUser = getUser as jest.Mocked<typeof getUser>

jest.mock("./toasts")

jest.useFakeTimers()

beforeEach(() => {
    mockedGetUser.mockReturnValue(
        Promise.resolve([
            {
                id: "12345",
                login: "user",
                display_name: "User",
                type: "",
                broadcaster_type: "",
                description: "hello world",
                profile_image_url: "https://picsum.photos/200/300",
                offline_image_url: "https://picsum.photos/200/300",
                view_count: 1234,
                created_at: "string"
            }
        ])
    )
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("getTwitchContent", () => {
    it("should do nothing when logged in", async () => {
        const getState = fn<GetStateFunction>().mockReturnValueOnce({
            ...initialState,
            loggedInState: { status: "LOGGED_IN" }
        } as State)

        const setState = fn<SetStateFunction>()

        await startLoginFlow({ getState, setState } as unknown as Context)

        expect(setState).not.toHaveBeenCalled()
    })

    it("should do nothing when in progress", async () => {
        const getState = fn<GetStateFunction>().mockReturnValueOnce({
            ...initialState,
            loggedInState: { status: "IN_PROGRESS" }
        } as State)

        const setState = fn<SetStateFunction>()

        await startLoginFlow({ getState, setState } as unknown as Context)

        expect(setState).not.toHaveBeenCalled()
    })

    it("should set the status to IN_PROGRESS", async () => {
        const getState =
            fn<GetStateFunction>().mockReturnValueOnce(initialState)

        const setState = fn<SetStateFunction>()

        await startLoginFlow({ getState, setState } as unknown as Context)

        const updateStateFunction = setState.mock.calls[0][0]
        expect(updateStateFunction(initialState).loggedInState.status).toBe(
            "IN_PROGRESS"
        )
    })

    it("should store the access token as part of the state", async () => {
        const getState =
            fn<GetStateFunction>().mockReturnValueOnce(initialState)

        const setState = fn<SetStateFunction>()

        const mockLaunchWebAuthFlow = fn<
            typeof browser.identity.launchWebAuthFlow
        >().mockImplementation(launchWebAuthFlowTestImpl)
        browser.identity.launchWebAuthFlow = mockLaunchWebAuthFlow

        await startLoginFlow({
            getState,
            setState,
            dispatch: () => {}
        } as unknown as Context)

        expect(mockLaunchWebAuthFlow).toHaveBeenCalled()
        const updateStateFunction =
            setState.mock.calls[setState.mock.calls.length - 1][0]
        const updatedState = updateStateFunction(initialState)
        expect(updatedState.loggedInState.status).toBe("LOGGED_IN")
        expect(
            updatedState.loggedInState.status === "LOGGED_IN"
                ? updatedState.loggedInState.accessToken
                : ""
        ).toBe("access_token")
    })

    it("should dispatch a fetchStreams action after successful login", async () => {
        const getState =
            fn<GetStateFunction>().mockReturnValueOnce(initialState)

        const setState = fn<SetStateFunction>()

        const dispatch = fn<DispatchFunction>()

        const mockLaunchWebAuthFlow = fn<
            typeof browser.identity.launchWebAuthFlow
        >().mockImplementation(launchWebAuthFlowTestImpl)
        browser.identity.launchWebAuthFlow = mockLaunchWebAuthFlow

        await startLoginFlow({
            getState,
            setState,
            dispatch
        } as unknown as Context)

        expect(dispatch).toHaveBeenCalledWith(
            { action: "fetchStreams" },
            expect.anything()
        )
    })

    it("should reset the status if an error happens", async () => {
        const getState =
            fn<GetStateFunction>().mockReturnValueOnce(initialState)

        const setState = fn<SetStateFunction>()

        const dispatch = fn<DispatchFunction>()

        const mockLaunchWebAuthFlow = fn<
            typeof browser.identity.launchWebAuthFlow
        >().mockRejectedValue({ message: "There was an error" })
        browser.identity.launchWebAuthFlow = mockLaunchWebAuthFlow

        await startLoginFlow({
            getState,
            setState,
            dispatch
        } as unknown as Context)

        const updateStateFunction =
            setState.mock.calls[setState.mock.calls.length - 1][0]
        expect(updateStateFunction(initialState).loggedInState.status).toBe(
            "NOT_LOGGED_IN"
        )
    })
})

const launchWebAuthFlowTestImpl = ({ url }: { url: string }) => {
    console.log("launchWebAuthFlowTestImpl")
    const urlSearchParams = new URL(url).searchParams
    return Promise.resolve(
        `https://test.chromiumapp.org/#state=${urlSearchParams.get(
            "state"
        )}&token_type=bearer&access_token=access_token`
    )
}
