window.addEventListener('DOMContentLoaded', async(event) => {
    try {
        window.mpurse.updateEmitter.removeAllListeners()
          .on('stateChanged', isUnlocked => console.log(isUnlocked))
          .on('addressChanged', async(address) => { await initForm(address); console.log(address); });
    } catch(e) { console.debug(e) }
    /*
    if (window.hasOwnProperty('mpurse')) {
        document.getElementById('address').value = await window.mpurse.getAddress()
        showMyData(await getProfile(document.getElementById('address').value))
    }
    */
    /*
    //const profiles = new ProfileRegister().get()
    document.getElementById('address').addEventListener('change', async(event) => {
        const index = profiles.findindex(p=>p.address === event.target.value)
        if (-1 < index) { showMyData(profiles[index]) }
    });
    */
    /*
    // デバッグ
    console.debug(getProfile('MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu'))
    if (window.hasOwnProperty('mpurse')) {
        document.getElementById('address').value = await window.mpurse.getAddress()
        showMyData(await getProfile(document.getElementById('address').value))
    }
    */
    /*
    document.getElementById('address').addEventListener('change', async(event) => {
        const j = await getProfile(event.target.value)
        showMyData(j)
    });
    */
    /*
    document.getElementById('get').addEventListener('click', async(event) => {
        //const address = document.getElementById('address').value
        const address = 'MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu'
        if (address) {
            const register = new ProfileRegister()
            const json = await register.get(address)
            console.debug(json)
            showMyData(JSON.parse(json.profile))
        }
    });
    */
    async function initForm(addr=null) {
        const address = addr || (window.hasOwnProperty('mpurse')) ? await window.mpurse.getAddress() : null
        document.getElementById('address').value = address
        if (address) {
            const register = new ProfileRegister()
            const json = await register.get(address)
            console.debug(json)
            showMyData(JSON.parse(json.profile))
        }
    }
    document.getElementById('regist').addEventListener('click', async(event) => {
        console.debug('登録ボタンを押した。')
        if (nothingRequired('address', 'アドレス')) { return }
        if (nothingRequired('name', '名前')) { return }
        const j = makeJson()
        console.debug(j)
        const register = new ProfileRegister()
        const json = await register.post(document.getElementById('address').value, j)
        console.debug(json)
        //const json = await register.post(j)
    });
    function nothingRequired(id, label) {
        //if ('' == document.getElementById(id).value.trim()) { Toaster.toast(`${label}を入力してください。`, true); return true; }
        console.log((document.getElementById(id).value) ? 'T' : 'F')
        if (!document.getElementById(id).value) { Toaster.toast(`${label}を入力してください。`, true); return true; }
        console.debug(`存在する:${label}`)
        return false
    }
    async function getProfile(address) {
        console.debug(address)
        //if (!window.hasOwnProperty('mpurse')) { return null }
        if (address) {
            const register = new ProfileRegister()
            const json = await register.get()
            //const client = new GoogleAppsScriptClient()
            //const json = await client.get()
            console.debug(json)
            console.debug(Array.isArray(json))
            const index = json.findIndex(d=>d.address == address)
            console.debug(json[index])
            if (-1 < index) { return json[index] }
            /*
            const index = json.data.findIndex(d=>d.address == address)
            console.debug(json.data[index])
            if (-1 < index) { return json.data[index] }
            */
        }
        return null
    }
    function showMyData(json) {
        if (!json) { return }
        console.debug(json)
        document.getElementById('regist-form').reset()
        document.getElementById('address').value = json.address
        document.getElementById('url').value = json.url
        document.getElementById('name').value = json.name
        document.getElementById('avatar').value = json.avatar
        document.getElementById('description').value = json.description
        const fields = (json.hasOwnProperty('fields')) ? json.fields : null
        if (fields) {
            for (let i=0; i<fields.length; i++) {
                document.getElementById(`field-${i+1}-key`).value = fields[i].key
                document.getElementById(`field-${i+1}-value`).value = fields[i].value
            }
        }
        const gen = new ProfileGenerator()
        document.getElementById('html-profile').innerHTML = gen.generate(json)
    }
    function makeProfiles(json) {
        const table = document.createElement('table')
        const one = document.createElement('tr')
        const two = document.createElement('tr')
        one.innerHTML = `<td>${makeAvatar(json.url, json.avatar, 96)}</td><td>${makeDescription(json.description)}</td>`
        two.innerHTML = `<td>${makeLink(json.url, json.name).outerHTML}</td><td>${makeMpurseSendButton(json.address)}</td>`
        table.appendChild(one)
        table.appendChild(two)
        return table.outerHTML
    }
    function makeLink(url, innerHtml=null) {
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('rel', 'noopener noreferrer')
        if (innerHtml) { a.innerHTML = innerHtml }
        return a
    }
    function makeLink(url) { return `<a href="${url}" rel="noopener noreferrer">${url}</a>` }
    function makeAvatar(url, src, size) { return `<a href="${url}" rel="noopener noreferrer"><img src="${src}" width="${size}" height="${size}"></a>` }
    function makeDescription(description) {
        description = description.replace('\n', '<br>')
        return description 
    }
    function makeMpurseSendButton(address) { // マストドンのプロフィール情報にアドレスらしき文字列があれば投げモナボタンを配置する
        return (address) ? `<mpurse-send-button img-size="32" amount="0.04649000" to="${address}"></mpurse-send-button>` : ''
    }

    function makeJson() {
        const address = document.getElementById('address').value
        const url = document.getElementById('url').value
        const name = document.getElementById('name').value
        const avatar = document.getElementById('avatar').value
        const description = document.getElementById('description').value
        const fields = []
        for (let i=0; i<4; i++) {
            const key = document.getElementById(`field-${i+1}-key`).value
            const value = document.getElementById(`field-${i+1}-value`).value
            if (key && value) { fields.push({key:key, value:value}) }
        }
        const json = {address:address, url:url, name:name, avatar:avatar, description:description}
        if (0 < fields.length) { json.fields = fields }
        return json
    }
    /*
    document.getElementById('get-mastodon-account-info').addEventListener('click', async(event) => {
        const domain = document.getElementById('mastodon-instance').value
        if ('' == domain.trim()) { Toaster.toast(`インスタンスのドメイン名またはURLを入力してください。`, true); return; }
        if (await MastodonInstance.isExist(domain)) {
            console.debug('指定したインスタンスは存在する')
            const authorizer = new MastodonAuthorizer(domain, '')
            await authorizer.authorize(['accounts'], null)
        } else {
            Toaster.toast('指定したインスタンスは存在しません。', true)
        }
    });
    */
    document.addEventListener('mastodon_redirect_approved', async(event) => {
        console.debug('===== mastodon_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理（）
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('accounts' == event.detail.actions[i]) {
                const gen = new MastodonProfileGenerator(event.detail.domain)
                document.getElementById('export-mastodon').innerHTML = gen.generate(event.detail.results[i])
            }
            else if ('status' == event.detail.actions[i]) {
                const html = new Comment().mastodonResToComment(event.detail.results[i])
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('mastodon_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    /*
    document.getElementById('get-misskey-account-info').addEventListener('click', async(event) => {
        const domain = document.getElementById('misskey-instance').value
        if ('' == domain.trim()) { Toaster.toast(`インスタンスのドメイン名またはURLを入力してください。`, true); return; }
        if (await MisskeyInstance.isExist(domain)) {
            console.debug('指定したインスタンスは存在する')
            const authorizer = await MisskeyAuthorizer.get(domain, 'read:account')
            console.debug(authorizer)
            await authorizer.authorize(['i'], null)
        } else {
            Toaster.toast('指定したインスタンスは存在しません。', true)
        }
    });
    */
    document.addEventListener('misskey_redirect_approved', async(event) => {
        console.debug('===== misskey_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('i' == event.detail.actions[i]) {
                const gen = new MisskeyProfileGenerator(event.detail.domain)
                document.getElementById('export-misskey').innerHTML = gen.generate(event.detail.results[i])
            }
            else if ('note' == event.detail.actions[i]) {
                const html = new Comment().misskeyResToComment(event.detail.results[i].createdNote, event.detail.domain)
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('misskey_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    // mpurseアドレスのプロフィール情報を取得する
    initForm()
    // リダイレクト認証後
    const reciverMastodon = new MastodonRedirectCallbackReciver()
    await reciverMastodon.recive()
    const reciverMisskey = new MisskeyRedirectCallbackReciver()
    await reciverMisskey.recive()
});

