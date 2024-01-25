import React, { useEffect, useState } from "react"
import browser from "webextension-polyfill"
import { State } from "../background"

const App = () => {
    const [state, setState] = useState<State>()

    useEffect(() => {
        var port = browser.runtime.connect({ name: "twitch-web-extension" })
        port.onMessage.addListener(({ state }) => setState(state))
    }, [])

    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" })
    }

    return (
        <div className="bg-slate-600">
            <h1>Cat Facts in the popup!</h1>
            <button onClick={handleLoginClick}>Login</button>
            <p className="text-white whitespace-break-spaces font-mono py-4">
                {JSON.stringify(state, null, 4)}
            </p>
            <p className="py-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur sit dolorum dolorem, laborum reprehenderit dolores
                nostrum tenetur aut inventore. Blanditiis consequuntur corporis
                soluta quae sint! Blanditiis alias at quas consectetur?
                Accusamus, perferendis optio quibusdam ullam ducimus quia sequi
                veritatis repellat inventore cumque. Minima a vitae numquam.
                Itaque fugiat magni quod aperiam, esse recusandae voluptatem
                voluptates modi consectetur at corrupti a? Nemo, sint. Eum
                ullam, molestias neque quod nihil cumque vel blanditiis deserunt
                sequi soluta labore optio exercitationem fuga iste praesentium.
                Eveniet quisquam dolore reiciendis eum deleniti, nam quaerat
                facere provident. Possimus impedit minima necessitatibus numquam
                dicta illum dolores minus exercitationem voluptates deserunt.
                Reprehenderit, sunt qui amet veritatis cupiditate eos ducimus
                atque debitis animi dicta. Maxime inventore voluptates corrupti
                tenetur maiores! Dolores ratione nulla facere quisquam soluta
                consequatur recusandae magnam qui repellat incidunt. Delectus
                velit tenetur placeat perspiciatis rerum. Similique aspernatur
                rerum, vero aperiam officiis odio porro accusantium temporibus
                consequuntur quam. Iure corporis enim consectetur delectus optio
                dolorum nemo cumque molestias necessitatibus! Quae eos sapiente,
                sequi deleniti commodi facilis perferendis recusandae ea est
                aliquid quo doloribus blanditiis. Expedita repellendus facilis
                aspernatur. Ipsa, vero numquam unde, architecto cum asperiores
                exercitationem esse omnis ipsum cumque at nostrum reprehenderit
                nulla blanditiis quibusdam inventore sit fuga sequi impedit
                nobis nihil minima. Architecto consectetur tempore obcaecati?
                Alias totam at voluptatem eveniet debitis perspiciatis dolorem
                possimus exercitationem nobis tempore! Vel illo quis non
                doloremque unde odit nihil necessitatibus consectetur ea
                delectus culpa reiciendis, alias veniam accusantium sapiente!
                Nostrum, animi? Ad debitis sapiente praesentium odio,
                repellendus inventore adipisci numquam sequi recusandae? Id
                nobis, et, suscipit minus praesentium illo numquam nulla minima
                ex vero quas maiores totam esse commodi. Quis ex sapiente
                obcaecati, voluptate repellat dolore ducimus accusamus? Iste eos
                similique adipisci. Aperiam cupiditate veniam illo quibusdam
                mollitia? Blanditiis cum ipsum quia, nostrum pariatur reiciendis
                placeat quasi error exercitationem. Aliquid quae tempore fugiat
                et velit odit porro totam voluptates, alias odio, rerum pariatur
                nesciunt repellat aspernatur dolorem quisquam maxime tenetur non
                eius esse! Officiis quisquam optio consequuntur unde error! Ex,
                magnam ab fuga dicta repellendus nemo sit beatae atque quod
                laborum, distinctio aliquam eligendi aut sequi magni rem natus
                quae quos praesentium veniam laboriosam. Quaerat qui minus sint
                suscipit! Doloribus reiciendis expedita mollitia voluptatem quis
                doloremque laudantium ea quam voluptas optio ex, fuga
                necessitatibus reprehenderit impedit assumenda. Pariatur
                molestiae dignissimos labore magni harum illo doloribus
                explicabo veniam perspiciatis officia! Adipisci, voluptatibus
                magni! Voluptate dolores labore, odio nemo a aut nobis, nulla
                ipsa quia accusantium minus eos eius. Adipisci nobis atque
                aliquid debitis magni reiciendis! Dolore molestias nihil
                voluptatem accusamus? Nulla voluptas ad recusandae soluta? Animi
                iste ratione quo aspernatur eveniet rerum facere dolorum unde
                officia molestias recusandae voluptatum dicta explicabo corrupti
                excepturi tempora incidunt, perferendis ipsa sint fugiat
                accusantium!
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur sit dolorum dolorem, laborum reprehenderit dolores
                nostrum tenetur aut inventore. Blanditiis consequuntur corporis
                soluta quae sint! Blanditiis alias at quas consectetur?
                Accusamus, perferendis optio quibusdam ullam ducimus quia sequi
                veritatis repellat inventore cumque. Minima a vitae numquam.
                Itaque fugiat magni quod aperiam, esse recusandae voluptatem
                voluptates modi consectetur at corrupti a? Nemo, sint. Eum
                ullam, molestias neque quod nihil cumque vel blanditiis deserunt
                sequi soluta labore optio exercitationem fuga iste praesentium.
                Eveniet quisquam dolore reiciendis eum deleniti, nam quaerat
                facere provident. Possimus impedit minima necessitatibus numquam
                dicta illum dolores minus exercitationem voluptates deserunt.
                Reprehenderit, sunt qui amet veritatis cupiditate eos ducimus
                atque debitis animi dicta. Maxime inventore voluptates corrupti
                tenetur maiores! Dolores ratione nulla facere quisquam soluta
                consequatur recusandae magnam qui repellat incidunt. Delectus
                velit tenetur placeat perspiciatis rerum. Similique aspernatur
                rerum, vero aperiam officiis odio porro accusantium temporibus
                consequuntur quam. Iure corporis enim consectetur delectus optio
                dolorum nemo cumque molestias necessitatibus! Quae eos sapiente,
                sequi deleniti commodi facilis perferendis recusandae ea est
                aliquid quo doloribus blanditiis. Expedita repellendus facilis
                aspernatur. Ipsa, vero numquam unde, architecto cum asperiores
                exercitationem esse omnis ipsum cumque at nostrum reprehenderit
                nulla blanditiis quibusdam inventore sit fuga sequi impedit
                nobis nihil minima. Architecto consectetur tempore obcaecati?
                Alias totam at voluptatem eveniet debitis perspiciatis dolorem
                possimus exercitationem nobis tempore! Vel illo quis non
                doloremque unde odit nihil necessitatibus consectetur ea
                delectus culpa reiciendis, alias veniam accusantium sapiente!
                Nostrum, animi? Ad debitis sapiente praesentium odio,
                repellendus inventore adipisci numquam sequi recusandae? Id
                nobis, et, suscipit minus praesentium illo numquam nulla minima
                ex vero quas maiores totam esse commodi. Quis ex sapiente
                obcaecati, voluptate repellat dolore ducimus accusamus? Iste eos
                similique adipisci. Aperiam cupiditate veniam illo quibusdam
                mollitia? Blanditiis cum ipsum quia, nostrum pariatur reiciendis
                placeat quasi error exercitationem. Aliquid quae tempore fugiat
                et velit odit porro totam voluptates, alias odio, rerum pariatur
                nesciunt repellat aspernatur dolorem quisquam maxime tenetur non
                eius esse! Officiis quisquam optio consequuntur unde error! Ex,
                magnam ab fuga dicta repellendus nemo sit beatae atque quod
                laborum, distinctio aliquam eligendi aut sequi magni rem natus
                quae quos praesentium veniam laboriosam. Quaerat qui minus sint
                suscipit! Doloribus reiciendis expedita mollitia voluptatem quis
                doloremque laudantium ea quam voluptas optio ex, fuga
                necessitatibus reprehenderit impedit assumenda. Pariatur
                molestiae dignissimos labore magni harum illo doloribus
                explicabo veniam perspiciatis officia! Adipisci, voluptatibus
                magni! Voluptate dolores labore, odio nemo a aut nobis, nulla
                ipsa quia accusantium minus eos eius. Adipisci nobis atque
                aliquid debitis magni reiciendis! Dolore molestias nihil
                voluptatem accusamus? Nulla voluptas ad recusandae soluta? Animi
                iste ratione quo aspernatur eveniet rerum facere dolorum unde
                officia molestias recusandae voluptatum dicta explicabo corrupti
                excepturi tempora incidunt, perferendis ipsa sint fugiat
                accusantium!
            </p>
        </div>
    )
}

export default App
