import AdmZip from "adm-zip"
import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"

const ZIP_FILENAME = (version) => `ez-stream-access-v${version}.zip`

const packageJson = JSON.parse(readFileSync("package.json"))
console.log(`Building ${ZIP_FILENAME(packageJson.version)}`)

console.log("\n## building project ##")
execSync("npm run build", { stdio: "inherit" })

console.log("\n## modifying manifest ##")
const manifest = JSON.parse(readFileSync("dist/manifest.json", "utf8"))

manifest.version = packageJson.version
delete manifest.key

writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 4))

console.log("\n## creating zip ##")
const zip = new AdmZip()
zip.addLocalFolder("dist")
zip.writeZip(`dist/${ZIP_FILENAME(packageJson.version)}`)

console.log("\n## DONE ##")
console.log(`Built file 'dist/${ZIP_FILENAME(packageJson.version)}'`)
