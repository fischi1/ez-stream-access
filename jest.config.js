import { createRequire } from "module"
import { pathsToModuleNameMapper } from "ts-jest"

const require = createRequire(import.meta.url)
const { compilerOptions } = require("./tsconfig.json")

const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "(popup|background)/.*\\.(test|spec)\\.(ts|tsx)$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                diagnostics: {
                    ignoreCodes: [1343]
                },
                astTransformers: {
                    before: [
                        {
                            path: "node_modules/ts-jest-mock-import-meta", // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
                            options: {
                                metaObjectReplacement: {
                                    env: {
                                        VITE_DEBUG_CALLBACK_URL: undefined
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
    })
}

export default config
