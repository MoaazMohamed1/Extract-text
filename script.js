async function extractText() {
  const imageInput = document.getElementById("imageUpload");
  const outputText = document.getElementById("outputText");
  const progressBar = document.getElementById("progressBar");
  const progress = document.getElementById("progress");

  if (!imageInput.files[0]) {
    alert("يرجى اختيار صورة!");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = async function () {
      try {
        // إظهار شريط التحميل
        progressBar.style.display = "block";

        // استخدام Tesseract.js للتعرف على النص
        await Tesseract.recognize(img.src, 'ara+eng', {
          logger: (info) => {
            // تحديث شريط التحميل بناءً على التقدم في العملية
            const progressPercent = info.progress * 100;
            progress.style.width = progressPercent + '%';
          },
        }).then(({ data: { text } }) => {
          outputText.value = text; // عرض النص المستخرج
          progressBar.style.display = "none";  // إخفاء شريط التحميل بعد اكتمال العملية
        });
      } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء تحليل الصورة!");
        progressBar.style.display = "none";  // إخفاء شريط التحميل في حالة حدوث خطأ
      }
    };
  };

  reader.readAsDataURL(imageInput.files[0]);
}

function copyText() {
  const outputText = document.getElementById("outputText");
  outputText.select();
  document.execCommand("copy");
  alert("تم نسخ النص إلى الحافظة!");
}

function shareText() {
  const outputText = document.getElementById("outputText").value;
  if (navigator.share) {
    navigator.share({
      title: "النص المستخرج",
      text: outputText,
    })
      .then(() => console.log("تمت المشاركة بنجاح"))
      .catch((error) => console.error("فشلت المشاركة", error));
  } else {
    alert("ميزة المشاركة غير مدعومة في هذا المتصفح.");
  }
}

function downloadPDF() {
  const outputText = document.getElementById("outputText").value;
  const { jsPDF } = window.jspdf;

  // إضافة خط عربي (خط Amiri كمثال)
  const doc = new jsPDF();
  doc.addFileToVFS("Amiri-Regular.ttf", "AAEAAAALAIAAAwR3T1JXl+GSauZyEz4ADLsMplD3AIaaayA1HcAhsGBG56B14AKFqFwT3z8iFz+aReXVrDctel6VgUp9xzM94kmWw9GMqwYYZn5JlCje8L7sWqC1Nz+MZWlUmUv7xyCZmSnnl8dD2drLV20hQm7jw+PqH5yM16rX2PpuwzBfHlMnI1xOD0GGeePSm49UBWrYP4UveHrEDJ8flFEwET5f2SZ9m02Zp9VnsboK9KnA7lAww1OZ7n5bO3ML//IN+06uZgqHe91jP9lGTdlv4ec95+FghmTRRIbOxlqHc5Cv1o0A+Chm2bTzKHYPXYN5h+5WtvvIQV0Ww+qsdECehbNpztn2trpvkpY9cl53tbAK5P4gs2htT4Hjcp1J9Jvj3kzy9ISXBZTTkiZsRmABt6g6w4c4h3nSeDblpOP5xx67I0l6hwxy3hXMmfG7FeBvRSFPtLOI9BG9vFP6PBXQdKwsMjoK1vwYNnXq2PpeRGApmzRVQuvJbRBRrr7YFj7LtDWj7TxExwC8Z3Xk+z14K+1md9g9gWpa4ie2tFcTYQ3Jgsr48Xa18g3PB+JLP7bKVG7c/yVZ0tm2uZceC/R8BF1z7MOoXmBXX48+op+hxkxuDxxP1uQL1n/y7VNCFi/f+gCAVXX5gqEMhbbBXtr3yQ==");
  doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");

  // إضافة النص باستخدام الخط العربي
  doc.setFont("Amiri");
  doc.text(outputText, 10, 10);
  doc.save("ExtractedText.pdf");
}

function allowDrop(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length) {
    const imageInput = document.getElementById("imageUpload");
    imageInput.files = files;
    extractText();
  }
}


async function translateText() {
  const outputText = document.getElementById("outputText").value;
  const targetLanguage = document.getElementById("targetLanguage").value;

  if (!outputText.trim()) {
    alert("يرجى استخراج النص أولاً!");
    return;
  }

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(outputText)}`);
    const result = await response.json();

    const translatedText = result[0].map(item => item[0]).join("");
    document.getElementById("outputText").value = translatedText;
    alert("تمت الترجمة بنجاح!");
  } catch (error) {
    console.error("حدث خطأ أثناء الترجمة:", error);
    alert("فشل في الترجمة. حاول مرة أخرى!");
  }
}





