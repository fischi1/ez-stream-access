const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "(popup|background)/.*\\.(test|spec)\\.(ts|tsx)$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}

export default config
