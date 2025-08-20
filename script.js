// Global variables
let currentPage = "etusivu"
let currentModuleSection = "moduuli1"
const currentQuestion = 0
let selectedVerb = ""
const currentLanguage = "fi"
const matchedWords = []
let currentVocabItem = null
let currentExercise = "A"

let currentAudioElement = null
const audioSpeedStates = {} // Track speed state for each audio ID

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

function playAudioWithSpeedToggle(audioId, text = null) {
  console.log("[v0] Playing audio with speed toggle:", audioId)

  // Stop any currently playing audio
  stopAllAudio()

  // Get the audio element
  const audioElement = document.getElementById(audioId)

  if (!audioElement) {
    console.log("[v0] Audio element not found:", audioId)
    return
  }

  // Initialize speed state if not exists
  if (!audioSpeedStates[audioId]) {
    audioSpeedStates[audioId] = { isSlowSpeed: false }
  }

  // Toggle speed
  const speedState = audioSpeedStates[audioId]
  speedState.isSlowSpeed = !speedState.isSlowSpeed

  // Set playback rate
  audioElement.playbackRate = speedState.isSlowSpeed ? 0.75 : 1.0

  console.log("[v0] Playing at speed:", speedState.isSlowSpeed ? "0.75x (slow)" : "1.0x (normal)")

  // Reset to beginning and play
  audioElement.currentTime = 0
  currentAudioElement = audioElement

  audioElement.play().catch((error) => {
    console.log("[v0] Audio playback failed:", error)
  })

  // Handle audio end
  audioElement.addEventListener(
    "ended",
    () => {
      currentAudioElement = null
    },
    { once: true },
  )
}

function stopAllAudio() {
  // Stop current audio element
  if (currentAudioElement && !currentAudioElement.paused) {
    currentAudioElement.pause()
    currentAudioElement.currentTime = 0
  }
  currentAudioElement = null

  // Stop all other audio elements as backup
  const audioElements = document.querySelectorAll("audio")
  audioElements.forEach((audio) => {
    if (!audio.paused) {
      audio.pause()
      audio.currentTime = 0
    }
  })
}

function speakFinnishWord(text) {
  console.log("[v0] Speaking Finnish word (MP3 only):", text)

  let audioId = null

  // Comprehensive text-to-audio mapping
  const textToAudioMap = {
    // Module 2 specific texts
    "Hei! Tämä on mukava kahvila. Tässä kahvilassa on itsepalvelu. Se tarkoittaa, että sinä voit ottaa kahvia tai teetä itse. Kuvassa on paljon kaikkea sellaista, mitä tarvitset kahvilassa. Etsi minulle kuvasta seuraavat tavarat:":
      "m2start-audio",
    "Hienoa! Löysit kuvasta kaikki tärkeät kahvilan tavarat. Opiskele sanat hyvin, koska tarvitset niitä varmasti myöhemmin!":
      "m2end-audio",
    "Ensin helppo sana. Missä on kahviautomaatti?": "m2q1-audio",
    "Joo, se on kahviautomaatti. Sinä voit valita, millaista kahvia haluat. Otatko maitokahvia, espressoa vai jotain muuta? Minä tykkään tavallisesta mustasta kahvista.":
      "m2q1true-audio",
    "Se ei ole kahviautomaatti. Kahviautomaatti on iso ja musta kone.": "m2q1false-audio",
    "Tiedätkö, missä on vedenkeitin?": "m2q2-audio",
    "Kyllä, se on valkoinen vedenkeitin. Tämän vedenkeittimen merkki on Smeg. Vedenkeitin on tosi hyödyllinen, koska voit keittää sillä kuumaa vettä nopeasti.":
      "m2q2true-audio",
    "Se ei ole vedenkeitin. Vedenkeitin on valkoinen.": "m2q2false-audio",
    "Missä on kahvitermos?": "m2q3-audio",
    "Ei, se ei ole kahvitermos. Kuvassa on kaksi samanlaista kahvitermosta. Löydätkö ne?": "m2q3false-audio",
    "Juu, se on kahvitermos. Tässä kahvilassa onkin kaksi kahvitermosta. Termoksessa on kuumaa kahvia.":
      "m2q3true-audio",
    "Missä ovat teepussit? Löydätkö ne?": "m2q4-audio",
    "Kyllä, siinä ovat teepussit. Minä juon yleensä mustaherukkateetä. Mistä teestä sinä tykkäät?": "m2q4true-audio",
    "Nyt meni väärin. Teepussit ovat vedenkeittimen lähellä.": "m2q4false-audio",
    "Missä on hunajaa?": "m2q5-audio",
    "Hyvä, löysit hunajan! Tässä on kaksi pulloa hunajaa. Minä käytän hunajaa, kun juon teetä.": "m2q5true-audio",
    "Se ei ole hunajaa. Kokeile uudelleen!": "m2q5false-audio",
    "Ja vielä lopuksi. Kuvassa on viisi purkkia makeutusainetta. Missä ne ovat?": "m2q6-audio",
    "Hienoa, ne ovat makeutusainetta. Käytän makeutusainetta joskus kahvissa. Yleensä juon kahvia ilman makeutusainetta tai sokeria.":
      "m2q6true-audio",
    "Se ei ole makeutusainetta. Makeutusaineet ovat teen vieressä.": "m2q6false-audio",

    // Module 4 specific texts
    "Kahvilan seinä on vihreä.": "m4q1-audio",
    "Palaute oikea! Kahvilan seinä ei ole vihreä, vaan keltainen.": "m4q1c-audio",
    "Väärä vastaus. Kahvilan seinä ei ole vihreä, vaan keltainen.": "m4q1i-audio",
    "Pöydällä on keltaista mehua.": "m4q2-audio",
    "Palaute oikea! Pöydällä on keltaista mehua. Se on ehkä appelsiinimehua.": "m4q2c-audio",
    "Väärä vastaus. Pöydällä on keltaista mehua. Se on ehkä appelsiinimehua.": "m4q2i-audio",
    "Asiakas voi ottaa kahvia kahviautomaatista.": "m4q3-audio",
    "Palaute oikea! Kahvi on pöydällä kahvitermoksessa, ei automaatissa.": "m4q3c-audio",
    "Väärä vastaus. Kahvi on pöydällä kahvitermoksessa, ei automaatissa.": "m4q3i-audio",
    "Asiakas voi saada kakkua ja keksejä.": "m4q4-audio",
    "Palaute oikea! Pöydällä on vaaleita keksejä ja tummaa kakkua. Se on ehkä suklaakakkua.": "m4q4c-audio",
    "Väärä vastaus. Pöydällä on vaaleita keksejä ja tummaa kakkua. Se on ehkä suklaakakkua.": "m4q4i-audio",
    "Kaikki lasit ovat pöydällä.": "m4q5-audio",
    "Väärä vastaus. Lasit ovat hyllyllä, pöydän yläpuolella.": "m4q5i-audio",
    "Palaute oikea! Lasit ovat hyllyllä, pöydän yläpuolella.": "m4q5c-audio",
    "Kahvitermoksen takana on koriste-esine.": "m4q6-audio",
    "Palaute oikea! Kahvitermoksen takana on kaunis patsas.": "m4q6c-audio",
    "Väärä vastaus. Kahvitermoksen takana on kaunis patsas.": "m4q6i-audio",
  }

  // Check for exact text match first
  if (textToAudioMap[text]) {
    audioId = textToAudioMap[text]
  }
  // Check if this is a module-specific audio call (fallback for dynamic content)
  else if (isModule2Context() && currentModule2Question !== undefined) {
    const question = questions[currentModule2Question]
    if (text === question.correctFeedback) {
      audioId = `m2q${currentModule2Question + 1}true-audio`
    } else if (text === question.incorrectFeedback) {
      audioId = `m2q${currentModule2Question + 1}false-audio`
    } else if (text === question.text) {
      audioId = `m2q${currentModule2Question + 1}-audio`
    }
  } else if (isModule4Context() && currentModule4Question !== undefined) {
    const question = trueFalseQuestions[currentModule4Question]
    if (text === question.correctFeedback) {
      audioId = `m4q${currentModule4Question + 1}c-audio`
    } else if (text === question.incorrectFeedback) {
      audioId = `m4q${currentModule4Question + 1}i-audio`
    } else if (text === question.statement) {
      audioId = `m4q${currentModule4Question + 1}-audio`
    }
  }

  // If no module-specific mapping found, use default conversion
  if (!audioId) {
    audioId = text.toLowerCase().replace(/\s+/g, "-") + "-audio"
  }

  // Play with speed toggle
  playAudioWithSpeedToggle(audioId, text)
}

function playAudio(audioId) {
  console.log("[v0] Playing audio:", audioId)
  playAudioWithSpeedToggle(audioId)
}

// Module 2 variables
let currentModule2Question = 0
let module2CanProceed = false

function playCurrentQuestion() {
  const questionText = document.getElementById("module2-question-text").textContent
  speakFinnishWord(questionText)
}

function nextModule2Question() {
  const currentQuestion = questions[currentModule2Question]

  // For intro and completion questions, always allow progression
  if (currentQuestion.type === "intro" || currentQuestion.type === "completion") {
    if (currentModule2Question < questions.length - 1) {
      currentModule2Question++
      updateModule2Question()
      module2CanProceed = false // Reset for next question
    } else {
      // At the end, go directly to Module 3
      console.log("[v0] Module 2 completed - navigating to Module 3")
      showPage("learning-modules")
      setTimeout(() => {
        showModule("moduuli3")
      }, 100)
    }
    return
  }

  if (!module2CanProceed && currentQuestion.type === "question") {
    // Show message that they need to answer correctly first
    alert("Vastaa ensin kysymykseen oikein ennen jatkamista!")
    return
  }

  // Allow progression if user can proceed
  if (currentModule2Question < questions.length - 1) {
    currentModule2Question++
    updateModule2Question()
    module2CanProceed = false // Reset for next question
  } else {
    // At the end, go directly to Module 3
    console.log("[v0] Module 2 completed - navigating to Module 3")
    showPage("learning-modules")
    setTimeout(() => {
      showModule("moduuli3")
      console.log("[v0] Successfully navigated to Module 3")
    }, 100)
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

  const nextButton = document.querySelector("#moduuli2 .module-nav-button")
  if (nextButton) {
    nextButton.textContent = "Seuraava >"
  }
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
    module2CanProceed = true
    feedbackElement.className = "module2-feedback correct"
    feedbackText.textContent = currentQuestion.correctFeedback
    feedbackBtn.textContent = "Seuraava kysymys"
    // Play Finnish voice for correct feedback
    speakFinnishWord(currentQuestion.correctFeedback)
  } else {
    module2CanProceed = false
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
      const feedbackElement = document.getElementById("module2-feedback")
      const feedbackText = document.getElementById("module2-feedback-text")
      const feedbackBtn = document.getElementById("module2-feedback-btn")

      feedbackElement.className = "module2-feedback completion"
      feedbackText.textContent =
        "Hienoa! Löysit kuvasta kaikki tärkeät kahvilan tavarat. Opiskele sanat hyvin, koska tarvitset niitä varmasti myöhemmin!"
      feedbackBtn.textContent = "Seuraava >"
      feedbackElement.style.display = "block"

      // Play completion message
      speakFinnishWord(
        "Hienoa! Löysit kuvasta kaikki tärkeät kahvilan tavarat. Opiskele sanat hyvin, koska tarvitset niitä varmasti myöhemmin!",
      )

      feedbackBtn.onclick = (e) => {
        e.preventDefault()
        console.log("[v0] Final Seuraava > button clicked - navigating to Module 3")

        // Hide the feedback first
        feedbackElement.style.display = "none"

        // Navigate directly to module 3 with enhanced reliability
        showPage("learning-modules")
        setTimeout(() => {
          showModule("moduuli3")
          console.log("[v0] Successfully navigated to Module 3")
        }, 150)
      }
    }
  }
}

// Module 4 variables
let currentModule4Question = 0
let module4CanProceed = false

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
    module4CanProceed = true
    feedbackElement.className = "module4-feedback correct"
    feedbackText.textContent = question.correctFeedback
    // Play Finnish voice for correct feedback
    speakFinnishWord(question.correctFeedback)
  } else {
    module4CanProceed = false
    feedbackElement.className = "module4-feedback incorrect"
    feedbackText.textContent = question.incorrectFeedback
    // Play Finnish voice for incorrect feedback
    speakFinnishWord(question.incorrectFeedback)
  }

  feedbackElement.style.display = "block"
}

function handleModule4Feedback() {
  if (!module4CanProceed) {
    document.getElementById("module4-feedback").style.display = "none"
    return
  }

  document.getElementById("module4-feedback").style.display = "none"

  if (currentModule4Question < trueFalseQuestions.length - 1) {
    currentModule4Question++
    updateModule4Question()
    module4CanProceed = false // Reset for next question
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

      // Play Finnish pronunciation with speed toggle
      playAudioWithSpeedToggle(word + "-audio", word)

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

          // Don't automatically go to Module 2 - wait for "✓ Seuraava" button
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

function checkVocabularyAnswers() {
  const matchedCount = matchedWords.length
  const totalCount = vocabularyItems.length

  if (matchedCount === totalCount) {
    // Go directly to Module 2
    showPage("moduuli2-start")
  } else {
    alert(`Olet yhdistänyt ${matchedCount}/${totalCount} sanaa oikein. Yhdistä kaikki sanat ennen jatkamista!`)
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
    alert("Yhdistä kaikki lauseet oikein ennen jatkamista!")
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
    showModule("moduuli4")
  } else {
    alert("Täydennä kaikki kohdat oikein ennen jatkamista!")
  }
}

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
  }
}

// Function to show a specific module section
function showModule(sectionId) {
  console.log("showModule called with:", sectionId) // Added debugging

  // Show the learning modules page first
  showPage("learning-modules")

  // Hide all module sections
  const sections = document.querySelectorAll(".module-section")
  sections.forEach((section) => {
    section.classList.remove("active")
    section.style.display = "none"
  })

  // Show the selected section
  const selectedSection = document.getElementById(sectionId)
  if (selectedSection) {
    console.log("Found section:", sectionId) // Added debugging
    selectedSection.classList.add("active")
    selectedSection.style.display = "block"
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

    // Special handling for module 3 - ensure first exercise is active
    if (sectionId === "moduuli3") {
      console.log("Setting up Module 3...")
      showExercise("A")
    }

    // Special handling for module 2 - ensure button text is correct
    if (sectionId === "moduuli2") {
      setTimeout(() => {
        const nextButton = document.querySelector("#moduuli2 .module-nav-button")
        if (nextButton) {
          nextButton.textContent = "Seuraava >"
        }
      }, 50)
    }
  } else {
    console.log("Section not found:", sectionId)
  }
}

// Function to navigate between modules
function navigateModule(direction) {
  if (currentModuleSection === "moduuli2") {
    navigateModule2Direct(direction)
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

function navigateModule2Direct(direction) {
  if (direction === "next") {
    if (currentModule2Question < questions.length - 1) {
      currentModule2Question++
      updateModule2Question()
      module2CanProceed = false // Reset for next question
    } else {
      // At the end, go directly to Module 3
      console.log("[v0] Module 2 completed via arrow - navigating to Module 3")
      showPage("learning-modules")
      setTimeout(() => {
        showModule("moduuli3")
      }, 100)
    }
  } else if (direction === "prev") {
    if (currentModule2Question > 0) {
      currentModule2Question--
      updateModule2Question()
      module2CanProceed = false // Reset for next question
    } else {
      // Go to Module 1
      showModule("moduuli1")
    }
  }
}

function isModule2Context() {
  const module2Element = document.getElementById("moduuli2")
  return module2Element && module2Element.style.display !== "none"
}

function isModule4Context() {
  const module4Element = document.getElementById("moduuli4")
  return module4Element && module4Element.style.display !== "none"
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Set up vocabulary matching
  setupVocabularyMatching()

  // Set up matching exercises
  setupMatchingExercises()

  // Set up fill-in exercises
  setupFillInExercise()
})
