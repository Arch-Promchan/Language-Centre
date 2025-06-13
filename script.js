// Global variables
let currentModule = "etusivu"
let currentQuestion = 0
let selectedVerb = ""
let currentLanguage = "fi"

const questions = [
  {
    text: {
      fi: "Hei! Tämä on mukava kahvila. Tässä kahvilassa on itsepalvelu. Se tarkoittaa, että sinä voit ottaa kahvia tai teetä itse.",
      en: "Hi! This is a nice café. This café has self-service. That means you can get coffee or tea yourself.",
    },
    item: null,
    feedback: {
      correct: "",
      incorrect: "",
    },
  },
  {
    text: {
      fi: "Ensin helppo sana. Missä on kahviautomaatti?",
      en: "First an easy word. Where is the coffee machine?",
    },
    item: "kahviautomaatti",
    feedback: {
      correct: {
        fi: "Joo, se on kahviautomaatti. Sinä voit valita, millaista kahvia haluat. Otatko maitokahvia, espressoa vai jotain muuta? Minä tykkään tavallisesta mustasta kahvista.",
        en: "Yes, that's the coffee machine. You can choose what kind of coffee you want. Would you like coffee with milk, espresso, or something else? I like regular black coffee.",
      },
      incorrect: {
        fi: "Se ei ole kahviautomaatti. Kahviautomaatti on iso ja musta kone.",
        en: "That's not the coffee machine. The coffee machine is a big black machine.",
      },
    },
  },
  {
    text: {
      fi: "Tiedätkö, missä on vedenkeitin?",
      en: "Do you know where the water kettle is?",
    },
    item: "vedenkeitin",
    feedback: {
      correct: {
        fi: "Kyllä, se on valkoinen vedenkeitin. Tämän vedenkeittimen merkki on Smeg. Vedenkeitin on tosi hyödyllinen, koska voit keittää sillä kuumaa vettä nopeasti.",
        en: "Yes, that's the white water kettle. This water kettle's brand is Smeg. A water kettle is very useful because you can boil hot water quickly with it.",
      },
      incorrect: {
        fi: "Se ei ole vedenkeitin. Vedenkeitin on valkoinen.",
        en: "That's not the water kettle. The water kettle is white.",
      },
    },
  },
  {
    text: {
      fi: "Missä on kahvitermos?",
      en: "Where is the coffee thermos?",
    },
    item: "kahvitermos",
    feedback: {
      correct: {
        fi: "Juu, se on kahvitermos. Tässä kahvilassa onkin kaksi kahvitermosta. Termoksessa on kuumaa kahvia.",
        en: "Yes, that's the coffee thermos. This café actually has two coffee thermoses. The thermos contains hot coffee.",
      },
      incorrect: {
        fi: "Ei, se ei ole kahvitermos. Kuvassa on kaksi samanlaista kahvitermosta. Löydätkö ne?",
        en: "No, that's not the coffee thermos. There are two similar coffee thermoses in the picture. Can you find them?",
      },
    },
  },
  {
    text: {
      fi: "Missä ovat teepussit? Löydätkö ne?",
      en: "Where are the tea bags? Can you find them?",
    },
    item: "teepussit",
    feedback: {
      correct: {
        fi: "Kyllä, siinä ovat teepussit. Minä juon yleensä mustaherukkateetä. Mistä teestä sinä tykkäät?",
        en: "Yes, those are the tea bags. I usually drink blackcurrant tea. What kind of tea do you like?",
      },
      incorrect: {
        fi: "Nyt meni väärin. Teepussit ovat vedenkeittimen lähellä.",
        en: "That's wrong. The tea bags are near the water kettle.",
      },
    },
  },
  {
    text: {
      fi: "Missä on hunajaa?",
      en: "Where is the honey?",
    },
    item: "hunaja",
    feedback: {
      correct: {
        fi: "Hyvä, löysit hunajan! Tässä on kaksi pulloa hunajaa. Minä käytän hunajaa, kun juon teetä.",
        en: "Good, you found the honey! There are two bottles of honey here. I use honey when I drink tea.",
      },
      incorrect: {
        fi: "Se ei ole hunajaa. Kokeile uudelleen!",
        en: "That's not honey. Try again!",
      },
    },
  },
  {
    text: {
      fi: "Ja vielä lopuksi. Kuvassa on viisi purkkia makeutusainetta. Missä ne ovat?",
      en: "And finally. There are five containers of sweetener in the picture. Where are they?",
    },
    item: "makeutusaine",
    feedback: {
      correct: {
        fi: "Hienoa, ne ovat makeutusainetta. Käytän makeutusainetta joskus kahvissa. Yleensä juon kahvia ilman makeutusainetta tai sokeria.",
        en: "Great, those are sweeteners. I sometimes use sweetener in coffee. Usually I drink coffee without sweetener or sugar.",
      },
      incorrect: {
        fi: "Se ei ole makeutusainetta. Makeutusaineet ovat teen vieressä.",
        en: "That's not sweetener. The sweeteners are next to the tea.",
      },
    },
  },
]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Set up drag and drop for matching exercises
  setupDragAndDrop()

  // Set up the fill-in exercise
  setupFillInExercise()

  // Fix module navigation
  setupModuleNavigation()

  // Initialize language
  updateLanguage(currentLanguage)
})

// Function to set up module navigation
function setupModuleNavigation() {
  const navLinks = document.querySelectorAll(".module-nav a")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const moduleId = this.getAttribute("href").substring(1)
      showModule(moduleId)
    })
  })
}

// Function to show a specific module
function showModule(moduleId) {
  // Hide all modules
  const modules = document.querySelectorAll(".module")
  modules.forEach((module) => {
    module.classList.remove("active")
  })

  // Show the selected module
  const selectedModule = document.getElementById(moduleId)
  if (selectedModule) {
    selectedModule.classList.add("active")
    currentModule = moduleId

    // Update navigation
    const navLinks = document.querySelectorAll(".module-nav a")
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === "#" + moduleId) {
        link.classList.add("active")
      }
    })

    // Reset module-specific state if needed
    if (moduleId === "moduuli2") {
      currentQuestion = 0
      updateCurrentQuestion()
    }

    // Scroll to top of the module
    window.scrollTo(0, 0)
  }
}

// Function to play audio
function playAudio(audioId) {
  const audio = document.getElementById(audioId)
  if (audio) {
    audio.play()
  } else {
    // If audio element doesn't exist, use AI voice
    const textElement = document.querySelector(`[data-audio-id="${audioId}"]`)
    if (textElement && window.finnishVoice) {
      window.finnishVoice.speak(textElement.textContent)
    }
  }
}

// Function to update the current question in Module 2
function updateCurrentQuestion() {
  const questionText = document.getElementById("current-question-text")
  if (questionText && questions[currentQuestion]) {
    questionText.textContent = questions[currentQuestion].text[currentLanguage]

    // Update data-audio-id attribute for AI voice
    questionText.setAttribute("data-audio-id", "question-audio")
  }
}

// Function to play the next question in Module 2
function playNextQuestion() {
  currentQuestion = (currentQuestion + 1) % questions.length
  updateCurrentQuestion()
  playAudio("question-audio")
}

// Function to check the answer in Module 2
function checkAnswer(item) {
  const currentItem = questions[currentQuestion].item

  if (!currentItem) {
    // This is just an introduction, not a question
    return
  }

  const feedbackContainer = document.getElementById("feedback-container")
  const feedbackText = document.getElementById("feedback-text")

  if (item === currentItem) {
    feedbackText.textContent = questions[currentQuestion].feedback.correct[currentLanguage]
    feedbackText.className = "correct"
  } else {
    feedbackText.textContent = questions[currentQuestion].feedback.incorrect[currentLanguage]
    feedbackText.className = "incorrect"
  }

  feedbackContainer.classList.add("show")
}

// Function to close the feedback
function closeFeedback() {
  const feedbackContainer = document.getElementById("feedback-container")
  feedbackContainer.classList.remove("show")
}

// Function to set up drag and drop for matching exercises
function setupDragAndDrop() {
  const matchingItems = document.querySelectorAll(".matching-item")

  matchingItems.forEach((item) => {
    item.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", this.dataset.id)
    })
  })

  const matchingSlots = document.querySelectorAll(".matching-slot")

  matchingSlots.forEach((slot) => {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault()
    })

    slot.addEventListener("drop", function (e) {
      e.preventDefault()
      const itemId = e.dataTransfer.getData("text/plain")
      const matchId = this.dataset.match

      if (itemId === matchId) {
        // Correct match
        const item = document.querySelector(`.matching-item[data-id="${itemId}"]`)
        item.classList.add("matched")
        this.classList.add("matched")
      }
    })
  })
}

// Function to check matching answers
function checkMatchingAnswers(matchingId) {
  // Count matched items
  const matchedItems = document.querySelectorAll(`.matching-item.matched`)
  const totalItems = document.querySelectorAll(`.matching-item`)

  if (matchedItems.length === totalItems.length / 2) {
    // Divide by 2 because we have two matching exercises
    const message =
      currentLanguage === "fi"
        ? "Hyvä! Olet yhdistänyt kaikki lauseet oikein."
        : "Good! You have matched all sentences correctly."
    alert(message)
  } else {
    const message =
      currentLanguage === "fi"
        ? "Jatka harjoittelua. Kaikki lauseet eivät ole vielä oikein yhdistetty."
        : "Continue practicing. Not all sentences are correctly matched yet."
    alert(message)
  }
}

// Function to set up the fill-in exercise
function setupFillInExercise() {
  const verbOptions = document.querySelectorAll(".verb-option")

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
  const blanks = document.querySelectorAll(".fill-in-blank")
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
        document.querySelectorAll(".verb-option").forEach((opt) => opt.classList.remove("selected"))
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
  const selectedOption = document.querySelector(`.verb-option:contains('${verb}')`)
  if (selectedOption) {
    selectedOption.classList.add("selected")
  }
}

// Function to check fill-in answers
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
    const message =
      currentLanguage === "fi" ? "Hienoa! Kaikki vastaukset ovat oikein!" : "Great! All answers are correct!"
    alert(message)
  } else {
    const message =
      currentLanguage === "fi" ? "Tarkista vastaukset ja yritä uudelleen." : "Check your answers and try again."
    alert(message)
  }
}

// Function to mark understanding level
function markUnderstanding(level) {
  const feedback = document.getElementById("understanding-feedback")

  if (currentLanguage === "fi") {
    switch (level) {
      case 1:
        feedback.textContent = "Hyvä alku! Jatka harjoittelua."
        break
      case 2:
        feedback.textContent = "Hienoa! Ymmärrät jo useita sanoja."
        break
      case 3:
        feedback.textContent = "Erinomaista! Ymmärrät jo paljon sanoja."
        break
      case 4:
        feedback.textContent = "Mahtavaa! Ymmärrät melkein kaikki sanat."
        break
      case 5:
        feedback.textContent = "Loistavaa! Ymmärrät tekstin erittäin hyvin!"
        break
    }
  } else {
    switch (level) {
      case 1:
        feedback.textContent = "Good start! Keep practicing."
        break
      case 2:
        feedback.textContent = "Great! You already understand several words."
        break
      case 3:
        feedback.textContent = "Excellent! You understand many words already."
        break
      case 4:
        feedback.textContent = "Awesome! You understand almost all words."
        break
      case 5:
        feedback.textContent = "Brilliant! You understand the text very well!"
        break
    }
  }
}

// Function to open translator
function openTranslator() {
  const noticeText = document.querySelector(".notice-board").innerText
  const encodedText = encodeURIComponent(noticeText)
  window.open(`https://translate.google.com/?sl=fi&tl=en&text=${encodedText}&op=translate`, "_blank")
}

// Function to check true/false answers
function checkTrueFalse(questionNumber, answer) {
  const feedback = document.getElementById(`feedback-${questionNumber}`)
  const correctAnswers = {
    1: "false",
    2: "false",
    3: "true",
    4: "true",
    5: "true",
  }

  if (answer === correctAnswers[questionNumber]) {
    feedback.textContent = currentLanguage === "fi" ? "Oikein!" : "Correct!"
    feedback.className = "feedback correct"
  } else {
    feedback.textContent = currentLanguage === "fi" ? "Väärin. Yritä uudelleen." : "Wrong. Try again."
    feedback.className = "feedback incorrect"
  }
}

// Function to change language
function changeLanguage(lang) {
  currentLanguage = lang
  updateLanguage(lang)

  const buttons = document.querySelectorAll(".language-toggle button")
  buttons.forEach((button) => {
    button.classList.remove("active")
  })

  const activeButton = document.querySelector(`.language-toggle button[onclick="changeLanguage('${lang}')"]`)
  if (activeButton) {
    activeButton.classList.add("active")
  }
}

// Function to update all text elements based on language
function updateLanguage(lang) {
  const translations = {
    title: {
      fi: "Työpaikan kahvihuone | Finnish Language Centre",
      en: "Workplace Break Room | Finnish Language Centre",
    },
    "header-title": {
      fi: "Työpaikan kahvihuone",
      en: "Workplace Break Room",
    },
    "nav-home": {
      fi: "Etusivu",
      en: "Home",
    },
    "nav-module1": {
      fi: "Moduuli 1: Perussanasto",
      en: "Module 1: Basic Vocabulary",
    },
    "nav-module2": {
      fi: "Moduuli 2: Kuullun ymmärtäminen",
      en: "Module 2: Listening Comprehension",
    },
    "nav-module3": {
      fi: "Moduuli 3: Sanojen ja lauseiden harjoittelu",
      en: "Module 3: Word and Sentence Practice",
    },
    "nav-module4": {
      fi: "Moduuli 4: Tekstin ymmärtäminen",
      en: "Module 4: Text Comprehension",
    },
    "welcome-text": {
      fi: "Tervetuloa työpaikan kahvihuoneeseen! Kello on 14. Nyt juomme kahvia!",
      en: "Welcome to the workplace break room! It's 2 PM. Now we're having coffee!",
    },
    instructions: {
      fi: "Tässä materiaalissa on neljä erilaista tehtävää. Opit ensin perussanat. Sitten opit kuuntelemaan helppoja ohjeita, ja lopuksi voit vielä harjoitella sanoja ja fraaseja lisää.",
      en: "This material has four different exercises. First, you'll learn basic words. Then you'll learn to listen to simple instructions, and finally you can practice words and phrases more.",
    },
    level: {
      fi: "Taso: A1",
      en: "Level: A1",
    },
    "level-description": {
      fi: "Oletuksena on, että osaat jo suomen kielen äänteet, numerot, tervehdykset, kysymyssanoja, ruokasanoja ja perusverbejä.",
      en: "It is assumed that you already know Finnish phonetics, numbers, greetings, question words, food vocabulary, and basic verbs.",
    },
    "start-button": {
      fi: "Aloita oppiminen",
      en: "Start Learning",
    },
    "module1-title": {
      fi: "Moduuli 1: Perussanasto",
      en: "Module 1: Basic Vocabulary",
    },
    task1a: {
      fi: "Tehtävä 1a. Klikkaa puhekuplaa ja kuuntele sana. Yhdistä sana oikeaan kuvaan. Klikkaa kuvaa hiirellä.",
      en: "Task 1a. Click on the speech bubble and listen to the word. Match the word to the correct image. Click on the image with your mouse.",
    },
    task1b: {
      fi: "Tehtävä 1b",
      en: "Task 1b",
    },
    back: {
      fi: "← Takaisin",
      en: "← Back",
    },
    next: {
      fi: "Seuraava →",
      en: "Next →",
    },
    "module2-title": {
      fi: "Moduuli 2: Kuullun ymmärtäminen",
      en: "Module 2: Listening Comprehension",
    },
    task2: {
      fi: "Tehtävä 2. Tässä on kuva kahvihuoneesta. Kuuntele, mitä sinun työkaverisi sanoo, ja etsi kuvasta tavarat. Klikkaa tai näpäytä tavaraa.",
      en: "Task 2. Here is a picture of the break room. Listen to what your colleague says and find the items in the picture. Click or tap on the item.",
    },
    "next-question": {
      fi: "Seuraava kysymys",
      en: "Next Question",
    },
    "module3-title": {
      fi: "Moduuli 3: Sanojen ja lauseiden harjoittelu",
      en: "Module 3: Word and Sentence Practice",
    },
    task3a: {
      fi: "Tehtävä 3a. Harjoittele sanoja lisää. Yhdistä lauseet oikein.",
      en: "Task 3a. Practice words more. Match the sentences correctly.",
    },
    task3b: {
      fi: "Tehtävä 3b. Harjoittele sanoja lisää. Yhdistä lauseet oikein.",
      en: "Task 3b. Practice words more. Match the sentences correctly.",
    },
    task3c: {
      fi: "Tehtävä 3c. Ota selvää, mitä seuraavat verbit tarkoittavat: tyhjentää, pestä, ostaa, keittää, ottaa, laittaa. Seuraavaksi on käskyjä ja pyyntöjä, joita voit kuulla kahvihuoneessa. Yhdistä oikea sana oikeaan paikkaan.",
      en: "Task 3c. Find out what the following verbs mean: empty, wash, buy, brew, take, put. Next are commands and requests that you might hear in the break room. Match the right word to the right place.",
    },
    "check-answers": {
      fi: "Tarkista vastaukset",
      en: "Check Answers",
    },
    "module4-title": {
      fi: "Moduuli 4: Tekstin ymmärtäminen",
      en: "Module 4: Text Comprehension",
    },
    task4a: {
      fi: "Tehtävä 4a. Tekstin ymmärtäminen. Tämä on autenttinen teksti työpaikan kahvihuoneen seinällä. Kuuntele tekstin lauseet ja toista ne mallin mukaan.",
      en: "Task 4a. Text comprehension. This is an authentic text on the wall of a workplace break room. Listen to the sentences in the text and repeat them following the model.",
    },
    "notice-title": {
      fi: "Henkilökunnan taukotilan käyttäjät",
      en: "Break Room Users",
    },
    rule1: {
      fi: "Jokainen huolehtii tiskikoneen täyttämisestä ja tyhjentämisestä.",
      en: "Everyone takes care of filling and emptying the dishwasher.",
    },
    rule2: {
      fi: "Likaiset astiat viedään suoraan tiskikoneeseen.",
      en: "Dirty dishes are taken directly to the dishwasher.",
    },
    rule3: {
      fi: "Jos kone on täynnä, käynnistä kone.",
      en: "If the machine is full, start the machine.",
    },
    rule4: {
      fi: "Älä jätä kaappiin ruokaa vanhenemaan.",
      en: "Don't leave food in the cabinet to expire.",
    },
    rule5: {
      fi: "Jokainen korjaa omat jälkensä.",
      en: "Everyone cleans up after themselves.",
    },
    task4b: {
      fi: "Tehtävä 4b. Lue teksti uudelleen. Kuinka monta sanaa ymmärrät?",
      en: "Task 4b. Read the text again. How many words do you understand?",
    },
    "word-count-prompt": {
      fi: "Merkitse, kuinka monta sanaa ymmärrät:",
      en: "Mark how many words you understand:",
    },
    "words-1-5": {
      fi: "1-5 sanaa",
      en: "1-5 words",
    },
    "words-6-10": {
      fi: "6-10 sanaa",
      en: "6-10 words",
    },
    "words-11-15": {
      fi: "11-15 sanaa",
      en: "11-15 words",
    },
    "words-16-20": {
      fi: "16-20 sanaa",
      en: "16-20 words",
    },
    "words-20plus": {
      fi: "Yli 20 sanaa",
      en: "More than 20 words",
    },
    task4c: {
      fi: "Tehtävä 4c. Käännä teksti tekoälyn tai kääntäjän avulla ja vastaa, onko lause oikein vai väärin.",
      en: "Task 4c. Translate the text using AI or a translator and answer whether the sentence is true or false.",
    },
    "open-translator": {
      fi: "Avaa kääntäjä",
      en: "Open Translator",
    },
    question1: {
      fi: "1. Vain työpaikan sihteeri voi laittaa astiat tiskikoneeseen tai pois tiskikoneesta.",
      en: "1. Only the workplace secretary can put dishes in or take them out of the dishwasher.",
    },
    question2: {
      fi: "2. Sinä voit laittaa likaisen kupin kahvihuoneen pöydälle.",
      en: "2. You can put a dirty cup on the break room table.",
    },
    question3: {
      fi: "3. Sinä voit käynnistää tiskikoneen itse.",
      en: "3. You can start the dishwasher yourself.",
    },
    question4: {
      fi: "4. Sinä voit laittaa tuoretta ruokaa jääkaappiin.",
      en: "4. You can put fresh food in the refrigerator.",
    },
    question5: {
      fi: "5. Kaikki työntekijät siivoavat kahvihuoneessa.",
      en: "5. All employees clean in the break room.",
    },
    true: {
      fi: "Oikein",
      en: "True",
    },
    false: {
      fi: "Väärin",
      en: "False",
    },
    home: {
      fi: "Etusivu",
      en: "Home",
    },
    footer: {
      fi: "© 2025 Finnish Language Centre - Kielikeskus",
      en: "© 2025 Finnish Language Centre - Language Center",
    },
  }

  // Update document title
  document.title = translations["title"][lang]

  // Update all elements with data-translate attribute
  const elements = document.querySelectorAll("[data-translate]")
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[key] && translations[key][lang]) {
      element.textContent = translations[key][lang]
    }
  })

  // Update current question if in module 2
  if (currentModule === "moduuli2") {
    updateCurrentQuestion()
  }
}

// Helper function for jQuery-like :contains selector
document.querySelectorAll = ((originalQuerySelectorAll) => (selector) => {
  if (selector.includes(":contains")) {
    const parts = selector.split(":contains")
    const baseSelector = parts[0]
    const text = parts[1].replace(/['"()]/g, "")

    const elements = originalQuerySelectorAll.call(document, baseSelector)
    const result = []

    elements.forEach((element) => {
      if (element.textContent.includes(text)) {
        result.push(element)
      }
    })

    return result
  } else {
    return originalQuerySelectorAll.call(document, selector)
  }
})(document.querySelectorAll)
