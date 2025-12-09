// Notification sound utility
export class NotificationSound {
    private static audioContext: AudioContext | null = null
    private static sounds: { [key: string]: AudioBuffer } = {}

    // Initialize audio context
    private static getAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        return this.audioContext
    }

    // Generate a simple notification beep using Web Audio API
    private static createBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
        const ctx = this.getAudioContext()
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = frequency
        oscillator.type = type

        // Envelope for smooth sound
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + duration)
    }

    // Play success sound (pleasant chime)
    static playSuccess(): void {
        try {
            this.createBeep(523.25, 0.1) // C5
            setTimeout(() => this.createBeep(659.25, 0.15), 100) // E5
            setTimeout(() => this.createBeep(783.99, 0.2), 200) // G5
        } catch (error) {
            console.error('Error playing success sound:', error)
        }
    }

    // Play warning sound (attention-grabbing)
    static playWarning(): void {
        try {
            this.createBeep(440, 0.15) // A4
            setTimeout(() => this.createBeep(440, 0.15), 200)
        } catch (error) {
            console.error('Error playing warning sound:', error)
        }
    }

    // Play critical alert sound (urgent)
    static playCritical(): void {
        try {
            this.createBeep(880, 0.1) // A5
            setTimeout(() => this.createBeep(880, 0.1), 150)
            setTimeout(() => this.createBeep(880, 0.1), 300)
        } catch (error) {
            console.error('Error playing critical sound:', error)
        }
    }

    // Play info notification (subtle)
    static playInfo(): void {
        try {
            this.createBeep(523.25, 0.1) // C5
            setTimeout(() => this.createBeep(659.25, 0.1), 100) // E5
        } catch (error) {
            console.error('Error playing info sound:', error)
        }
    }

    // Play message received sound
    static playMessage(): void {
        try {
            this.createBeep(659.25, 0.08) // E5
            setTimeout(() => this.createBeep(783.99, 0.12), 80) // G5
        } catch (error) {
            console.error('Error playing message sound:', error)
        }
    }
}

// Hook for easy usage in components
export function useNotificationSound() {
    return {
        playSuccess: () => NotificationSound.playSuccess(),
        playWarning: () => NotificationSound.playWarning(),
        playCritical: () => NotificationSound.playCritical(),
        playInfo: () => NotificationSound.playInfo(),
        playMessage: () => NotificationSound.playMessage(),
    }
}
