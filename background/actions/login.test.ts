import { State, initialState } from "@shared/types/State"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Context, GetStateFunction, SetStateFunction } from ".."
import browser from "../../__mocks__/webextension-polyfill"
import { getUser } from "../api/user"
import { DispatchFunction } from "../dispatch"
import { startLoginFlow } from "./login"

vi.mock("../api/user")

vi.mock("./toasts")

vi.mock("webextension-polyfill")

vi.useFakeTimers()

beforeEach(() => {
    vi.mocked(getUser).mockReturnValue(
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
    vi.clearAllMocks()
})

describe("getTwitchContent", () => {
    it("should do nothing when logged in", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce({
                ...initialState,
                loggedInState: { status: "LOGGED_IN" }
            } as State)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        await startLoginFlow({ getState, setState } as unknown as Context)

        expect(setState).not.toHaveBeenCalled()
    })

    it("should do nothing when in progress", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce({
                ...initialState,
                loggedInState: { status: "IN_PROGRESS" }
            } satisfies State)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        await startLoginFlow({ getState, setState } as unknown as Context)

        expect(setState).not.toHaveBeenCalled()
    })

    it("should set the status to IN_PROGRESS", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce(initialState)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        await startLoginFlow({ getState, setState } as unknown as Context)

        const updateStateFunction = setState.mock.calls[0][0]
        expect(updateStateFunction(initialState).loggedInState.status).toBe(
            "IN_PROGRESS"
        )
    })

    it("should store the access token as part of the state", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce(initialState)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        const mockLaunchWebAuthFlow = vi
            .fn<any, ReturnType<typeof browser.identity.launchWebAuthFlow>>()
            .mockImplementation(launchWebAuthFlowTestImpl)
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
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce(initialState)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        const dispatch = vi.fn<any, ReturnType<DispatchFunction>>()

        const mockLaunchWebAuthFlow = vi
            .fn<any, ReturnType<typeof browser.identity.launchWebAuthFlow>>()
            .mockImplementation(launchWebAuthFlowTestImpl)
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
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce(initialState)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        const dispatch = vi.fn<any, ReturnType<DispatchFunction>>()

        const mockLaunchWebAuthFlow = vi
            .fn<any, ReturnType<typeof browser.identity.launchWebAuthFlow>>()
            .mockRejectedValue({ message: "There was an error" })
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
