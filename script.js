// Global variables
let currentPage = "etusivu"
let currentModuleSection = "moduuli1"
const currentQuestion = 0
let selectedVerb = ""
const currentLanguage = "fi"
const matchedWords = []
let currentVocabItem = null
let currentExercise = "A"

const questions = [
  {
    text: "Hei! Tämä on mukava kahvila. Tässä kahvilassa on itsepalvelu. Se tarkoittaa, että sinä voit ottaa kahvia tai teetä itse. Kuvassa on paljon kaikkea sellaista, mitä tarvitset kahvilassa. Etsi minulle kuvasta seuraavat tavarat:",
    item: null,
    type: "intro",
  },
  {
    text: "Ensin helppo sana. Missä on kahviautomaatti?",
    item: "kahviautomaatti",
    type: "question",
    correctFeedback:
      "Joo, se on kahviautomaatti. Sinä voit valita, millaista kahvia haluat. Otatko maitokahvia, espressoa vai jotain muuta? Minä tykkään tavallisesta mustasta kahvista.",
    incorrectFeedback: "Se ei ole kahviautomaatti. Kahviautomaatti on iso ja musta kone.",
  },
  {
    text: "Tiedätkö, missä on vedenkeitin?",
    item: "vedenkeitin",
    type: "question",
    correctFeedback:
      "Kyllä, se on valkoinen vedenkeitin. Tämän vedenkeittimen merkki on Smeg. Vedenkeitin on tosi hyödyllinen, koska voit keittää sillä kuumaa vettä nopeasti.",
    incorrectFeedback: "Se ei ole vedenkeitin. Vedenkeitin on valkoinen.",
  },
  {
    text: "Missä on kahvitermos?",
    item: "kahvitermos",
    type: "question",
    correctFeedback:
      "Juu, se on kahvitermos. Tässä kahvilassa onkin kaksi kahvitermosta. Termoksessa on kuumaa kahvia.",
    incorrectFeedback: "Ei, se ei ole kahvitermos. Kuvassa on kaksi samanlaista kahvitermosta. Löydätkö ne?",
  },
  {
    text: "Missä ovat teepussit? Löydätkö ne?",
    item: "teepussit",
    type: "question",
    correctFeedback: "Kyllä, siinä ovat teepussit. Minä juon yleensä mustaherukkateetä. Mistä teestä sinä tykkäät?",
    incorrectFeedback: "Nyt meni väärin. Teepussit ovat vedenkeittimen lähellä.",
  },
  {
    text: "Missä on hunajaa?",
    item: "hunaja",
    type: "question",
    correctFeedback: "Hyvä, löysit hunajan! Tässä on kaksi pulloa hunajaa. Minä käytän hunajaa, kun juon teetä.",
    incorrectFeedback: "Se ei ole hunajaa. Kokeile uudelleen!",
  },
  {
    text: "Ja vielä lopuksi. Kuvassa on viisi purkkia makeutusainetta. Missä ne ovat?",
    item: "makeutusaine",
    type: "question",
    correctFeedback:
      "Hienoa, ne ovat makeutusainetta. Käytän makeutusainetta joskus kahvissa. Yleensä juon kahvia ilman makeutusainetta tai sokeria.",
    incorrectFeedback: "Se ei ole makeutusainetta. Makeutusaineet ovat teen vieressä.",
  },
  {
    text: "Hienoa! Löysit kuvasta kaikki tärkeät kahvilan tavarat. Opiskele sanat hyvin, koska tarvitset niitä varmasti myöhemmin!",
    item: null,
    type: "completion",
  },
]

const trueFalseQuestions = [
  {
    statement: "Kahvilan seinä on vihreä.",
    correct: false,
    correctFeedback: "Palaute oikea! Kahvilan seinä ei ole vihreä, vaan keltainen.",
    incorrectFeedback: "Väärä vastaus. Kahvilan seinä ei ole vihreä, vaan keltainen.",
  },
  {
    statement: "Pöydällä on keltaista mehua.",
    correct: true,
    correctFeedback: "Palaute oikea! Pöydällä on keltaista mehua. Se on ehkä appelsiinimehua.",
    incorrectFeedback: "Väärä vastaus. Pöydällä on keltaista mehua. Se on ehkä appelsiinimehua.",
  },
  {
    statement: "Asiakas voi ottaa kahvia kahviautomaatista.",
    correct: false,
    correctFeedback: "Palaute oikea! Kahvi on pöydällä kahvitermoksessa, ei automaatissa.",
    incorrectFeedback: "Väärä vastaus. Kahvi on pöydällä kahvitermoksessa, ei automaatissa.",
  },
  {
    statement: "Asiakas voi saada kakkua ja keksejä.",
    correct: true,
    correctFeedback: "Palaute oikea! Pöydällä on vaaleita keksejä ja tummaa kakkua. Se on ehkä suklaakakkua.",
    incorrectFeedback: "Väärä vastaus. Pöydällä on vaaleita keksejä ja tummaa kakkua. Se on ehkä suklaakakkua.",
  },
  {
    statement: "Kaikki lasit ovat pöydällä.",
    correct: false,
    correctFeedback: "Palaute oikea! Lasit ovat hyllyllä, pöydän yläpuolella.",
    incorrectFeedback: "Väärä vastaus. Lasit ovat hyllyllä, pöydän yläpuolella.",
  },
  {
    statement: "Kahvitermoksen takana on koriste-esine.",
    correct: true,
    correctFeedback: "Palaute oikea! Kahvitermoksen takana on kaunis patsas.",
    incorrectFeedback: "Väärä vastaus. Kahvitermoksen takana on kaunis patsas.",
  },
]

const vocabularyItems = [
  "hunaja",
  "sokeri",
  "juomalasit",
  "teepussit",
  "kahvitermos",
  "kakkupalat",
  "vedenkeitin",
  "kahviautomaatti",
  "makeutusaine",
]

// Advanced Finnish Speech System with Native Pronunciation
let currentSpeechUtterance = null
let voicesLoaded = false
let selectedFinnishVoice = null
let usePhoneticFallback = false

// Finnish phonetic conversion dictionary for non-Finnish voices
const finnishPhoneticMap = {
  // Finnish special characters to phonetic approximations
  ä: "ae",
  ö: "oe",
  y: "ue",
  Ä: "Ae",
  Ö: "Oe",
  Y: "Ue",

  // Common Finnish word patterns for better pronunciation
  kahvi: "kah-vee",
  kahvia: "kah-vee-ah",
  kahviautomaatti: "kah-vee-ah-oo-toh-mah-tee",
  kahvitermos: "kah-vee-ter-mohs",
  vedenkeitin: "veh-den-kay-tin",
  hunaja: "hoo-nah-yah",
  sokeri: "soh-keh-ree",
  juomalasit: "yoo-oh-mah-lah-sit",
  teepussit: "teh-eh-poos-sit",
  kakkupalat: "kahk-koo-pah-laht",
  makeutusaine: "mah-keh-oo-toos-ah-ee-neh",
  termos: "ter-mohs",
  keitin: "kay-tin",
  pussit: "poos-sit",
  palat: "pah-laht",
  lasit: "lah-sit",
  automaatti: "ah-oo-toh-mah-tee",

  // Common Finnish phrases
  hei: "hay",
  kyllä: "kuel-lae",
  joo: "yoh",
  missä: "mis-sae",
  tämä: "tae-mae",
  mukava: "moo-kah-vah",
  kahvila: "kah-vee-lah",
  itsepalvelu: "it-seh-pahl-veh-loo",
  tarkoittaa: "tar-koh-it-tah",
  voit: "voh-it",
  ottaa: "oht-tah",
  itse: "it-seh",
  kuvassa: "koo-vahs-sah",
  paljon: "pahl-yohn",
  kaikkea: "kah-ik-keh-ah",
  sellaista: "sel-lah-is-tah",
  tarvitset: "tar-vit-set",
  etsi: "et-see",
  minulle: "mee-nool-leh",
  seuraavat: "seh-oo-rah-vaht",
  tavarat: "tah-vah-raht",
  ensin: "en-sin",
  helppo: "help-poh",
  sana: "sah-nah",
  valkoinen: "vahl-koh-ee-nen",
  merkki: "merk-kee",
  hyödyllinen: "hueh-oel-li-nen",
  koska: "kohs-kah",
  keittää: "kay-tae",
  sillä: "sil-lae",
  kuumaa: "koo-mah",
  vettä: "vet-tae",
  nopeasti: "noh-peh-ahs-ti",
  kaksi: "kahk-see",
  termoksessa: "ter-mohk-ses-sah",
  löydätkö: "loeh-daet-koeh",
  vedenkeittimen: "veh-den-kay-ti-men",
  lähellä: "lae-hel-lae",
  löysit: "loeh-sit",
  pulloa: "pool-loh-ah",
  käytän: "kaeh-taen",
  juon: "yoo-ohn",
  lopuksi: "loh-pook-see",
  viisi: "vee-see",
  purkkia: "poork-kee-ah",
  hienoa: "hee-eh-noh-ah",
  joskus: "yohs-koos",
  yleensä: "ue-len-sae",
  ilman: "il-mahn",
  kaikki: "kah-ik-kee",
  tärkeät: "taer-keh-aet",
  opiskele: "oh-pis-keh-leh",
  hyvin: "hue-vin",
  varmasti: "var-mahs-ti",
  myöhemmin: "mueh-hem-min",
}

// Convert Finnish text to phonetic approximation
function convertToFinnishPhonetic(text) {
  let phoneticText = text.toLowerCase()

  // Apply word-specific conversions first (more specific)
  for (const [finnish, phonetic] of Object.entries(finnishPhoneticMap)) {
    const regex = new RegExp(finnish, "gi")
    phoneticText = phoneticText.replace(regex, phonetic)
  }

  // Apply general Finnish pronunciation rules
  phoneticText = phoneticText
    // Double consonants (important in Finnish)
    .replace(/kk/g, "k-k")
    .replace(/ll/g, "l-l")
    .replace(/nn/g, "n-n")
    .replace(/pp/g, "p-p")
    .replace(/ss/g, "s-s")
    .replace(/tt/g, "t-t")

    // Finnish vowel combinations
    .replace(/ai/g, "ah-ee")
    .replace(/ei/g, "eh-ee")
    .replace(/oi/g, "oh-ee")
    .replace(/ui/g, "oo-ee")
    .replace(/yi/g, "ue-ee")
    .replace(/au/g, "ah-oo")
    .replace(/eu/g, "eh-oo")
    .replace(/ou/g, "oh-oo")

    // Add slight pauses for better pronunciation
    .replace(/\s+/g, " ... ")

  console.log(`Phonetic conversion: "${text}" -> "${phoneticText}"`)
  return phoneticText
}

// Initialize Finnish voice system
function initializeFinnishVoiceSystem() {
  if (!("speechSynthesis" in window)) {
    console.log("Speech synthesis not supported")
    return
  }

  const loadFinnishVoices = () => {
    const voices = speechSynthesis.getVoices()

    if (voices.length > 0) {
      console.log(`Total voices available: ${voices.length}`)

      // Find Finnish voices with strict criteria
      const finnishVoices = voices.filter((voice) => {
        const lang = voice.lang.toLowerCase()
        const name = voice.name.toLowerCase()

        return (
          lang === "fi-fi" ||
          lang === "fi" ||
          lang.startsWith("fi-") ||
          name.includes("finnish") ||
          name.includes("suomi") ||
          name.includes("finland")
        )
      })

      console.log(`Native Finnish voices found: ${finnishVoices.length}`)

      if (finnishVoices.length > 0) {
        // Always select the FIRST available Finnish voice (no randomness)
        selectedFinnishVoice = finnishVoices[0]
        usePhoneticFallback = false
        console.log(`✅ Selected native Finnish voice: ${selectedFinnishVoice.name} (${selectedFinnishVoice.lang})`)
      } else {
        // No Finnish voices - use phonetic fallback with best available voice
        console.log("❌ No native Finnish voices found")

        // Find the best fallback voice (prefer European voices)
        const europeanVoices = voices.filter((voice) => {
          const lang = voice.lang.toLowerCase()
          return (
            lang.startsWith("sv-") || // Swedish
            lang.startsWith("no-") || // Norwegian
            lang.startsWith("da-") || // Danish
            lang.startsWith("de-") || // German
            lang.startsWith("nl-") || // Dutch
            lang.startsWith("en-gb") // British English (better for European sounds)
          )
        })

        if (europeanVoices.length > 0) {
          selectedFinnishVoice = europeanVoices[0]
          console.log(`🔄 Using European fallback voice: ${selectedFinnishVoice.name} (${selectedFinnishVoice.lang})`)
        } else {
          // Last resort: use any available voice
          selectedFinnishVoice = voices[0]
          console.log(`⚠️ Using default fallback voice: ${selectedFinnishVoice.name} (${selectedFinnishVoice.lang})`)
        }

        usePhoneticFallback = true
        console.log("🔤 Phonetic fallback system activated")
      }

      voicesLoaded = true
    }
  }

  // Load voices immediately
  loadFinnishVoices()

  // Listen for voice changes
  speechSynthesis.addEventListener("voiceschanged", loadFinnishVoices)

  // Force load with timeouts for different browsers
  setTimeout(loadFinnishVoices, 100)
  setTimeout(loadFinnishVoices, 500)
  setTimeout(loadFinnishVoices, 1000)
  setTimeout(loadFinnishVoices, 2000)
}

// Main Finnish speech function with native pronunciation guarantee
function speakFinnishWord(text) {
  console.log("🎤 Speaking Finnish:", text)

  // Always stop any current speech first
  stopCurrentSpeech()

  if (!("speechSynthesis" in window)) {
    console.log("❌ Speech synthesis not supported")
    return
  }

  // Ensure voices are loaded
  if (!voicesLoaded) {
    console.log("⏳ Voices not loaded yet, initializing...")
    initializeFinnishVoiceSystem()
    setTimeout(() => speakFinnishWord(text), 800)
    return
  }

  if (!selectedFinnishVoice) {
    console.log("❌ No voice selected")
    return
  }

  try {
    // Determine text to speak
    let textToSpeak = text

    if (usePhoneticFallback) {
      textToSpeak = convertToFinnishPhonetic(text)
      console.log("🔤 Using phonetic fallback")
    } else {
      console.log("🇫🇮 Using native Finnish voice")
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)

    // ALWAYS set Finnish language regardless of voice
    utterance.lang = "fi-FI"

    // Optimize settings for Finnish pronunciation
    utterance.rate = 0.75 // Slightly slower for clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Use the selected voice
    utterance.voice = selectedFinnishVoice
    console.log(`🔊 Using voice: ${selectedFinnishVoice.name} (${selectedFinnishVoice.lang})`)

    // Event listeners
    utterance.addEventListener("start", () => {
      currentSpeechUtterance = utterance
      console.log("▶️ Finnish speech started")
    })

    utterance.addEventListener("end", () => {
      currentSpeechUtterance = null
      console.log("⏹️ Finnish speech completed")
    })

    utterance.addEventListener("error", (event) => {
      console.log("❌ Speech error:", event.error)
      currentSpeechUtterance = null
    })

    // Speak with guaranteed Finnish pronunciation
    speechSynthesis.speak(utterance)
    currentSpeechUtterance = utterance
  } catch (error) {
    console.log("❌ Speech synthesis error:", error)
    currentSpeechUtterance = null
  }
}

// Enhanced stop function
function stopCurrentSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }
  if (currentSpeechUtterance) {
    currentSpeechUtterance = null
  }
  // Additional safety delay
  setTimeout(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
  }, 50)
}

// Module 2 variables
let currentModule2Question = 0

function playCurrentQuestion() {
  const questionText = document.getElementById("module2-question-text").textContent
  speakFinnishWord(questionText)
}

function nextModule2Question() {
  if (currentModule2Question < questions.length - 1) {
    currentModule2Question++
    updateModule2Question()
  }
}

function updateModule2Question() {
  const question = questions[currentModule2Question]
  document.getElementById("module2-question-text").textContent = question.text

  // Update progress
  const progress = ((currentModule2Question + 1) / questions.length) * 100
  document.getElementById("module2-progress-fill").style.width = progress + "%"
  document.getElementById("module2-progress-counter").textContent =
    `${currentModule2Question + 1} / ${questions.length}`

  // Hide feedback
  document.getElementById("module2-feedback").style.display = "none"
}

// Enhanced function to check Module 2 clickable answers with Finnish voice feedback
function checkModule2Answer(item) {
  const currentQuestion = questions[currentModule2Question]

  if (currentQuestion.type !== "question") {
    return
  }

  const feedbackElement = document.getElementById("module2-feedback")
  const feedbackText = document.getElementById("module2-feedback-text")
  const feedbackBtn = document.getElementById("module2-feedback-btn")

  if (item === currentQuestion.item) {
    // Correct answer
    feedbackElement.className = "module2-feedback correct"
    feedbackText.textContent = currentQuestion.correctFeedback
    feedbackBtn.textContent = "Seuraava kysymys"
    // Play Finnish voice for correct feedback
    speakFinnishWord(currentQuestion.correctFeedback)
  } else {
    // Wrong answer
    feedbackElement.className = "module2-feedback incorrect"
    feedbackText.textContent = currentQuestion.incorrectFeedback
    feedbackBtn.textContent = "Yritä uudelleen"
    // Play Finnish voice for incorrect feedback
    speakFinnishWord(currentQuestion.incorrectFeedback)
  }

  feedbackElement.style.display = "block"
}

function handleModule2Feedback() {
  const feedbackBtn = document.getElementById("module2-feedback-btn")

  if (feedbackBtn.textContent === "Yritä uudelleen") {
    // Hide feedback and let user try again
    document.getElementById("module2-feedback").style.display = "none"
  } else {
    // Move to next question
    document.getElementById("module2-feedback").style.display = "none"

    if (currentModule2Question < questions.length - 1) {
      nextModule2Question()
    } else {
      // Module 2 completed, go directly to Module 3
      showModule("moduuli3")
    }
  }
}

// Module 4 variables
let currentModule4Question = 0

function playModule4Question() {
  const questionText = document.getElementById("module4-question-text").textContent
  speakFinnishWord(questionText)
}

function answerModule4Question(answer) {
  const question = trueFalseQuestions[currentModule4Question]
  const isCorrect = (answer === "true" && question.correct) || (answer === "false" && !question.correct)

  const feedbackElement = document.getElementById("module4-feedback")
  const feedbackText = document.getElementById("module4-feedback-text")

  if (isCorrect) {
    feedbackElement.className = "module4-feedback correct"
    feedbackText.textContent = question.correctFeedback
    // Play Finnish voice for correct feedback
    speakFinnishWord(question.correctFeedback)
  } else {
    feedbackElement.className = "module4-feedback incorrect"
    feedbackText.textContent = question.incorrectFeedback
    // Play Finnish voice for incorrect feedback
    speakFinnishWord(question.incorrectFeedback)
  }

  feedbackElement.style.display = "block"
}

function handleModule4Feedback() {
  document.getElementById("module4-feedback").style.display = "none"

  if (currentModule4Question < trueFalseQuestions.length - 1) {
    currentModule4Question++
    updateModule4Question()
  } else {
    // Last question completed, go directly to feedback page
    showPage("palautetta")
  }
}

function updateModule4Question() {
  const question = trueFalseQuestions[currentModule4Question]
  document.getElementById("module4-question-text").textContent = question.statement

  // Update progress
  const progress = ((currentModule4Question + 1) / trueFalseQuestions.length) * 100
  document.getElementById("module4-progress-fill").style.width = progress + "%"
  document.getElementById("module4-progress-counter").textContent =
    `${currentModule4Question + 1} / ${trueFalseQuestions.length}`
}

// Enhanced function to set up vocabulary matching with proper green background logic
function setupVocabularyMatching() {
  const wordBubbles = document.querySelectorAll(".word-bubble")
  const imageContainers = document.querySelectorAll(".vocab-image-container-large")

  // Add click handlers to word bubbles
  wordBubbles.forEach((bubble) => {
    bubble.addEventListener("click", function () {
      const word = this.getAttribute("data-word")
      if (!word) return

      // Play Finnish pronunciation
      speakFinnishWord(word)

      // Show the word text and hide other elements
      this.classList.add("revealed")

      // Remove previous selections
      wordBubbles.forEach((b) => b.classList.remove("selected"))

      // Select this bubble
      this.classList.add("selected")
      currentVocabItem = word
    })
  })

  // Add click handlers to images
  imageContainers.forEach((container) => {
    container.addEventListener("click", function () {
      if (currentVocabItem) {
        const imageWord = this.getAttribute("data-word")

        if (imageWord === currentVocabItem) {
          // Correct match - add green background
          this.classList.add("matched")
          if (!matchedWords.includes(currentVocabItem)) {
            matchedWords.push(currentVocabItem)
          }

          // Reset selection
          wordBubbles.forEach((b) => b.classList.remove("selected"))
          currentVocabItem = null

          // Don't automatically go to Module 2 - wait for "✓ Tarkista" button
        } else {
          // Wrong match - no green background, show feedback
          alert("Väärin. Yritä uudelleen.")
        }
      } else {
        alert("Valitse ensin sana klikkaamalla puhekuplaa.")
      }
    })
  })
}

// Function to check vocabulary answers - go directly to Module 2 only when clicking "✓ Tarkista"
function checkVocabularyAnswers() {
  const matchedCount = matchedWords.length
  const totalCount = vocabularyItems.length

  if (matchedCount === totalCount) {
    // Go directly to Module 2
    showPage("moduuli2-start")
  } else {
    alert(`Olet yhdistänyt ${matchedCount}/${totalCount} sanaa oikein. Jatka harjoittelua!`)
  }
}

// Function to play audio with enhanced Finnish pronunciation
function playAudio(audioId) {
  const audio = document.getElementById(audioId)
  if (audio) {
    audio.play()
  } else {
    // Use enhanced Finnish speech synthesis as fallback
    const word = audioId.replace("-audio", "")
    speakFinnishWord(word)
  }
}

// Function to show exercise tabs in Module 3
function showExercise(exercise) {
  currentExercise = exercise

  // Update tab buttons
  const tabButtons = document.querySelectorAll(".tab-button")
  tabButtons.forEach((button) => {
    button.classList.remove("active")
  })

  // Find and activate the clicked tab
  const activeTab = document.querySelector(`[onclick="showExercise('${exercise}')"]`)
  if (activeTab) {
    activeTab.classList.add("active")
  }

  // Hide all exercise sections
  const exerciseSections = document.querySelectorAll(".exercise-section")
  exerciseSections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show the selected exercise section
  const selectedSection = document.getElementById(`exercise-${exercise.toLowerCase()}`)
  if (selectedSection) {
    selectedSection.classList.add("active")
  }
}

// Function to set up matching exercises
function setupMatchingExercises() {
  const matchingItems = document.querySelectorAll(".matching-item")
  const matchingSlots = document.querySelectorAll(".matching-slot")

  let selectedItem = null

  matchingItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove previous selections
      matchingItems.forEach((i) => i.classList.remove("selected"))

      // Select this item
      this.classList.add("selected")
      selectedItem = this
    })
  })

  matchingSlots.forEach((slot) => {
    slot.addEventListener("click", function () {
      if (selectedItem) {
        const itemId = selectedItem.getAttribute("data-id")
        const slotMatch = this.getAttribute("data-match")

        if (itemId === slotMatch) {
          // Correct match
          selectedItem.classList.add("matched")
          selectedItem.classList.remove("selected")
          this.classList.add("matched")
          selectedItem = null
        } else {
          // Wrong match
          alert("Väärin. Yritä uudelleen.")
        }
      } else {
        alert("Valitse ensin lause vasemmalta puolelta.")
      }
    })
  })
}

// Function to check matching answers - navigate to next exercise
function checkMatchingAnswers(exerciseId) {
  const currentExerciseElement = document.querySelector(".exercise-section.active")
  const matchedItems = currentExerciseElement.querySelectorAll(".matching-item.matched")
  const totalItems = currentExerciseElement.querySelectorAll(".matching-item")

  if (matchedItems.length === totalItems.length) {
    // All correct, move to next exercise
    if (currentExercise === "A") {
      showExercise("B")
    } else if (currentExercise === "B") {
      showExercise("C")
    } else if (currentExercise === "C") {
      // After C, go to Module 4
      showModule("moduuli4")
    }
  } else {
    alert("Jatka harjoittelua. Kaikki lauseet eivät ole vielä oikein yhdistetty.")
  }
}

// Function to set up the fill-in exercise
function setupFillInExercise() {
  const verbOptions = document.querySelectorAll(".verb-option")
  const blanks = document.querySelectorAll(".fill-in-blank")

  verbOptions.forEach((option) => {
    option.addEventListener("click", function () {
      selectedVerb = this.textContent

      // Remove selected class from all options
      verbOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to the clicked option
      this.classList.add("selected")
    })
  })

  // Make blanks clickable
  blanks.forEach((blank) => {
    blank.addEventListener("click", function () {
      if (selectedVerb) {
        this.textContent = selectedVerb
        this.classList.remove("incorrect")

        if (this.dataset.correct === selectedVerb) {
          this.classList.add("correct")
        } else {
          this.classList.add("incorrect")
        }

        selectedVerb = ""
        verbOptions.forEach((opt) => opt.classList.remove("selected"))
      }
    })
  })
}

// Function to select a verb for the fill-in exercise
function selectVerb(verb) {
  selectedVerb = verb

  // Remove selected class from all options
  const verbOptions = document.querySelectorAll(".verb-option")
  verbOptions.forEach((opt) => opt.classList.remove("selected"))

  // Add selected class to the clicked option
  const selectedOption = Array.from(verbOptions).find((opt) => opt.textContent === verb)
  if (selectedOption) {
    selectedOption.classList.add("selected")
  }
}

// Function to check fill-in answers - navigate to Module 4
function checkFillInAnswers() {
  const blanks = document.querySelectorAll(".fill-in-blank")
  let allCorrect = true

  blanks.forEach((blank) => {
    if (blank.textContent === "[___________]" || blank.textContent !== blank.dataset.correct) {
      allCorrect = false
      blank.classList.add("incorrect")
    } else {
      blank.classList.add("correct")
    }
  })

  if (allCorrect) {
    // Go directly to Module 4
    showPage("moduuli4")
  } else {
    alert("Tarkista vastaukset ja yritä uudelleen.")
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Finnish voice system
  initializeFinnishVoiceSystem()

  // Set up vocabulary matching
  setupVocabularyMatching()

  // Set up matching exercises
  setupMatchingExercises()

  // Set up fill-in exercises
  setupFillInExercise()
})

// Function to show a specific page
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => {
    page.classList.remove("active")
  })

  // Show the selected page
  const selectedPage = document.getElementById(pageId)
  if (selectedPage) {
    selectedPage.classList.add("active")
    currentPage = pageId

    // Update navigation
    const navLinks = document.querySelectorAll(".header-nav a")
    navLinks.forEach((link) => {
      link.classList.remove("active")
    })

    // Set active nav based on page
    if (pageId === "etusivu") {
      document.querySelector("[onclick=\"showPage('etusivu')\"]").classList.add("active")
    } else if (pageId === "oppimispolku" || pageId.includes("moduuli") || pageId === "learning-modules") {
      document.querySelector("[onclick=\"showPage('oppimispolku')\"]").classList.add("active")
    } else if (pageId === "palautetta") {
      document.querySelector("[onclick=\"showPage('palautetta')\"]").classList.add("active")
    }

    // Special handling for module pages
    if (pageId.includes("moduuli") && !pageId.includes("start")) {
      showPage("learning-modules")
      showModule(pageId)
    }

    // Reset module-specific state if needed
    if (pageId === "moduuli2") {
      currentModule2Question = 0
      updateModule2Question()
    }

    // Scroll to top of the page
    window.scrollTo(0, 0)
  }
}

// Function to show a specific module section
function showModule(sectionId) {
  // Show the learning modules page first
  showPage("learning-modules")

  // Hide all module sections
  const sections = document.querySelectorAll(".module-section")
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show the selected section
  const selectedSection = document.getElementById(sectionId)
  if (selectedSection) {
    selectedSection.classList.add("active")
    currentModuleSection = sectionId

    // Update sidebar
    const moduleItems = document.querySelectorAll(".module-item")
    moduleItems.forEach((item) => {
      item.classList.remove("active")
    })

    // Find and activate the corresponding sidebar item
    const moduleIndex = Number.parseInt(sectionId.replace("moduuli", "")) - 1
    if (moduleItems[moduleIndex]) {
      moduleItems[moduleIndex].classList.add("active")
    }
  }
}

// Function to navigate between modules
function navigateModule(direction) {
  if (currentModuleSection === "moduuli2") {
    // Navigate between Module 2 questions
    if (direction === "next") {
      if (currentModule2Question < questions.length - 1) {
        nextModule2Question()
      } else {
        // Go to Module 3
        showModule("moduuli3")
      }
    } else if (direction === "prev") {
      if (currentModule2Question > 0) {
        currentModule2Question--
        updateModule2Question()
      } else {
        // Go to Module 1
        showModule("moduuli1")
      }
    }
  } else if (currentModuleSection === "moduuli3") {
    // Navigate between Module 3 exercises
    if (direction === "next") {
      if (currentExercise === "A") {
        showExercise("B")
      } else if (currentExercise === "B") {
        showExercise("C")
      } else if (currentExercise === "C") {
        showModule("moduuli4")
      }
    } else if (direction === "prev") {
      if (currentExercise === "C") {
        showExercise("B")
      } else if (currentExercise === "B") {
        showExercise("A")
      } else if (currentExercise === "A") {
        showModule("moduuli2")
      }
    }
  } else if (currentModuleSection === "moduuli4") {
    // Navigate between Module 4 questions
    if (direction === "next") {
      if (currentModule4Question < trueFalseQuestions.length - 1) {
        currentModule4Question++
        updateModule4Question()
      } else {
        // Go to feedback page
        showPage("palautetta")
      }
    } else if (direction === "prev") {
      if (currentModule4Question > 0) {
        currentModule4Question--
        updateModule4Question()
      } else {
        // Go to Module 3
        showModule("moduuli3")
      }
    }
  } else {
    // Default navigation between modules
    const moduleOrder = ["moduuli1", "moduuli2", "moduuli3", "moduuli4"]
    const currentIndex = moduleOrder.indexOf(currentModuleSection)

    if (direction === "next" && currentIndex < moduleOrder.length - 1) {
      showModule(moduleOrder[currentIndex + 1])
    } else if (direction === "prev" && currentIndex > 0) {
      showModule(moduleOrder[currentIndex - 1])
    } else if (direction === "next" && currentIndex === moduleOrder.length - 1) {
      showPage("palautetta")
    } else if (direction === "prev" && currentIndex === 0) {
      showPage("oppimispolku")
    }
  }
}
