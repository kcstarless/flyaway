// toolTipHelper.js

export const toolTipHelper = (key) => {
    switch(key) {
        case 'price_history':
            return "Supported price history currencies are EUR,CAD,HKD,ISK,PHP,DKK,HUF,CZK,AUD,RON,SEK,IDR,INR,BRL,RUB,HRK,JPY,THB,CHF,SGD,PLN,BGN,TRY,CNY,NOK,NZD,ZAR,USD,MXN,ILS,GBP,KRW,MYR."
        default:
            return "no matching tooltips."
    }
}