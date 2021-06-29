import fetch from 'node-fetch'
export default async function(date:Date, from:string, to:string){
    const url_base = "https://raw.githubusercontent.com/fawazahmed0/currency-api/1"
    const _date = new Date(date);
    const url = `${url_base}/${
        [_date.getFullYear(),(_date.getMonth()+1 < 10 ? '0' : '') + (_date.getMonth()+1),_date.getDate()-1].join('-')
    }/currencies/${from.toLowerCase()}/${to.toLowerCase()}.json`
    const response = await fetch(url)
    const text = await response.text()
    return JSON.parse(text)[to.toLowerCase()]
}