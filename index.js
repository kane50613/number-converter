const $ = mdui.$

const numbers = [["dec", 10], ["hex", 16], ["bin", 2], ["oct", 8]]

$("#dec").get(0).addEventListener('input', () => {
    $("#hex").get(0).value = Number($("#dec").get(0).value).toString(2)
})

for(let num of numbers) {
    $(`#${num[0]}`).get(0).addEventListener('input', () => {
        for(let to_change of numbers) {
            if(num === to_change)
                continue

            const value = $(`#${num[0]}`).get(0).value
            const target = parseFloat(value, num[1])

            $(`#${to_change[0]}`).get(0).value = value.length === 0 ? '' :
                (isNaN(target) || !isFinite(target) ? '錯誤' : target.toString(to_change[1]))
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