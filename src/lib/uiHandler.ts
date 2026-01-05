import { ref } from "vue"

interface alert {
    id: number
    message: string
    visible: boolean
}

const alerts = ref<alert[]>([])
let alertId = 0

function shortAlert(message: string) {
    if (alertId > 10000) 
        alertId = 0
    const id = alertId++
    alerts.value.push({
        id,
        message,
        visible: true
    })
    setTimeout(() => {
        const alert = alerts.value.find(a => a.id === id)
        if (alert) alert.visible = false
    }, 2700)
    setTimeout(() => {
        alerts.value = alerts.value.filter(a => a.id !== id)
    }, 3000)
}

export function uiHandler() {
    return {
        alerts,
        shortAlert
    }
}