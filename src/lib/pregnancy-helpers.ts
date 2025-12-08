export const getBabySizeText = (week: number) => {
    if (week < 4) return "Poppy Seed"
    if (week < 8) return "Blueberry"
    if (week < 12) return "Lime"
    if (week < 16) return "Avocado"
    if (week < 20) return "Banana"
    if (week < 24) return "Ear of Corn"
    if (week < 28) return "Eggplant"
    if (week < 32) return "Squash"
    if (week < 36) return "Honeydew"
    if (week < 40) return "Pumpkin"
    return "Watermelon"
}

export const getWeeklyFact = (week: number) => {
    if (week < 13) return "Your baby is forming fingerprints this week!"
    if (week < 27) return "Baby can now hear your voice and heartbeat."
    return "Baby is practicing breathing movements."
}


export const getTrimester = (week: number) => {
    if (week < 13) return "1st Trimester"
    if (week < 27) return "2nd Trimester"
    return "3rd Trimester"
}

export const getDailyTip = () => {
    const tips = [
        "Take a moment to rest your feet today.",
        "Stay hydrated! Drink 8 cups of water.",
        "Eat a rainbow of fruits and veggies.",
        "Gentle stretching can help back pain.",
        "Listen to your body and rest when needed.",
        "Connect with your baby – talk or sing!",
        "Don't forget your prenatal vitamins."
    ]
    // Use day of week to rotate tips (0-6)
    const todayIndex = new Date().getDay()
    return tips[todayIndex]
}
