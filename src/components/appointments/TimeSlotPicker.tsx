"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlotPickerProps {
    slots: string[]
    selectedSlot: string | null
    onSelect: (slot: string) => void
    isLoading: boolean
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect, isLoading }: TimeSlotPickerProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-pink-500" />
                <p>Loading available slots...</p>
            </div>
        )
    }

    if (slots.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                <Clock className="h-8 w-8 mb-2 opacity-50" />
                <p>No available slots for this date.</p>
                <p className="text-sm">Please try selecting another date.</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((slot) => {
                    const date = new Date(slot)
                    const timeString = date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    const isSelected = selectedSlot === slot

                    return (
                        <Button
                            key={slot}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                                "w-full",
                                isSelected ? "bg-pink-500 hover:bg-pink-600" : "hover:border-pink-300 hover:text-pink-600"
                            )}
                            onClick={() => onSelect(slot)}
                        >
                            {timeString}
                        </Button>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
