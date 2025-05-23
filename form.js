document.addEventListener("DOMContentLoaded", () => {
  // Form elements
  const form = document.getElementById("leadForm")
  const submitButton = document.getElementById("submit-button")
  const spinner = document.getElementById("spinner")

  // Input mask for phone number
  const telefoneInput = document.getElementById("telefone")
  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 0) {
        if (value.length <= 2) {
          value = `(${value}`
        } else if (value.length <= 7) {
          value = `(${value.substring(0, 2)}) ${value.substring(2)}`
        } else {
          value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`
        }
      }
      e.target.value = value
    })
  }

  // Form validation
  function validateForm() {
    let isValid = true
    const fields = [
      { id: "nome", message: "Por favor, informe seu nome completo" },
      {
        id: "email",
        message: "Por favor, informe um e-mail válido",
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      },
      {
        id: "telefone",
        message: "Por favor, informe um telefone válido",
        validator: (value) => value.replace(/\D/g, "").length >= 10,
      },
      { id: "tipo", message: "Por favor, selecione o tipo de imóvel" },
      { id: "estagio", message: "Por favor, selecione o estágio do imóvel" },
      { id: "valor", message: "Por favor, selecione o valor de investimento" },
    ]

    // Reset all error states
    fields.forEach((field) => {
      const element = document.getElementById(field.id)
      const errorElement = document.getElementById(`${field.id}-error`)
      const formGroup = element.closest(".form-group")

      formGroup.classList.remove("error")
      if (errorElement) errorElement.textContent = ""
    })

    // Validate each field
    fields.forEach((field) => {
      const element = document.getElementById(field.id)
      const errorElement = document.getElementById(`${field.id}-error`)
      const formGroup = element.closest(".form-group")
      let fieldValid = true

      if (!element.value.trim()) {
        fieldValid = false
      } else if (field.validator && !field.validator(element.value)) {
        fieldValid = false
      }

      if (!fieldValid) {
        isValid = false
        formGroup.classList.add("error")
        if (errorElement) errorElement.textContent = field.message
      }
    })

    return isValid
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      // Show loading state
      submitButton.classList.add("loading")

      const formData = new FormData()
      formData.append("nome", document.getElementById("nome")?.value.trim())
      formData.append("email", document.getElementById("email")?.value.trim())
      formData.append("telefone", document.getElementById("telefone")?.value.trim())
      formData.append("tipo", document.getElementById("tipo")?.value)
      formData.append("estagio", document.getElementById("estagio")?.value)
      formData.append("valor", document.getElementById("valor")?.value)
      formData.append("info", document.getElementById("info")?.value.trim())

      fetch(
        "https://script.google.com/macros/s/AKfycbwPu_1texbF5Fs2Bn6NlDiiCi3QJt7a4YopXPFMVDO5v59TerQHLqEgS3roqulvSAv5bw/exec",
        {
          method: "POST",
          body: formData,
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro na resposta do servidor: " + response.status)
          }
          return response.json()
        })
        .then((res) => {
          if (res.success) {
            showToast("Seus dados foram enviados com sucesso!", false)
            form.reset()
            // Reset form state
            const formGroups = document.querySelectorAll(".form-group")
            formGroups.forEach((group) => group.classList.remove("error"))
          } else {
            showToast("❌ " + (res.error || "Ocorreu um erro ao enviar seus dados."), true)
            console.warn("Erro retornado:", res)
          }
        })
        .catch((err) => {
          console.error("Erro na requisição:", err)
          showToast("❌ Erro de conexão ao enviar os dados. Tente novamente.", true)
        })
        .finally(() => {
          // Hide loading state
          submitButton.classList.remove("loading")
        })
    })
  }

  // Toast notification
  function showToast(message, isError = false) {
    const toast = document.getElementById("form-toast")
    const toastMessage = toast.querySelector(".toast-message")
    const toastIcon = toast.querySelector(".toast-icon")

    if (toastMessage) toastMessage.textContent = message
    else toast.textContent = message

    if (toastIcon) {
      toastIcon.innerHTML = isError ? "❌" : "✅"
    }

    toast.className = "form-toast"
    if (isError) toast.classList.add("error")

    // Show the toast
    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    // Hide the toast after a delay
    setTimeout(() => {
      toast.classList.remove("show")
    }, 5000)
  }
})
