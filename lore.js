let loreData = [
  "Elf próbował wyważyć drzwi telepatycznie. Nie wyszło.",
  "Zarejestrowano Elfa instalującego Windowsa 95 na lodówce.",
  "Elf płakał nad rozlanym mlekiem. Dosłownie.",
  "Śledzenie Elfa zakończone sukcesem: ukrywał się pod stołem IKEA.",
  "Analiza magiczna wykazała: Elfy mają +10 do chaotycznej głupoty."
];

function newLore() {
  if (loreData.length > 0) {
    const randomLore = loreData[Math.floor(Math.random() * loreData.length)];
    document.getElementById('lore').innerText = "RAPORT ELFÓW: " + randomLore;
  }
}

setInterval(newLore, 300000);