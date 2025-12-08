"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Droplets, Moon, Pill, Activity } from "lucide-react"

const INITIAL_TASKS = [
    { id: 1, label: "Drink 8 cups of water", icon: Droplets, color: "text-blue-500", done: false },
    { id: 2, label: "Take Prenatal Vitamin", icon: Pill, color: "text-green-500", done: false },
    { id: 3, label: "Rest for 20 minutes", icon: Moon, color: "text-indigo-500", done: false },
    { id: 4, label: "Light stretching", icon: Activity, color: "text-pink-500", done: false },
]

export function DailyChecklist() {
    const [tasks, setTasks] = useState(INITIAL_TASKS)

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        ))
    }

    const completedCount = tasks.filter(t => t.done).length
    const progress = (completedCount / tasks.length) * 100

    return (
        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-green-50/30 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Today's Checklist
                    </CardTitle>
                    <span className="text-xs font-semibold text-emerald-700">
                        {completedCount}/{tasks.length}
                    </span>
                </div>
                <Progress value={progress} className="h-1.5 bg-emerald-100" indicatorClassName="bg-emerald-500" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <button
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group text-left border relative overflow-hidden
                                ${task.done
                                    ? "bg-emerald-100/40 border-emerald-100 text-emerald-900"
                                    : "bg-white hover:bg-emerald-50/50 border-slate-100 hover:border-emerald-100 shadow-sm"
                                }`}
                        >
                            <div className={`
                                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                                ${task.done ? "text-emerald-500 scale-110" : "text-slate-300 group-hover:text-emerald-400"}
                            `}>
                                {task.done
                                    ? <CheckCircle2 className="h-6 w-6" />
                                    : <Circle className="h-5 w-5" />
                                }
                            </div>

                            <div className="flex-1 flex items-center gap-3 relative z-10">
                                <div className={`p-1.5 rounded-lg ${task.done ? 'bg-emerald-200/50' : 'bg-slate-50 group-hover:bg-white'} transition-colors`}>
                                    <task.icon className={`h-4 w-4 ${task.color} ${task.done ? "opacity-70 grayscale" : ""}`} />
                                </div>
                                <span className={`text-sm font-medium transition-all ${task.done ? "opacity-60" : "text-slate-700"}`}>
                                    {task.label}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
