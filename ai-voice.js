// AI Voice Generation for Finnish Language Learning

// This script uses the Web Speech API to generate Finnish voices
// For browsers that don't support Finnish voices, we'll use a fallback approach

class FinnishVoiceGenerator {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.finnishVoice = null
    this.fallbackVoice = null
    this.initialized = false

    // Initialize voices when they're loaded
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.initializeVoices.bind(this)
    } else {
      // For browsers that don't fire onvoiceschanged
      setTimeout(this.initializeVoices.bind(this), 500)
    }
  }

  initializeVoices() {
    if (this.initialized) return

    this.voices = this.synth.getVoices()

    // Try to find a Finnish voice
    this.finnishVoice = this.voices.find(
      (voice) => voice.lang === "fi-FI" || voice.lang === "fi" || voice.name.includes("Finnish"),
    )

    // Set a fallback voice (preferably a female voice for better Finnish pronunciation)
    this.fallbackVoice =
      this.voices.find((voice) => voice.lang.startsWith("en") && !voice.name.includes("Male")) || this.voices[0]

    this.initialized = true
    console.log("Finnish voice initialized:", this.finnishVoice ? this.finnishVoice.name : "Not found, using fallback")
  }

  speak(text, rate = 0.8, pitch = 1) {
    if (!this.initialized) {
      setTimeout(() => this.speak(text, rate, pitch), 500)
      return
    }

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = this.finnishVoice || this.fallbackVoice
    utterance.rate = rate // Slower rate for learning
    utterance.pitch = pitch
    utterance.lang = "fi-FI"

    this.synth.speak(utterance)

    return new Promise((resolve) => {
      utterance.onend = resolve
    })
  }

  // Generate audio for vocabulary items
  async generateVocabularyAudio(word) {
    return this.speak(word, 0.7)
  }

  // Generate audio for sentences
  async generateSentenceAudio(sentence) {
    return this.speak(sentence, 0.8)
  }

  // Generate audio for instructions
  async generateInstructionAudio(instruction) {
    return this.speak(instruction, 0.9)
  }

  // Check if the browser supports speech synthesis
  static isSupported() {
    return "speechSynthesis" in window
  }
}

// Initialize the voice generator
window.finnishVoice = new FinnishVoiceGenerator()

// Check if speech synthesis is supported
document.addEventListener("DOMContentLoaded", () => {
  if (!FinnishVoiceGenerator.isSupported()) {
    alert("Your browser does not support speech synthesis. Some features may not work properly.")
  }
})
