export interface WeeklyInfo {
    week: number
    trimester: 1 | 2 | 3
    babySize: string
    babyWeight: string
    babyLength: string
    development: string[]
    motherChanges: string[]
    tips: string[]
}

export const weeklyPregnancyData: WeeklyInfo[] = [
    {
        week: 4,
        trimester: 1,
        babySize: "Poppy Seed",
        babyWeight: "< 1g",
        babyLength: "2mm",
        development: [
            "Embryo implants in uterus",
            "Neural tube begins forming",
            "Basic cell layers developing"
        ],
        motherChanges: [
            "Missed period",
            "Possible light spotting",
            "Early pregnancy symptoms may begin"
        ],
        tips: [
            "Take prenatal vitamins with folic acid",
            "Schedule your first prenatal appointment",
            "Avoid alcohol and smoking"
        ]
    },
    {
        week: 8,
        trimester: 1,
        babySize: "Raspberry",
        babyWeight: "1g",
        babyLength: "1.6cm",
        development: [
            "Heartbeat can be detected",
            "Fingers and toes forming",
            "Facial features developing"
        ],
        motherChanges: [
            "Morning sickness may peak",
            "Breast tenderness",
            "Frequent urination"
        ],
        tips: [
            "Eat small, frequent meals",
            "Stay hydrated",
            "Get plenty of rest"
        ]
    },
    {
        week: 12,
        trimester: 1,
        babySize: "Lime",
        babyWeight: "14g",
        babyLength: "5.4cm",
        development: [
            "All major organs formed",
            "Reflexes developing",
            "Can make sucking motions"
        ],
        motherChanges: [
            "Morning sickness may ease",
            "Energy levels improving",
            "Uterus rising above pelvis"
        ],
        tips: [
            "Consider genetic screening tests",
            "Start gentle exercise routine",
            "Announce pregnancy if desired"
        ]
    },
    {
        week: 16,
        trimester: 2,
        babySize: "Avocado",
        babyWeight: "100g",
        babyLength: "11.6cm",
        development: [
            "Can hear sounds",
            "Eyes moving",
            "Skeleton hardening"
        ],
        motherChanges: [
            "Baby bump showing",
            "Feeling more energetic",
            "Skin changes possible"
        ],
        tips: [
            "Start prenatal yoga",
            "Moisturize skin to prevent stretch marks",
            "Schedule anatomy scan"
        ]
    },
    {
        week: 20,
        trimester: 2,
        babySize: "Banana",
        babyWeight: "300g",
        babyLength: "25cm",
        development: [
            "Can feel baby moving",
            "Swallowing amniotic fluid",
            "Hair and nails growing"
        ],
        motherChanges: [
            "Feeling baby kicks",
            "Round ligament pain",
            "Increased appetite"
        ],
        tips: [
            "Anatomy scan week",
            "Start kick counting",
            "Sleep on your side"
        ]
    },
    {
        week: 24,
        trimester: 2,
        babySize: "Ear of Corn",
        babyWeight: "600g",
        babyLength: "30cm",
        development: [
            "Lungs developing",
            "Brain growing rapidly",
            "Taste buds forming"
        ],
        motherChanges: [
            "Glucose screening test",
            "Possible back pain",
            "Braxton Hicks contractions"
        ],
        tips: [
            "Take glucose tolerance test",
            "Practice good posture",
            "Start childbirth classes"
        ]
    },
    {
        week: 28,
        trimester: 3,
        babySize: "Eggplant",
        babyWeight: "1kg",
        babyLength: "37cm",
        development: [
            "Eyes can open",
            "Can recognize voices",
            "Gaining weight rapidly"
        ],
        motherChanges: [
            "Shortness of breath",
            "Swelling in feet",
            "Frequent urination returns"
        ],
        tips: [
            "Start weekly prenatal visits",
            "Monitor kick counts daily",
            "Prepare hospital bag"
        ]
    },
    {
        week: 32,
        trimester: 3,
        babySize: "Squash",
        babyWeight: "1.7kg",
        babyLength: "42cm",
        development: [
            "Practicing breathing",
            "Bones fully formed",
            "Gaining 200g per week"
        ],
        motherChanges: [
            "Increased fatigue",
            "Trouble sleeping",
            "Pelvic pressure"
        ],
        tips: [
            "Sleep with pregnancy pillow",
            "Elevate feet when resting",
            "Finalize birth plan"
        ]
    },
    {
        week: 36,
        trimester: 3,
        babySize: "Honeydew",
        babyWeight: "2.6kg",
        babyLength: "47cm",
        development: [
            "Dropping into pelvis",
            "Fully developed",
            "Ready for birth"
        ],
        motherChanges: [
            "Easier to breathe",
            "More pelvic pressure",
            "Nesting instinct"
        ],
        tips: [
            "Weekly doctor visits",
            "Watch for labor signs",
            "Rest as much as possible"
        ]
    },
    {
        week: 40,
        trimester: 3,
        babySize: "Watermelon",
        babyWeight: "3.4kg",
        babyLength: "51cm",
        development: [
            "Fully developed",
            "Ready to be born",
            "Waiting for labor"
        ],
        motherChanges: [
            "Anxious for labor",
            "Possible contractions",
            "Cervix may be dilating"
        ],
        tips: [
            "Watch for labor signs",
            "Stay active with walking",
            "Keep hospital bag ready"
        ]
    }
]

export function getWeekInfo(week: number): WeeklyInfo | undefined {
    return weeklyPregnancyData.find(w => w.week === week)
}

export function getTrimesterWeeks(trimester: 1 | 2 | 3): WeeklyInfo[] {
    return weeklyPregnancyData.filter(w => w.trimester === trimester)
}
