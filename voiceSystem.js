export function speak(text) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1.0;
    utter.rate = 1.1;
    
    // Pick a voice if available
    const voices = window.speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang.includes("en")) || voices[0];
    
    window.speechSynthesis.speak(utter);
}