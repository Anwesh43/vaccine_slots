#!/usr/bin/env node
const axios = require('axios')
const url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin'
const getEp = (pincode, date) => `${url}?pincode=${pincode}&date=${date}`
const args = process.argv 
const headers = {
    "Authorization": "Bearer YW53ZXNoIGlzIGEgZ29vZCBib3k="
}

const normalizeNumber = (d) => d < 10 ? `0${d}`: d 

const formatDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const day = today.getDate()
    const month = today.getMonth()
    return `${normalizeNumber(day)}-${normalizeNumber(month + 1)}-${year}`
}

const mapSessionData = (sessions) => sessions.map(({slots, min_age_limit, vaccine, date}) => ({date, slotData: slots.join("\n"), min_age_limit, vaccine}))

const execute = async (pincode, date) => {
    try {
        const data = await axios(getEp(pincode, date), {headers})
        const centerDatas = data.data.centers.map(({sessions, name, fee_type}) => ({sessions, name, fee_type}))
        centerDatas.forEach((centerData) => {
            console.log("Name:", centerData.name)
            console.log("fee_type:", centerData.fee_type)
            console.log("_________________________________________")
            //centerData.sessions.map(Object.keys).forEach(console.log)
            mapSessionData(centerData.sessions).forEach((sess) => {
                console.log("___")
                console.log("For Date:", sess.date)
                console.log("vaccine:", sess.vaccine)
                console.log("age_limit:", sess.min_age_limit)
                console.log("Slots:")
                console.log(sess.slotData)
                console.log("___")
            })
            console.log("_________________________________________")
            
        })
    } catch(ex) {
        console.log(ex)
    }
}

if (args.length >= 3) {
    const queryArgs = args.splice(2, 2)
    console.log(`results for today ${formatDate()}`)
    execute(queryArgs[0], queryArgs[1] || formatDate())
}