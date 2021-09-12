const $ = (id) => document.getElementById(id)
const numbers = [["十進位", "dec", 10], ["十六進位", "hex", 16, "0x"], ["二進位", "bin", 2, "0b"], ["八進位", "oct", 8]]

for(let num of numbers) {
    let div = document.createElement('div'),
        h2 = document.createElement('h2'),
        input = document.createElement('input')

    const prefix = num[3] ?? ''

    div.classList.add('container')
    div.classList.add('col')
    h2.classList.add('title')
    h2.innerText = num[0]
    input.id = num[1]
    input.value = `${prefix}0`
    input.autocomplete = 'off'
    input.autocapitalize = 'off'
    input.spellcheck = false

    div.appendChild(h2)
    div.appendChild(input)
    $('containers').appendChild(div)

    const selector = $(num[1])

    selector.addEventListener('input', () => {
        if(selector.value.length === 0)
            selector.value = `${prefix}0`
        else if(/^0+/.test(selector.value.slice(prefix.length)))
            selector.value = `${prefix}${selector.value.slice(prefix.length).replace(/^0+/, '')}`
        if(num[3] && selector.value.slice(prefix.length).length <= 0)
            return selector.value = `${prefix}0`

        for(let to_change of numbers) {
            if(num === to_change)
                continue

            let value = selector.value
            if(num[3])
                 value = value.slice(num[3].length)
            let target = parseFloat(value, num[2])

            if((isNaN(target) || !isFinite(target)) && value.length !== 0) {
                $(to_change[1]).value = '錯誤'
                continue
            }

            $(to_change[1]).value = (to_change[3] ?? '') +
                (value.length === 0 ? '0' : target.toString(to_change[2])).toUpperCase()
        }
    })
}

// https://stackoverflow.com/questions/5055723/converting-hexadecimal-to-float-in-javascript
function parseFloat(str, radix)
{
    const parts = str.split(".")
    if (parts.length > 1)
        return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length)
    return parseInt(parts[0], radix)
}

// install check
if(!!navigator?.serviceWorker) {
    const channel4Broadcast = new BroadcastChannel('channel4')

    channel4Broadcast.onmessage = (e) => {
        switch (e.data.type) {
            case "install":
                Swal.fire({
                    toast: true,
                    title: '網頁可以離線使用了!',
                    timer: 7000,
                    position: 'bottom',
                    showConfirmButton: false,
                    timerProgressBar: true,
                    icon: 'success',
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
        }
    }

    navigator.serviceWorker.register('worker.js')
        .then(worker => {
            if(worker.active)
                worker.active.addEventListener('message', (message) => {
                    console.log(message)
                })
        })
}

if(!localStorage.getItem('denyInstall')) {
    window.addEventListener('beforeinstallprompt', async (e) => {
        e.preventDefault()

        let result = await Swal.fire({
            title: '要不要安裝到桌面方便使用?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '好!',
            confirmButtonColor: '#00D100',
            denyButtonText: '不要再問我',
            cancelButtonText: '下次再詢問我'
        })

        if(result.isDenied)
            return localStorage.setItem('denyInstall', 'true')

        if(result.isConfirmed)
            e.prompt()
    })
}