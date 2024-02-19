import { expect, jest } from "@jest/globals"
import { fn } from "jest-mock"
import fetchWithRetry from "./fetchWithRetry"

beforeEach(() => {
    // @ts-ignore
    global.setTimeout = fn((callback: () => void) => callback())
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("fetchWithRetry", () => {
    it("should work like a normal fetch", async () => {
        // @ts-ignore
        global.fetch = fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ hello: "world" })
            })
        )

        const response = await fetchWithRetry("http://super-secret-api.com", {
            headers: { Authorization: "Bearer token" }
        })

        const json = await response.json()

        expect(global.fetch).toBeCalledTimes(1)
        expect(global.fetch).toBeCalledWith("http://super-secret-api.com", {
            headers: { Authorization: "Bearer token" }
        })
        expect(json).toEqual({ hello: "world" })
    })

    it("should retry the call on 429", async () => {
        // @ts-ignore
        global.fetch = fn()
            .mockReturnValueOnce(Promise.resolve({ status: 429 }))
            .mockReturnValueOnce(Promise.resolve({ status: 429 }))
            .mockReturnValueOnce(Promise.resolve({ status: 429 }))
            .mockReturnValueOnce(
                Promise.resolve({
                    json: () => Promise.resolve({ hello: "world" })
                })
            )

        const response = await fetchWithRetry(
            "http://super-secret-api.com",
            {
                headers: { Authorization: "Bearer token" }
            },
            15
        )

        const json = await response.json()

        expect(global.fetch).toBeCalledTimes(4)
        expect(json).toEqual({ hello: "world" })
    })

    it("return 429 if max retries are reached", async () => {
        // @ts-ignore
        global.fetch = fn()
            .mockReturnValueOnce(Promise.resolve({ status: 429 }))
            .mockReturnValueOnce(Promise.resolve({ status: 429 }))
            .mockReturnValueOnce(Promise.resolve({ status: 429 }))

        const response = await fetchWithRetry(
            "http://super-secret-api.com",
            {
                headers: { Authorization: "Bearer token" }
            },
            2
        )

        expect(global.fetch).toBeCalledTimes(3)
        expect(response.status).toBe(429)
    })

    it("should return other status immedieately", async () => {
        // @ts-ignore
        global.fetch = fn().mockReturnValueOnce(
            Promise.resolve({ status: 401 })
        )

        const response = await fetchWithRetry(
            "http://super-secret-api.com",
            {
                headers: { Authorization: "Bearer token" }
            },
            2
        )

        expect(global.fetch).toBeCalledTimes(1)
        expect(response.status).toBe(401)
    })
})
