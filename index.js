const $ = mdui.$
const numbers = [["十進位", "dec", 10], ["十六進位", "hex", 16, "0x"], ["二進位", "bin", 2, "0b"], ["八進位", "oct", 8]]

for(let num of numbers) {
    let div = document.createElement('div'),
        h2 = document.createElement('h2'),
        input = document.createElement('input')

    div.classList.add('container')
    div.classList.add('col')
    h2.classList.add('title')
    h2.innerText = num[0]
    input.id = num[1]
    input.value = num[3] ?? ''

    div.appendChild(h2)
    div.appendChild(input)
    $(`#containers`).get(0).appendChild(div)

    const selector = $(`#${num[1]}`).get(0)

    selector.addEventListener('input', () => {
        if(num[3] && selector.value.slice(num[3].length).length <= 0)
            return selector.value = num[3]

        for(let to_change of numbers) {
            if(num === to_change)
                continue

            let value = selector.value
            if(num[3])
                 value = value.slice(num[3].length)
            let target = parseFloat(value, num[2])

            $(`#${to_change[1]}`).get(0).value = (to_change[3] ?? '') + (value.length === 0 ? '' :
                (isNaN(target) || !isFinite(target) ? '錯誤' : target.toString(to_change[2]))).toUpperCase()
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